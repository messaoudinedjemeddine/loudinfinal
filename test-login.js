const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.token) {
      console.log('✅ Token received:', response.data.token.substring(0, 20) + '...');
    }
    
    if (response.data.user) {
      console.log('✅ User role:', response.data.user.role);
    }
    
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin(); 