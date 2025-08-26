const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getNewProductIds() {
  try {
    console.log('🔍 Fetching new products from database...');
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true,
        slug: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`📦 Found ${products.length} products:`);
    console.log('');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Price: ${product.price} DZD`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Slug: ${product.slug}`);
      console.log('');
    });

    console.log('🎯 For testing, you can use any of these product IDs in your cart!');

  } catch (error) {
    console.error('❌ Error fetching products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getNewProductIds();
