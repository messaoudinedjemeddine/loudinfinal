const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database state...\n');
    
    // Check brands
    const brands = await prisma.brand.findMany();
    console.log('📋 Brands:');
    brands.forEach(brand => {
      console.log(`  - ${brand.name} (slug: ${brand.slug}, id: ${brand.id})`);
    });
    
    console.log('\n📦 Products:');
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true
      }
    });
    
    products.forEach(product => {
      console.log(`  - ${product.name} (slug: ${product.slug})`);
      console.log(`    Brand: ${product.brand?.name} (${product.brand?.slug})`);
      console.log(`    Category: ${product.category?.name} (${product.category?.slug})`);
      console.log('');
    });
    
    // Test the API query
    console.log('🧪 Testing API query for "embroidered-kaftan" with brand "loud-styles"...');
    const testProduct = await prisma.product.findFirst({
      where: {
        slug: 'embroidered-kaftan',
        brand: {
          slug: 'loud-styles'
        }
      },
      include: {
        brand: true,
        category: true
      }
    });
    
    if (testProduct) {
      console.log('✅ Found product:', testProduct.name);
      console.log('   Brand:', testProduct.brand.name);
      console.log('   Category:', testProduct.category.name);
    } else {
      console.log('❌ Product not found with brand filter');
      
      // Check if product exists without brand filter
      const productWithoutBrand = await prisma.product.findFirst({
        where: {
          slug: 'embroidered-kaftan'
        },
        include: {
          brand: true
        }
      });
      
      if (productWithoutBrand) {
        console.log('⚠️  Product exists but with different brand:', productWithoutBrand.brand?.name);
      } else {
        console.log('❌ Product does not exist at all');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
