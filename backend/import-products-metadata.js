/**
 * Ecomputer Product Import Script - METADATA VERSION
 * 
 * Imports products from Shopify CSV export into Medusa 2.x
 * - Creates products with variants
 * - Stores ALL specs (including filterable attributes) in metadata
 * - Simpler and more reliable than separate attributes table
 * - NO image handling (user will add later)
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
  
  // Basic HTML stripping
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

// Create or update product with metadata
async function createOrUpdateProduct(token, productData) {
  console.log(`\n📦 Processing product: ${productData.title}`);
  
  try {
    // Check if product exists
    const checkResponse = await fetch(`${MEDUSA_BACKEND_URL}/admin/products?handle=${productData.handle}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const checkData = await checkResponse.json();
    const existingProduct = checkData.products && checkData.products.length > 0 ? checkData.products[0] : null;

    if (existingProduct) {
      // Update existing product
      console.log(`   ℹ️  Product exists, updating metadata...`);
      
      const updateResponse = await fetch(`${MEDUSA_BACKEND_URL}/admin/products/${existingProduct.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          metadata: productData.metadata,
        }),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Product update failed: ${errorText}`);
      }

      console.log(`   ✅ Product metadata updated`);
      return await updateResponse.json();

    } else {
      // Create new product
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
      console.log(`   ✅ Product created: ${productResult.product.id}`);
      return productResult;
    }

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  }
}

// Parse CSV and import products
async function importProducts() {
  console.log('🚀 Starting product import...\n');
  
  // Authenticate
  const token = await authenticate();
  
  // Read and parse CSV
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

      // Build product data - ALL in metadata
      const productData = {
        title: row['Title'],
        handle: handle,
        description: cleanHtml(row['Body (HTML)']),
        sku: row['Variant SKU'] || handle,
        price: Math.round(parseFloat(row['Variant Price'] || '0') * 100), // Convert to cents
        
        // ALL attributes and specs in metadata
        metadata: {
          // Filterable attributes
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
          
          // Additional display specs
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
          inventory_quantity: row['Variant Inventory Qty'] || '1',
        },
      };

      // Create or update product
      await createOrUpdateProduct(token, productData);
      successCount++;
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 300));

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
  console.log('\n💡 All attributes are stored in product metadata.');
  console.log('   Products are ready to display on the storefront!');
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
