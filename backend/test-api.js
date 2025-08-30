const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAPIs() {
  try {
    console.log('🧪 Testing APIs...\n');
    
    // Test LOUDIM products
    console.log('📦 Testing LOUDIM Products API:');
    const loudimProducts = await prisma.product.findMany({
      where: {
        brand: {
          slug: 'loudim'
        },
        isActive: true
      },
      include: {
        brand: true,
        category: true
      }
    });
    
    console.log(`Found ${loudimProducts.length} LOUDIM products:`);
    loudimProducts.forEach(product => {
      console.log(`- ${product.name} (Brand: ${product.brand.name})`);
    });
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test LOUDIM categories
    console.log('📂 Testing LOUDIM Categories API:');
    const loudimCategories = await prisma.category.findMany({
      where: {
        brand: {
          slug: 'loudim'
        }
      },
      include: {
        brand: true,
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      }
    });
    
    console.log(`Found ${loudimCategories.length} LOUDIM categories:`);
    loudimCategories.forEach(category => {
      console.log(`- ${category.name} (Brand: ${category.brand.name}, Products: ${category._count.products})`);
    });
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test LOUD STYLES products
    console.log('📦 Testing LOUD STYLES Products API:');
    const loudStylesProducts = await prisma.product.findMany({
      where: {
        brand: {
          slug: 'loud-styles'
        },
        isActive: true
      },
      include: {
        brand: true,
        category: true
      }
    });
    
    console.log(`Found ${loudStylesProducts.length} LOUD STYLES products:`);
    loudStylesProducts.forEach(product => {
      console.log(`- ${product.name} (Brand: ${product.brand.name})`);
    });
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test LOUD STYLES categories
    console.log('📂 Testing LOUD STYLES Categories API:');
    const loudStylesCategories = await prisma.category.findMany({
      where: {
        brand: {
          slug: 'loud-styles'
        }
      },
      include: {
        brand: true,
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      }
    });
    
    console.log(`Found ${loudStylesCategories.length} LOUD STYLES categories:`);
    loudStylesCategories.forEach(category => {
      console.log(`- ${category.name} (Brand: ${category.brand.name}, Products: ${category._count.products})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPIs();
