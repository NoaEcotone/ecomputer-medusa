/**
 * Add All Products to Default Sales Channel
 * 
 * This script links all products to the default sales channel
 * so they become visible on the storefront.
 */

// Configuration
const MEDUSA_BACKEND_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'noa.holzmann@ecomputer.nl';
const ADMIN_PASSWORD = 'ecomputer123';

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
  console.log('✅ Authenticated successfully\n');
  
  return data.token;
}

// Get default sales channel
async function getDefaultSalesChannel(token) {
  console.log('📡 Fetching default sales channel...');
  
  const response = await fetch(`${MEDUSA_BACKEND_URL}/admin/sales-channels`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sales channels: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Find default sales channel
  const defaultChannel = data.sales_channels.find(
    channel => channel.name.toLowerCase().includes('default') || channel.is_default
  );

  if (!defaultChannel) {
    throw new Error('Default sales channel not found');
  }

  console.log(`✅ Found default sales channel: ${defaultChannel.name} (${defaultChannel.id})\n`);
  
  return defaultChannel.id;
}

// Get all products
async function getAllProducts(token) {
  console.log('📦 Fetching all products...');
  
  const response = await fetch(`${MEDUSA_BACKEND_URL}/admin/products?limit=100`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Found ${data.products.length} products\n`);
  
  return data.products;
}

// Add product to sales channel
async function addProductToSalesChannel(token, productId, salesChannelId) {
  const response = await fetch(`${MEDUSA_BACKEND_URL}/admin/products/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      sales_channels: [{ id: salesChannelId }]
    }),
  });

  return response.ok;
}

// Main function
async function linkProductsToSalesChannel() {
  console.log('🚀 Starting sales channel linking...\n');
  
  try {
    // Step 1: Authenticate
    const token = await authenticate();
    
    // Step 2: Get default sales channel
    const salesChannelId = await getDefaultSalesChannel(token);
    
    // Step 3: Get all products
    const products = await getAllProducts(token);
    
    // Step 4: Link each product to sales channel
    console.log('🔗 Linking products to sales channel...\n');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        // Check if already linked
        const alreadyLinked = product.sales_channels?.some(
          channel => channel.id === salesChannelId
        );
        
        if (alreadyLinked) {
          console.log(`⏭️  ${product.title} - Already linked`);
          skipCount++;
          continue;
        }
        
        // Link to sales channel
        const success = await addProductToSalesChannel(token, product.id, salesChannelId);
        
        if (success) {
          console.log(`✅ ${product.title} - Linked successfully`);
          successCount++;
        } else {
          console.log(`❌ ${product.title} - Failed to link`);
          errorCount++;
        }
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ ${product.title} - Error: ${error.message}`);
        errorCount++;
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 LINKING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully linked: ${successCount} products`);
    console.log(`⏭️  Already linked: ${skipCount} products`);
    console.log(`❌ Failed: ${errorCount} products`);
    console.log(`📦 Total processed: ${products.length} products`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    throw error;
  }
}

// Run the script
linkProductsToSalesChannel()
  .then(() => {
    console.log('\n🎉 Sales channel linking completed!');
    console.log('💡 Tip: Refresh your storefront to see the products!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
