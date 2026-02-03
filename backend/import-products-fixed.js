/**
 * Ecomputer Product Import Script - FIXED VERSION
 * 
 * Imports products from Shopify CSV export into Medusa 2.x
 * - Creates products with variants
 * - Adds filterable attributes  
 * - Stores additional specs as metadata
 * - NO image handling (user will add later)
 * - NO inventory management (Medusa 2.x handles separately)
 */

const fs = require('fs');
const csv = require('csv-parser');

// Configuration
const MEDUSA_BACKEND_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'noa.holzmann@ecomputer.nl';
const ADMIN_PASSWORD = 'ecomputer123';
const CSV_FILE_PATH = './products_export_1(4).csv'; // Place CSV in backend directory

// Data normalization functions
function normalizeRamSize(ramString) {
  if (!ramString) return null;
  const match = ramString.match(/(\d+)\s*GB/i);
  return match ? parseInt(match[1]) : null;
}

function normalizeStorageCapacity(storageString) {
  if (!storageString) return null;
  
  // Handle TB
  const tbMatch = storageString.match(/(\d+)\s*TB/i);
  if (tbMatch) return parseInt(tbMatch[1]) * 1000;
  
  // Handle GB
  const gbMatch = storageString.match(/(\d+)\s*GB/i);
  return gbMatch ? parseInt(gbMatch[1]) : null;
}

function normalizeStorageType(typeString) {
  if (!typeString) return null;
  
  if (typeString.includes('M.2 NVMe')) return 'M.2 NVMe';
  if (typeString.includes('NVMe')) return 'NVMe';
  if (typeString.includes('SSD')) return 'SSD';
  
  return null;
}

