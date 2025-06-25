const bcrypt = require('bcryptjs');
const prisma = require('./src/config/database');

const users = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN'
  },
  {
    email: 'superadmin@example.com',
    password: 'super123',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'SUPERADMIN'
  },
  {
    email: 'callcenter@example.com',
    password: 'call123',
    firstName: 'Call',
    lastName: 'Center',
    role: 'CALL_CENTER'
  },
  {
    email: 'orderconfirmation@example.com',
    password: 'order123',
    firstName: 'Order',
    lastName: 'Processor',
    role: 'ORDER_CONFIRMATION'
  },
  {
    email: 'delivery@example.com',
    password: 'delivery123',
    firstName: 'Delivery',
    lastName: 'Agent',
    role: 'DELIVERY_COORDINATOR'
  }
];

async function createRoleUsers() {
  try {
    console.log('🚀 Creating users for all roles...\n');

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists!`);
        console.log(`   Role: ${existingUser.role}`);
        console.log(`   Password: ${userData.password}\n`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        }
      });

      console.log(`✅ Created ${userData.role} user successfully!`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Role: ${user.role}\n`);
    }

    console.log('🎉 All users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('=====================');
    users.forEach(user => {
      console.log(`${user.role}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log('');
    });

    console.log('🌐 You can now log in to the admin panel with these credentials.');
    console.log('   Each user will see their role-specific dashboard.');

  } catch (error) {
    console.error('❌ Failed to create users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRoleUsers(); 