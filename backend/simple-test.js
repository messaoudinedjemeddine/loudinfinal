const http = require('http');

function makeRequest(path) {
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
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing API...\n');
  
  try {
    // Test 1: Health endpoint
    console.log('1. Testing health endpoint...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.data).substring(0, 100)}...\n`);
    
    // Test 2: Categories endpoint
    console.log('2. Testing categories endpoint...');
    const categories = await makeRequest('/api/categories?brand=loud-styles');
    console.log(`   Status: ${categories.status}`);
    if (categories.status === 200) {
      console.log(`   Categories found: ${categories.data.categories?.length || 0}\n`);
    } else {
      console.log(`   Error: ${JSON.stringify(categories.data)}\n`);
    }
    
    // Test 3: Products endpoint
    console.log('3. Testing products endpoint...');
    const products = await makeRequest('/api/products?brand=loud-styles');
    console.log(`   Status: ${products.status}`);
    if (products.status === 200) {
      console.log(`   Products found: ${products.data.products?.length || 0}\n`);
    } else {
      console.log(`   Error: ${JSON.stringify(products.data)}\n`);
    }
    
    // Test 4: Specific product
    console.log('4. Testing specific product...');
    const product = await makeRequest('/api/products/slug/embroidered-kaftan?brand=loud-styles');
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

test();
