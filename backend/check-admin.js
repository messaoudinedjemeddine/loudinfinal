const prisma = require('./src/config/database');

async function checkAdminUser() {
  try {
    console.log('🔍 Checking for admin user...');
    
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (adminUser) {
      console.log('✅ Admin user found!');
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
      console.log('First Name:', adminUser.firstName);
      console.log('Last Name:', adminUser.lastName);
      console.log('Created:', adminUser.createdAt);
    } else {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...');
      
      // Create admin user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN'
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('Email:', newAdmin.email);
      console.log('Password: admin123');
      console.log('Role:', newAdmin.role);
    }

    // Also check all users
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        firstName: true,
        lastName: true
      }
    });
    
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.firstName} ${user.lastName}`);
    });

  } catch (error) {
    console.error('❌ Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser(); 