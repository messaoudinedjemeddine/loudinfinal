const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('Creating test users...');

    // Create a test confirmatrice user
    const confirmatricePassword = await bcrypt.hash('confirmatrice123', 12);
    const confirmatrice = await prisma.user.upsert({
      where: { email: 'confirmatrice@test.com' },
      update: { role: 'CONFIRMATRICE' },
      create: {
        email: 'confirmatrice@test.com',
        password: confirmatricePassword,
        firstName: 'Marie',
        lastName: 'Dubois',
        phone: '+212600000001',
        role: 'CONFIRMATRICE'
      }
    });

    // Create a test agent livraison user
    const agentPassword = await bcrypt.hash('agent123', 12);
    const agent = await prisma.user.upsert({
      where: { email: 'agent@test.com' },
      update: { role: 'AGENT_LIVRAISON' },
      create: {
        email: 'agent@test.com',
        password: agentPassword,
        firstName: 'Ahmed',
        lastName: 'Alami',
        phone: '+212600000002',
        role: 'AGENT_LIVRAISON'
      }
    });

    console.log('Test users created successfully!');
    console.log('Confirmatrice:', confirmatrice.email, '(password: confirmatrice123)');
    console.log('Agent Livraison:', agent.email, '(password: agent123)');
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
