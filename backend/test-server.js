const http = require('http');

async function testServer() {
  console.log('🧪 Testing server connection...\n');
  
  // Test health endpoint
  try {
    const healthResponse = await makeRequest('GET', '/health');
    console.log('✅ Health check:', healthResponse);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test products endpoint
  try {
    const productsResponse = await makeRequest('GET', '/api/products?brand=loud-styles');
    console.log('✅ Products API:', JSON.parse(productsResponse).products.length, 'products found');
  } catch (error) {
    console.log('❌ Products API failed:', error.message);
  }
  
  // Test specific product
  try {
    const productResponse = await makeRequest('GET', '/api/products/slug/embroidered-kaftan?brand=loud-styles');
    const productData = JSON.parse(productResponse);
    console.log('✅ Product API:', productData.product ? 'Product found' : 'Product not found');
  } catch (error) {
    console.log('❌ Product API failed:', error.message);
  }
}

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

testServer().catch(console.error);
