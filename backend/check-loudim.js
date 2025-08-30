const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLoudimProducts() {
  try {
    console.log('🔍 Checking LOUDIM products...\n');
    
    const products = await prisma.product.findMany({
      where: {
        brand: {
          slug: 'loudim'
        }
      },
      include: {
        brand: true,
        category: true
      }
    });
    
    console.log(`📦 Found ${products.length} LOUDIM products:\n`);
    products.forEach(product => {
      console.log(`- ${product.name} (slug: ${product.slug})`);
      console.log(`  Category: ${product.category.name}`);
      console.log(`  Brand: ${product.brand.name}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLoudimProducts();
