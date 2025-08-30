const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function cleanAndSeedDatabase() {
  try {
    console.log('🧹 Starting database cleanup and seeding...');

    // Clean up existing data
    console.log('🗑️ Cleaning up existing data...');
    
    // Delete all orders and related data
    await prisma.orderCoupon.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    console.log('✅ Orders deleted');

    // Delete all products and related data
    await prisma.productSize.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    console.log('✅ Products deleted');

    // Delete all categories
    await prisma.category.deleteMany();
    console.log('✅ Categories deleted');

    // Delete all brands
    await prisma.brand.deleteMany();
    console.log('✅ Brands deleted');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created:', admin.email);

    // Create LOUDIM brand
    const loudimBrand = await prisma.brand.create({
      data: {
        name: 'LOUDIM',
        nameAr: 'لوديم',
        description: 'Traditional Algerian fashion for men',
        descriptionAr: 'الأزياء التقليدية الجزائرية للرجال',
        slug: 'loudim',
        isActive: true
      }
    });
    console.log('✅ LOUDIM brand created');

    // Create LOUD STYLES brand
    const loudStylesBrand = await prisma.brand.create({
      data: {
        name: 'LOUD STYLES',
        nameAr: 'لود ستايلز',
        description: 'Traditional Algerian fashion for women',
        descriptionAr: 'الأزياء التقليدية الجزائرية للنساء',
        slug: 'loud-styles',
        isActive: true
      }
    });
    console.log('✅ LOUD STYLES brand created');

    // Create LOUDIM categories
    const loudimCategories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Djellabas',
          nameAr: 'جلابيات',
          description: 'Traditional Algerian djellabas for men',
          descriptionAr: 'جلابيات تقليدية جزائرية للرجال',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          slug: 'djellabas',
          brandId: loudimBrand.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Burnous',
          nameAr: 'برنوس',
          description: 'Traditional Algerian burnous for men',
          descriptionAr: 'برنوس تقليدي جزائري للرجال',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          slug: 'burnous',
          brandId: loudimBrand.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Accessories',
          nameAr: 'إكسسوارات',
          description: 'Traditional accessories for men',
          descriptionAr: 'إكسسوارات تقليدية للرجال',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          slug: 'accessories',
          brandId: loudimBrand.id
        }
      })
    ]);
    console.log('✅ LOUDIM categories created:', loudimCategories.length);

    // Create LOUD STYLES categories
    const loudStylesCategories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Kaftans',
          nameAr: 'قفاطين',
          description: 'Traditional Algerian kaftans for women',
          descriptionAr: 'قفاطين تقليدية جزائرية للنساء',
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
          slug: 'kaftans',
          brandId: loudStylesBrand.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Takchitas',
          nameAr: 'تاكشيتات',
          description: 'Traditional Algerian takchitas for women',
          descriptionAr: 'تاكشيتات تقليدية جزائرية للنساء',
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
          slug: 'takchitas',
          brandId: loudStylesBrand.id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Jewelry',
          nameAr: 'مجوهرات',
          description: 'Traditional Algerian jewelry for women',
          descriptionAr: 'مجوهرات تقليدية جزائرية للنساء',
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
          slug: 'jewelry',
          brandId: loudStylesBrand.id
        }
      })
    ]);
    console.log('✅ LOUD STYLES categories created:', loudStylesCategories.length);

    // Create LOUDIM products
    const loudimProducts = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Classic White Djellaba',
          nameAr: 'جلابة بيضاء كلاسيكية',
          description: 'Traditional white djellaba with elegant embroidery',
          descriptionAr: 'جلابة بيضاء تقليدية مع تطريز أنيق',
          price: 45000,
          stock: 25,
          reference: 'LOUDIM-DJELLABA-001',
          slug: 'classic-white-djellaba',
          categoryId: loudimCategories[0].id,
          brandId: loudimBrand.id,
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              { size: 'S', stock: 5 },
              { size: 'M', stock: 8 },
              { size: 'L', stock: 7 },
              { size: 'XL', stock: 5 }
            ]
          },
          isActive: true
        }
      }),
      prisma.product.create({
        data: {
          name: 'Navy Blue Burnous',
          nameAr: 'برنوس أزرق داكن',
          description: 'Elegant navy blue burnous for special occasions',
          descriptionAr: 'برنوس أزرق داكن أنيق للمناسبات الخاصة',
          price: 35000,
          stock: 15,
          reference: 'LOUDIM-BURNOUS-001',
          slug: 'navy-blue-burnous',
          categoryId: loudimCategories[1].id,
          brandId: loudimBrand.id,
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              { size: 'M', stock: 5 },
              { size: 'L', stock: 6 },
              { size: 'XL', stock: 4 }
            ]
          },
          isActive: true
        }
      }),
      prisma.product.create({
        data: {
          name: 'Traditional Belt',
          nameAr: 'حزام تقليدي',
          description: 'Handcrafted traditional leather belt',
          descriptionAr: 'حزام جلد تقليدي مصنوع يدوياً',
          price: 8000,
          stock: 30,
          reference: 'LOUDIM-BELT-001',
          slug: 'traditional-belt',
          categoryId: loudimCategories[2].id,
          brandId: loudimBrand.id,
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              { size: 'S', stock: 10 },
              { size: 'M', stock: 10 },
              { size: 'L', stock: 10 }
            ]
          },
          isActive: true
        }
      })
    ]);
    console.log('✅ LOUDIM products created:', loudimProducts.length);

    // Create LOUD STYLES products
    const loudStylesProducts = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Embroidered Kaftan',
          nameAr: 'قفطان مطرز',
          description: 'Beautiful embroidered kaftan with traditional patterns',
          descriptionAr: 'قفطان مطرز جميل مع أنماط تقليدية',
          price: 65000,
          stock: 20,
          reference: 'LOUDSTYLES-KAFTAN-001',
          slug: 'embroidered-kaftan',
          categoryId: loudStylesCategories[0].id,
          brandId: loudStylesBrand.id,
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              { size: 'S', stock: 5 },
              { size: 'M', stock: 7 },
              { size: 'L', stock: 5 },
              { size: 'XL', stock: 3 }
            ]
          },
          isActive: true
        }
      }),
      prisma.product.create({
        data: {
          name: 'Wedding Takchita',
          nameAr: 'تاكشيتة زفاف',
          description: 'Elegant wedding takchita with gold embroidery',
          descriptionAr: 'تاكشيتة زفاف أنيقة مع تطريز ذهبي',
          price: 85000,
          stock: 10,
          reference: 'LOUDSTYLES-TAKCHITA-001',
          slug: 'wedding-takchita',
          categoryId: loudStylesCategories[1].id,
          brandId: loudStylesBrand.id,
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              { size: 'S', stock: 2 },
              { size: 'M', stock: 3 },
              { size: 'L', stock: 3 },
              { size: 'XL', stock: 2 }
            ]
          },
          isActive: true
        }
      }),
      prisma.product.create({
        data: {
          name: 'Traditional Necklace',
          nameAr: 'قلادة تقليدية',
          description: 'Handcrafted traditional silver necklace',
          descriptionAr: 'قلادة فضية تقليدية مصنوعة يدوياً',
          price: 15000,
          stock: 25,
          reference: 'LOUDSTYLES-NECKLACE-001',
          slug: 'traditional-necklace',
          categoryId: loudStylesCategories[2].id,
          brandId: loudStylesBrand.id,
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              { size: 'One Size', stock: 25 }
            ]
          },
          isActive: true
        }
      })
    ]);
    console.log('✅ LOUD STYLES products created:', loudStylesProducts.length);

    // Create sample cities (Algerian cities)
    const cities = await Promise.all([
      prisma.city.upsert({
        where: { code: '16' },
        update: {},
        create: {
          name: 'Algiers',
          nameAr: 'الجزائر',
          code: '16',
          isActive: true
        }
      }),
      prisma.city.upsert({
        where: { code: '31' },
        update: {},
        create: {
          name: 'Oran',
          nameAr: 'وهران',
          code: '31',
          isActive: true
        }
      }),
      prisma.city.upsert({
        where: { code: '25' },
        update: {},
        create: {
          name: 'Constantine',
          nameAr: 'قسنطينة',
          code: '25',
          isActive: true
        }
      })
    ]);
    console.log('✅ Cities created:', cities.length);

    // Create sample delivery desks
    const deliveryDesks = await Promise.all([
      prisma.deliveryDesk.create({
        data: {
          name: 'Algiers Central Desk',
          nameAr: 'مكتب الجزائر المركزي',
          address: 'Downtown Algiers, Rue de la Liberté',
          phone: '+213 21 123456',
          cityId: cities[0].id,
          isActive: true
        }
      }),
      prisma.deliveryDesk.create({
        data: {
          name: 'Oran Main Office',
          nameAr: 'المكتب الرئيسي لوهران',
          address: 'City Center Oran, Place du 1er Novembre',
          phone: '+213 41 123456',
          cityId: cities[1].id,
          isActive: true
        }
      })
    ]);
    console.log('✅ Delivery desks created:', deliveryDesks.length);

    console.log('🎉 Database cleanup and seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Admin user: ${admin.email}`);
    console.log(`- Brands: 2 (LOUDIM, LOUD STYLES)`);
    console.log(`- LOUDIM categories: ${loudimCategories.length}`);
    console.log(`- LOUD STYLES categories: ${loudStylesCategories.length}`);
    console.log(`- LOUDIM products: ${loudimProducts.length}`);
    console.log(`- LOUD STYLES products: ${loudStylesProducts.length}`);
    console.log(`- Cities: ${cities.length}`);
    console.log(`- Delivery desks: ${deliveryDesks.length}`);

  } catch (error) {
    console.error('❌ Error during cleanup and seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup and seeding
if (require.main === module) {
  cleanAndSeedDatabase();
}

module.exports = { cleanAndSeedDatabase };
