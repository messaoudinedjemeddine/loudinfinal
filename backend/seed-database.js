const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true
      }
    });
    console.log('✅ Admin user created:', admin.email);

    // Create sample categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: {
          name: 'Electronics',
          nameAr: 'الإلكترونيات',
          description: 'Latest electronic devices and gadgets',
          descriptionAr: 'أحدث الأجهزة الإلكترونية والأدوات',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
          isActive: true
        }
      }),
      prisma.category.upsert({
        where: { name: 'Fashion' },
        update: {},
        create: {
          name: 'Fashion',
          nameAr: 'الأزياء',
          description: 'Trendy fashion items and accessories',
          descriptionAr: 'عناصر الأزياء والإكسسوارات العصرية',
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
          isActive: true
        }
      }),
      prisma.category.upsert({
        where: { name: 'Home & Garden' },
        update: {},
        create: {
          name: 'Home & Garden',
          nameAr: 'المنزل والحديقة',
          description: 'Home improvement and garden supplies',
          descriptionAr: 'مستلزمات تحسين المنزل والحديقة',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
          isActive: true
        }
      })
    ]);
    console.log('✅ Categories created:', categories.length);

    // Create sample products
    const products = await Promise.all([
      prisma.product.upsert({
        where: { name: 'iPhone 15 Pro' },
        update: {},
        create: {
          name: 'iPhone 15 Pro',
          nameAr: 'آيفون 15 برو',
          description: 'Latest iPhone with advanced features',
          descriptionAr: 'أحدث آيفون مع ميزات متقدمة',
          price: 150000,
          stock: 50,
          categoryId: categories[0].id,
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
                isPrimary: true
              }
            ]
          },
          isActive: true
        }
      }),
      prisma.product.upsert({
        where: { name: 'Samsung Galaxy S24' },
        update: {},
        create: {
          name: 'Samsung Galaxy S24',
          nameAr: 'سامسونج جالكسي إس 24',
          description: 'Premium Android smartphone',
          descriptionAr: 'هاتف أندرويد فاخر',
          price: 120000,
          stock: 30,
          categoryId: categories[0].id,
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
                isPrimary: true
              }
            ]
          },
          isActive: true
        }
      }),
      prisma.product.upsert({
        where: { name: 'Designer Watch' },
        update: {},
        create: {
          name: 'Designer Watch',
          nameAr: 'ساعة مصمم',
          description: 'Luxury designer watch',
          descriptionAr: 'ساعة فاخرة من مصمم',
          price: 25000,
          stock: 20,
          categoryId: categories[1].id,
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
                isPrimary: true
              }
            ]
          },
          isActive: true
        }
      })
    ]);
    console.log('✅ Products created:', products.length);

    // Create sample cities (Algerian cities)
    const cities = await Promise.all([
      prisma.city.upsert({
        where: { name: 'Algiers' },
        update: {},
        create: {
          name: 'Algiers',
          nameAr: 'الجزائر',
          isActive: true
        }
      }),
      prisma.city.upsert({
        where: { name: 'Oran' },
        update: {},
        create: {
          name: 'Oran',
          nameAr: 'وهران',
          isActive: true
        }
      }),
      prisma.city.upsert({
        where: { name: 'Constantine' },
        update: {},
        create: {
          name: 'Constantine',
          nameAr: 'قسنطينة',
          isActive: true
        }
      })
    ]);
    console.log('✅ Cities created:', cities.length);

    // Create sample delivery desks
    const deliveryDesks = await Promise.all([
      prisma.deliveryDesk.upsert({
        where: { name: 'Algiers Central Desk' },
        update: {},
        create: {
          name: 'Algiers Central Desk',
          nameAr: 'مكتب الجزائر المركزي',
          address: 'Downtown Algiers, Rue de la Liberté',
          phone: '+213 21 123456',
          cityId: cities[0].id,
          isActive: true
        }
      }),
      prisma.deliveryDesk.upsert({
        where: { name: 'Oran Main Office' },
        update: {},
        create: {
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

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Admin user: ${admin.email}`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Cities: ${cities.length}`);
    console.log(`- Delivery desks: ${deliveryDesks.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