function normalizeScreenSize(screenString) {
  if (!screenString) return null;
  
  // Remove quotes and convert comma to dot
  const cleaned = screenString.replace(/["']/g, '').replace(',', '.');
  const match = cleaned.match(/(\d+\.?\d*)/);
  
  return match ? parseFloat(match[1]) : null;
}

function normalizeScreenResolution(resolutionString) {
  if (!resolutionString) return null;
  
  // Extract just the numbers (e.g., "1920 × 1080 FHD" -> "1920x1080")
  const cleaned = resolutionString.replace(/\s+/g, '').replace(/[×x]/g, 'x');
  const match = cleaned.match(/(\d+x\d+)/);
  
  return match ? match[1] : null;
}

function normalizeProcessorFamily(processorString) {
  if (!processorString) return null;
  
  const lower = processorString.toLowerCase();
  
  if (lower.includes('core i5')) return 'intel-core-i5';
  if (lower.includes('core i7')) return 'intel-core-i7';
  if (lower.includes('core i9')) return 'intel-core-i9';
  if (lower.includes('core ultra') || lower.includes('core u7') || lower.includes('core u9')) return 'intel-core-ultra-7';
  if (lower.includes('ryzen') && lower.includes('5')) return 'ryzen-5';
  
  return 'other';
}

function normalizeGraphicsType(graphicsString) {
  if (!graphicsString) return null;
  
  const lower = graphicsString.toLowerCase();
  
  if (lower.includes('nvidia') || lower.includes('radeon rx') || lower.includes('radeon pro')) {
    return 'Dedicated';
  }
  
  return 'Geïntegreerd';
}

function normalizeCondition(conditionString) {
  if (!conditionString) return 'Nieuw';
  
  const lower = conditionString.toLowerCase();
  return lower.includes('renewed') || lower.includes('refurbished') ? 'Renewed' : 'Nieuw';
}

// Clean HTML from description
function cleanHtml(html) {
  if (!html) return '';
  
  // Basic HTML stripping (for better results, use a proper HTML parser)
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 500); // Limit length
}

// Authenticate and get token
async function authenticate() {
  console.log('🔐 Authenticating...');
  
  const response = await fetch(`${MEDUSA_BACKEND_URL}/auth/user/emailpass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Authenticated successfully');
  
  return data.token;
}

// Create product with attributes
async function createProduct(token, productData) {
  console.log(`\n📦 Creating product: ${productData.title}`);
  
  try {
    // Step 1: Create the product (WITHOUT inventory fields)
    const productResponse = await fetch(`${MEDUSA_BACKEND_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: productData.title,
        handle: productData.handle,
        description: productData.description,
        status: 'published',
        is_giftcard: false,
        discountable: true,
        options: [
          {
            title: 'Default',
            values: ['Default Option']
          }
        ],
        variants: [
          {
            title: 'Default',
            sku: productData.sku,
            prices: [
              {
                amount: productData.price,
                currency_code: 'eur',
              }
            ],
            options: {
              Default: 'Default Option'
            }
          }
        ],
        metadata: productData.metadata,
      }),
    });

    if (!productResponse.ok) {
      const errorText = await productResponse.text();
      throw new Error(`Product creation failed: ${errorText}`);
    }

    const productResult = await productResponse.json();
    const productId = productResult.product.id;
    
    console.log(`✅ Product created: ${productId}`);

    // Step 2: Create product attributes
    if (productData.attributes) {
      console.log(`   Adding attributes...`);
      
      const attributesResponse = await fetch(`${MEDUSA_BACKEND_URL}/admin/product-attributes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          ...productData.attributes,
        }),
      });

      if (attributesResponse.ok) {
        console.log(`   ✅ Attributes added`);
      } else {
        const errorText = await attributesResponse.text();
        console.log(`   ⚠️  Attributes failed: ${errorText}`);
      }
    }

    return productResult;

  } catch (error) {
    console.error(`❌ Error creating product: ${error.message}`);
    throw error;
  }
}

// Parse CSV and import products
async function importProducts() {
  console.log('🚀 Starting product import...\n');
  
  // Authenticate
  const token = await authenticate();
  
  // Read and parse CSV
  const products = [];
  const productMap = new Map(); // Group by handle
  
  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (row) => {
        const handle = row['Handle'];
        
        if (!handle) return;
        
        // Group rows by handle (multiple rows = variants, but we'll use first row only)
        if (!productMap.has(handle)) {
          productMap.set(handle, row);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`📊 Found ${productMap.size} unique products\n`);

  // Process each product
  let successCount = 0;
  let errorCount = 0;

  for (const [handle, row] of productMap) {
    try {
      // Extract and normalize data
      const processorType = row['Processor (product.metafields.custom.processor_type)'];
      const ramString = row['RAM geheugen (product.metafields.custom.ram_geheugen)'];
      const storageString = row['Totale opslagcapaciteit (product.metafields.custom.totale_opslagcapaciteit)'];
      const storageTypeString = row['Type opslag (product.metafields.custom.type_opslag)'];
      const screenSizeString = row['Schermdiagonaal (product.metafields.custom.schermdiagonaal)'];
      const screenResString = row['Schermresolutie (product.metafields.custom.schermresolutie)'];
      const graphicsString = row['Videokaart (product.metafields.custom.videokaart)'];
      const osString = row['Besturingssysteem (product.metafields.custom.besturingssysteem)'];
      const conditionString = row['Cosmetic condition (product.metafields.shopify.cosmetic-condition)'];

      // Build product data
      const productData = {
        title: row['Title'],
        handle: handle,
        description: cleanHtml(row['Body (HTML)']),
        sku: row['Variant SKU'] || handle,
        price: Math.round(parseFloat(row['Variant Price'] || '0') * 100), // Convert to cents
        
        // Filterable attributes
        attributes: {
          processor_type: processorType || null,
          processor_family: normalizeProcessorFamily(processorType),
          ram_size: normalizeRamSize(ramString),
          storage_capacity: normalizeStorageCapacity(storageString),
          storage_type: normalizeStorageType(storageTypeString),
          screen_size: normalizeScreenSize(screenSizeString),
          screen_resolution: normalizeScreenResolution(screenResString),
          graphics_type: normalizeGraphicsType(graphicsString),
          graphics_card: graphicsString || null,
          condition: normalizeCondition(conditionString),
          operating_system: osString || null,
        },
        
        // Additional metadata (display-only specs)
        metadata: {
          keyboard_language: row['Keyboard Taal (product.metafields.custom.keyboard_taal)'] || null,
          keyboard_backlight: row['Keyboard Verlichting (product.metafields.custom.keyboard_verlichting)'] || null,
          webcam: row['Webcam (product.metafields.custom.webcam)'] || null,
          fingerprint_reader: row['Finger Print Reader (product.metafields.custom.finger_print_reader)'] || null,
          bluetooth: row['Bluetooth (product.metafields.custom.bluetooth)'] || null,
          wifi: row['Draadloos (Wifi) (product.metafields.custom.draadloos_wifi)'] || null,
          lan: row['Netwerk / LAN (product.metafields.custom.netwerk_lan)'] || null,
          weight: row['Gewicht (product.metafields.custom.gewicht)'] || null,
          dimensions: row['Afmetingen (product.metafields.custom.afmetingen)'] || null,
          hdmi: row['HDMI (product.metafields.custom.hdmi)'] || null,
          display_port: row['Display Poort (product.metafields.custom.display_poort)'] || null,
          touchscreen: row['Touch Screen (product.metafields.custom.touch_screen)'] || null,
          speakers: row['Speaker (product.metafields.custom.speaker)'] || null,
          usb_ports: JSON.stringify({
            usb_a: row['USB-A (product.metafields.custom.usb_a)'] || null,
            usb_c: row['USB-C (product.metafields.custom.usb_c)'] || null,
            thunderbolt_3: row['USB 3.2 Thunderbolt 3 (product.metafields.custom.usb_3_2_thunderbolt_3)'] || null,
            thunderbolt_4: row['USB 3.2 Thunderbolt 4 (product.metafields.custom.usb_3_2_thunderbolt_4)'] || null,
          }),
          original_price: row['Nieuwprijs was (product.metafields.custom.nieuwprijs_was)'] || null,
          inventory_quantity: row['Variant Inventory Qty'] || '1', // Store in metadata instead
        },
      };

      // Create product
      await createProduct(token, productData);
      successCount++;
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`❌ Failed to import ${handle}: ${error.message}`);
      errorCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully imported: ${successCount} products`);
  console.log(`❌ Failed: ${errorCount} products`);
  console.log(`📦 Total processed: ${productMap.size} products`);
  console.log('='.repeat(60));
  console.log('\n💡 Note: Inventory quantities are stored in metadata.');
  console.log('   You can manage inventory via the Admin Dashboard later.');
}

// Run import
importProducts()
  .then(() => {
    console.log('\n🎉 Import completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  });
