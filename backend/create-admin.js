const bcrypt = require('bcryptjs');
const prisma = require('./src/config/database');

async function createAdminUser() {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    const firstName = 'Admin';
    const lastName = 'User';

    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('Admin user already exists!');
      console.log('Email:', email);
      console.log('Password:', password);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', user.role);
    console.log('\nYou can now log in to the admin panel with these credentials.');

  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 