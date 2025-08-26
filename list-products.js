const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listProducts() {
  try {
    console.log('🔍 Fetching products from database...');
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true
      }
    });

    console.log(`📦 Found ${products.length} products:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id}`);
      console.log(`   Name: ${product.name}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Active: ${product.isActive}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listProducts();
