const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await testEndpoint('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.data).substring(0, 100)}...\n`);
    
    // Test categories endpoint
    console.log('2. Testing categories endpoint (LOUD STYLES)...');
    const categories = await testEndpoint('/api/categories?brand=loud-styles');
    console.log(`   Status: ${categories.status}`);
    if (categories.status === 200) {
      console.log(`   Categories found: ${categories.data.categories?.length || 0}\n`);
    } else {
      console.log(`   Error: ${JSON.stringify(categories.data)}\n`);
    }
    
    // Test products endpoint
    console.log('3. Testing products endpoint (LOUD STYLES)...');
    const products = await testEndpoint('/api/products?brand=loud-styles');
    console.log(`   Status: ${products.status}`);
    if (products.status === 200) {
      console.log(`   Products found: ${products.data.products?.length || 0}\n`);
    } else {
      console.log(`   Error: ${JSON.stringify(products.data)}\n`);
    }
    
    // Test specific product
    console.log('4. Testing specific product endpoint...');
    const product = await testEndpoint('/api/products/slug/embroidered-kaftan?brand=loud-styles');
    console.log(`   Status: ${product.status}`);
    if (product.status === 200) {
      console.log(`   Product found: ${product.data.product ? 'Yes' : 'No'}\n`);
    } else {
      console.log(`   Error: ${JSON.stringify(product.data)}\n`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
