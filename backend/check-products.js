const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    console.log('🔍 Checking products in database...');
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true,
        categoryId: true
      },
      where: {
        isActive: true
      }
    });
    
    console.log(`📦 Found ${products.length} active products:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id}`);
      console.log(`   Name: ${product.name}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Category ID: ${product.categoryId}`);
      console.log('---');
    });
    
    // Also check categories
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      }
    });
    
    console.log(`📂 Found ${categories.length} categories:`);
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ID: ${category.id}`);
      console.log(`   Name: ${category.name}`);
      console.log(`   Slug: ${category.slug}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error checking products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
