const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test brands query
    const brands = await prisma.brand.findMany();
    console.log(`✅ Found ${brands.length} brands`);
    
    // Test products query
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { brand: true }
    });
    console.log(`✅ Found ${products.length} active products`);
    
    // Test categories query
    const categories = await prisma.category.findMany({
      include: { brand: true }
    });
    console.log(`✅ Found ${categories.length} categories`);
    
    console.log('\n🎉 Database is working correctly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
