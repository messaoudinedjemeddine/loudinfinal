const bcrypt = require('bcryptjs');
const prisma = require('./src/config/database');

async function testLogin() {
  try {
    console.log('🔐 Testing login functionality...');
    
    const email = 'admin@example.com';
    const password = 'admin123';
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('Role:', user.role);
    
    // Test password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      console.log('✅ Password is correct!');
      console.log('✅ Login should work with these credentials:');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      console.log('❌ Password is incorrect!');
      console.log('Stored password hash:', user.password);
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 