const bcrypt = require('bcryptjs');
const prisma = require('./src/config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productSize.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.deliveryDesk.deleteMany();
    await prisma.city.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      }
    });

    // Create call center staff
    console.log('📞 Creating call center staff...');
    const callCenterStaff = await Promise.all([
      prisma.user.create({
        data: {
          email: 'callcenter1@example.com',
          password: hashedPassword,
          firstName: 'Fatima',
          lastName: 'Benali',
          role: 'CALL_CENTER',
          phone: '+213 555 111 111'
        }
      }),
      prisma.user.create({
        data: {
          email: 'callcenter2@example.com',
          password: hashedPassword,
          firstName: 'Amina',
          lastName: 'Khelifi',
          role: 'CALL_CENTER',
          phone: '+213 555 222 222'
        }
      }),
      prisma.user.create({
        data: {
          email: 'callcenter3@example.com',
          password: hashedPassword,
          firstName: 'Sara',
          lastName: 'Boudiaf',
          role: 'CALL_CENTER',
          phone: '+213 555 333 333'
        }
      })
    ]);

    // Create order confirmation staff
    console.log('✅ Creating order confirmation staff...');
    const orderConfirmationStaff = await Promise.all([
      prisma.user.create({
        data: {
          email: 'confirmation1@example.com',
          password: hashedPassword,
          firstName: 'Mohamed',
          lastName: 'Slimani',
          role: 'ORDER_CONFIRMATION',
          phone: '+213 555 444 444'
        }
      }),
      prisma.user.create({
        data: {
          email: 'confirmation2@example.com',
          password: hashedPassword,
          firstName: 'Karim',
          lastName: 'Toumi',
          role: 'ORDER_CONFIRMATION',
          phone: '+213 555 555 555'
        }
      })
    ]);

    // Create delivery coordinator
    console.log('🚚 Creating delivery coordinator...');
    const deliveryCoordinator = await prisma.user.create({
      data: {
        email: 'delivery@example.com',
        password: hashedPassword,
        firstName: 'Ahmed',
        lastName: 'Zerrouki',
        role: 'DELIVERY_COORDINATOR',
        phone: '+213 555 666 666'
      }
    });

    // Create regular user
    console.log('👤 Creating regular user...');
    const regularUser = await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: hashedPassword,
        firstName: 'Regular',
        lastName: 'User',
        role: 'USER'
      }
    });

    // Create categories
    console.log('📂 Creating categories...');
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Traditional Dresses',
          nameAr: 'فساتين تقليدية',
          slug: 'traditional-dresses',
          description: 'Beautiful traditional Algerian dresses',
          descriptionAr: 'فساتين جزائرية تقليدية جميلة'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Modern Abayas',
          nameAr: 'عبايات عصرية',
          slug: 'modern-abayas',
          description: 'Elegant modern abayas',
          descriptionAr: 'عبايات عصرية أنيقة'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Embroidered Caftans',
          nameAr: 'قفاطين مطرزة',
          slug: 'embroidered-caftans',
          description: 'Hand-embroidered caftans',
          descriptionAr: 'قفاطين مطرزة يدوياً'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Bridal Collection',
          nameAr: 'مجموعة العروس',
          slug: 'bridal-collection',
          description: 'Special bridal dresses',
          descriptionAr: 'فساتين عروس خاصة'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Casual Wear',
          nameAr: 'ملابس عادية',
          slug: 'casual-wear',
          description: 'Comfortable casual clothing',
          descriptionAr: 'ملابس عادية مريحة'
        }
      })
    ]);

    // Create products
    console.log('👗 Creating products...');
    const products = await Promise.all([
      // Traditional Dresses
      prisma.product.create({
        data: {
          name: "Traditional Karakou Dress",
          nameAr: "فستان قراقو تقليدي",
          description: "Beautiful traditional Karakou dress with intricate embroidery",
          descriptionAr: "فستان قراقو تقليدي جميل مع تطريز معقد",
          price: 25000,
          oldPrice: 35000,
          stock: 15,
          reference: "KAR-001",
          slug: "traditional-karakou-dress",
          isOnSale: true,
          isActive: true,
          categoryId: categories[0].id,
          images: {
            create: [
              {
                url: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800",
                isPrimary: true
              },
              {
                url: "https://images.pexels.com/photos/3755707/pexels-photo-3755707.jpeg?auto=compress&cs=tinysrgb&w=800",
                isPrimary: false
              }
            ]
          },
          sizes: {
            create: [
              {
                size: "36",
                stock: 3
              },
              {
                size: "38",
                stock: 5
              },
              {
                size: "40",
                stock: 4
              },
              {
                size: "42",
                stock: 3
              }
            ]
          }
        }
      }),
      prisma.product.create({
        data: {
          name: "Elegant Haik Dress",
          nameAr: "فستان الحايك الأنيق",
          description: "Elegant Haik dress perfect for special occasions",
          descriptionAr: "فستان حايك أنيق مثالي للمناسبات الخاصة",
          price: 18000,
          stock: 8,
          reference: "HAI-002",
          slug: "elegant-haik-dress",
          isOnSale: false,
          isActive: true,
          categoryId: categories[0].id,
          images: {
            create: [
              {
                url: "https://images.pexels.com/photos/3755708/pexels-photo-3755708.jpeg?auto=compress&cs=tinysrgb&w=800",
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              {
                size: "38",
                stock: 3
              },
              {
                size: "40",
                stock: 3
              },
              {
                size: "42",
                stock: 2
              }
            ]
          }
        }
      }),
      // Modern Abayas
      prisma.product.create({
        data: {
          name: "Classic Black Abaya",
          nameAr: "عباية سوداء كلاسيكية",
          description: "Classic black abaya with elegant design",
          descriptionAr: "عباية سوداء كلاسيكية بتصميم أنيق",
          price: 15000,
          stock: 20,
          reference: "ABA-001",
          slug: "classic-black-abaya",
          isOnSale: false,
          isActive: true,
          categoryId: categories[1].id,
          images: {
            create: [
              {
                url: "https://images.pexels.com/photos/3755705/pexels-photo-3755705.jpeg?auto=compress&cs=tinysrgb&w=800",
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              {
                size: "36",
                stock: 4
              },
              {
                size: "38",
                stock: 6
              },
              {
                size: "40",
                stock: 5
              },
              {
                size: "42",
                stock: 3
              },
              {
                size: "44",
                stock: 2
              }
            ]
          }
        }
      }),
      // Embroidered Caftans
      prisma.product.create({
        data: {
          name: "Embroidered Caftan",
          nameAr: "قفطان مطرز",
          description: "Hand-embroidered caftan with traditional patterns",
          descriptionAr: "قفطان مطرز يدوياً مع أنماط تقليدية",
          price: 22000,
          oldPrice: 28000,
          stock: 2,
          reference: "CAF-003",
          slug: "embroidered-caftan",
          isOnSale: true,
          isActive: true,
          categoryId: categories[2].id,
          images: {
            create: [
              {
                url: "https://images.pexels.com/photos/3755709/pexels-photo-3755709.jpeg?auto=compress&cs=tinysrgb&w=800",
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              {
                size: "38",
                stock: 1
              },
              {
                size: "40",
                stock: 1
              }
            ]
          }
        }
      }),
      // Bridal Collection
      prisma.product.create({
        data: {
          name: "Modern Takchita",
          nameAr: "تكشيطة عصرية",
          description: "Modern Takchita perfect for bridal occasions",
          descriptionAr: "تكشيطة عصرية مثالية لمناسبات العروس",
          price: 32000,
          stock: 12,
          reference: "TAK-004",
          slug: "modern-takchita",
          isOnSale: false,
          isActive: true,
          categoryId: categories[3].id,
          images: {
            create: [
              {
                url: "https://images.pexels.com/photos/3755710/pexels-photo-3755710.jpeg?auto=compress&cs=tinysrgb&w=800",
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              {
                size: "36",
                stock: 2
              },
              {
                size: "38",
                stock: 4
              },
              {
                size: "40",
                stock: 3
              },
              {
                size: "42",
                stock: 2
              },
              {
                size: "44",
                stock: 1
              }
            ]
          }
        }
      }),
      // Casual Wear
      prisma.product.create({
        data: {
          name: "Casual Kaftan",
          nameAr: "قفطان عادي",
          description: "Comfortable casual kaftan for daily wear",
          descriptionAr: "قفطان عادي مريح للارتداء اليومي",
          price: 12000,
          stock: 25,
          reference: "CAF-005",
          slug: "casual-kaftan",
          isOnSale: false,
          isActive: true,
          categoryId: categories[4].id,
          images: {
            create: [
              {
                url: "https://images.pexels.com/photos/3755711/pexels-photo-3755711.jpeg?auto=compress&cs=tinysrgb&w=800",
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              {
                size: "36",
                stock: 4
              },
              {
                size: "38",
                stock: 6
              },
              {
                size: "40",
                stock: 5
              },
              {
                size: "42",
                stock: 4
              },
              {
                size: "44",
                stock: 3
              },
              {
                size: "46",
                stock: 2
              },
              {
                size: "48",
                stock: 1
              }
            ]
          }
        }
      }),
      // Additional products
      prisma.product.create({
        data: {
          name: "Luxury Abaya",
          nameAr: "عباية فاخرة",
          description: "Luxury abaya with premium materials",
          descriptionAr: "عباية فاخرة بمواد عالية الجودة",
          price: 45000,
          oldPrice: 55000,
          stock: 5,
          reference: "ABA-006",
          slug: "luxury-abaya",
          isOnSale: true,
          isActive: true,
          categoryId: categories[1].id,
          images: {
            create: [
              {
                url: "https://images.pexels.com/photos/3755712/pexels-photo-3755712.jpeg?auto=compress&cs=tinysrgb&w=800",
                isPrimary: true
              }
            ]
          },
          sizes: {
            create: [
              {
                size: "38",
                stock: 2
              },
              {
                size: "40",
                stock: 2
              },
              {
                size: "42",
                stock: 1
              }
            ]
          }
        }
      })
    ]);

    // Create cities - All 58 Algerian wilayas
    console.log('🏙️ Creating cities...');
    const citiesData = [
      { name: 'Adrar', nameAr: 'أدرار', code: 'ADR', deliveryFee: 800 },
      { name: 'Chlef', nameAr: 'الشلف', code: 'CHL', deliveryFee: 600 },
      { name: 'Laghouat', nameAr: 'الأغواط', code: 'LAG', deliveryFee: 700 },
      { name: 'Oum El Bouaghi', nameAr: 'أم البواقي', code: 'OEB', deliveryFee: 650 },
      { name: 'Batna', nameAr: 'باتنة', code: 'BAT', deliveryFee: 600 },
      { name: 'Béjaïa', nameAr: 'بجاية', code: 'BEJ', deliveryFee: 650 },
      { name: 'Biskra', nameAr: 'بسكرة', code: 'BIS', deliveryFee: 700 },
      { name: 'Béchar', nameAr: 'بشار', code: 'BEC', deliveryFee: 900 },
      { name: 'Blida', nameAr: 'البليدة', code: 'BLI', deliveryFee: 450 },
      { name: 'Bouira', nameAr: 'البويرة', code: 'BOU', deliveryFee: 550 },
      { name: 'Tamanrasset', nameAr: 'تمنراست', code: 'TAM', deliveryFee: 1200 },
      { name: 'Tébessa', nameAr: 'تبسة', code: 'TEB', deliveryFee: 750 },
      { name: 'Tlemcen', nameAr: 'تلمسان', code: 'TLE', deliveryFee: 700 },
      { name: 'Tiaret', nameAr: 'تيارت', code: 'TIA', deliveryFee: 650 },
      { name: 'Tizi Ouzou', nameAr: 'تيزي وزو', code: 'TIZ', deliveryFee: 550 },
      { name: 'Algiers', nameAr: 'الجزائر', code: 'ALG', deliveryFee: 500 },
      { name: 'Djelfa', nameAr: 'الجلفة', code: 'DJF', deliveryFee: 650 },
      { name: 'Jijel', nameAr: 'جيجل', code: 'JIJ', deliveryFee: 600 },
      { name: 'Sétif', nameAr: 'سطيف', code: 'SET', deliveryFee: 600 },
      { name: 'Saïda', nameAr: 'سعيدة', code: 'SAI', deliveryFee: 700 },
      { name: 'Skikda', nameAr: 'سكيكدة', code: 'SKI', deliveryFee: 650 },
      { name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', code: 'SBA', deliveryFee: 700 },
      { name: 'Annaba', nameAr: 'عنابة', code: 'ANN', deliveryFee: 650 },
      { name: 'Guelma', nameAr: 'قالمة', code: 'GUE', deliveryFee: 650 },
      { name: 'Constantine', nameAr: 'قسنطينة', code: 'CON', deliveryFee: 700 },
      { name: 'Médéa', nameAr: 'المدية', code: 'MED', deliveryFee: 550 },
      { name: 'Mostaganem', nameAr: 'مستغانم', code: 'MOS', deliveryFee: 600 },
      { name: "M'Sila", nameAr: 'المسيلة', code: 'MSI', deliveryFee: 650 },
      { name: 'Mascara', nameAr: 'معسكر', code: 'MAS', deliveryFee: 650 },
      { name: 'Ouargla', nameAr: 'ورقلة', code: 'OUA', deliveryFee: 800 },
      { name: 'Oran', nameAr: 'وهران', code: 'ORA', deliveryFee: 600 },
      { name: 'El Bayadh', nameAr: 'البيض', code: 'EBA', deliveryFee: 750 },
      { name: 'Illizi', nameAr: 'إليزي', code: 'ILL', deliveryFee: 1000 },
      { name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج', code: 'BBA', deliveryFee: 600 },
      { name: 'Boumerdès', nameAr: 'بومرداس', code: 'BMD', deliveryFee: 500 },
      { name: 'El Tarf', nameAr: 'الطارف', code: 'ETA', deliveryFee: 650 },
      { name: 'Tindouf', nameAr: 'تندوف', code: 'TIN', deliveryFee: 1100 },
      { name: 'Tissemsilt', nameAr: 'تيسمسيلت', code: 'TIS', deliveryFee: 600 },
      { name: 'El Oued', nameAr: 'الوادي', code: 'EOU', deliveryFee: 750 },
      { name: 'Khenchela', nameAr: 'خنشلة', code: 'KHE', deliveryFee: 650 },
      { name: 'Souk Ahras', nameAr: 'سوق أهراس', code: 'SOU', deliveryFee: 700 },
      { name: 'Tipaza', nameAr: 'تيبازة', code: 'TIP', deliveryFee: 500 },
      { name: 'Mila', nameAr: 'ميلة', code: 'MIL', deliveryFee: 600 },
      { name: 'Aïn Defla', nameAr: 'عين الدفلى', code: 'AID', deliveryFee: 550 },
      { name: 'Naâma', nameAr: 'النعامة', code: 'NAA', deliveryFee: 800 },
      { name: 'Aïn Témouchent', nameAr: 'عين تموشنت', code: 'AIT', deliveryFee: 700 },
      { name: 'Ghardaïa', nameAr: 'غرداية', code: 'GHA', deliveryFee: 800 },
      { name: 'Relizane', nameAr: 'غليزان', code: 'REL', deliveryFee: 650 },
      { name: 'Timimoun', nameAr: 'تيميمون', code: 'TIM', deliveryFee: 900 },
      { name: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار', code: 'BBM', deliveryFee: 1000 },
      { name: 'Ouled Djellal', nameAr: 'أولاد جلال', code: 'OUL', deliveryFee: 750 },
      { name: 'Béni Abbès', nameAr: 'بني عباس', code: 'BEA', deliveryFee: 900 },
      { name: 'In Salah', nameAr: 'عين صالح', code: 'INS', deliveryFee: 1000 },
      { name: 'In Guezzam', nameAr: 'عين قزام', code: 'ING', deliveryFee: 1100 },
      { name: 'Touggourt', nameAr: 'تقرت', code: 'TOU', deliveryFee: 800 },
      { name: 'Djanet', nameAr: 'جانت', code: 'DJA', deliveryFee: 1200 },
      { name: 'El M\'Ghair', nameAr: 'المغير', code: 'EMG', deliveryFee: 750 }
    ];

    const cities = await Promise.all(
      citiesData.map(cityData => 
        prisma.city.create({
          data: cityData
        })
      )
    );

    // Create delivery desks
    console.log('📦 Creating delivery desks...');
    
    // Find specific cities for delivery desks
    const algiersCity = cities.find(c => c.name === 'Algiers');
    const oranCity = cities.find(c => c.name === 'Oran');
    const constantineCity = cities.find(c => c.name === 'Constantine');
    const batnaCity = cities.find(c => c.name === 'Batna');
    const annabaCity = cities.find(c => c.name === 'Annaba');
    
    const deliveryDesks = await Promise.all([
      prisma.deliveryDesk.create({
        data: {
          name: 'Algiers Central Desk',
          nameAr: 'مكتب الجزائر المركزي',
          address: 'Downtown Algiers, Rue de la Liberté',
          cityId: algiersCity.id
        }
      }),
      prisma.deliveryDesk.create({
        data: {
          name: 'Oran Main Office',
          nameAr: 'المكتب الرئيسي لوهران',
          address: 'City Center Oran, Place du 1er Novembre',
          cityId: oranCity.id
        }
      }),
      prisma.deliveryDesk.create({
        data: {
          name: 'Constantine Hub',
          nameAr: 'مركز قسنطينة',
          address: 'Central Constantine, Avenue de l\'Indépendance',
          cityId: constantineCity.id
        }
      }),
      prisma.deliveryDesk.create({
        data: {
          name: 'Batna Central',
          nameAr: 'مركز باتنة',
          address: 'Central Batna, Place de la Révolution',
          cityId: batnaCity.id
        }
      }),
      prisma.deliveryDesk.create({
        data: {
          name: 'Annaba Express',
          nameAr: 'عنابة إكسبريس',
          address: 'Downtown Annaba, Boulevard de l\'Indépendance',
          cityId: annabaCity.id
        }
      })
    ]);

    // Create sample orders with different statuses
    console.log('📋 Creating sample orders...');
    const orders = await Promise.all([
      prisma.order.create({
        data: {
          orderNumber: 'ORD-000001',
          customerName: 'Ahmed Benali',
          customerPhone: '+213 555 123 456',
          customerEmail: 'ahmed@example.com',
          deliveryType: 'HOME_DELIVERY',
          deliveryAddress: '123 Rue de la Liberté, Algiers',
          deliveryFee: 500,
          subtotal: 25000,
          total: 25500,
          notes: 'Please deliver in the morning',
          callCenterStatus: 'CONFIRMED',
          deliveryStatus: 'READY',
          cityId: algiersCity.id,
          items: {
            create: [
              {
                productId: products[0].id,
                quantity: 1,
                price: 25000,
                size: 'M'
              }
            ]
          }
        }
      }),

      prisma.order.create({
        data: {
          orderNumber: 'ORD-000002',
          customerName: 'Fatima Khelifi',
          customerPhone: '+213 555 234 567',
          customerEmail: 'fatima@example.com',
          deliveryType: 'PICKUP',
          deliveryFee: 0,
          subtotal: 18000,
          total: 18000,
          notes: 'Will pick up on Friday',
          callCenterStatus: 'NEW',
          deliveryStatus: 'NOT_READY',
          cityId: oranCity.id,
          deliveryDeskId: deliveryDesks[1].id,
          items: {
            create: [
              {
                productId: products[1].id,
                quantity: 1,
                price: 18000,
                size: 'L'
              }
            ]
          }
        }
      }),

      prisma.order.create({
        data: {
          orderNumber: 'ORD-000003',
          customerName: 'Mohamed Slimani',
          customerPhone: '+213 555 345 678',
          customerEmail: 'mohamed@example.com',
          deliveryType: 'HOME_DELIVERY',
          deliveryAddress: '456 Avenue de l\'Indépendance, Constantine',
          deliveryFee: 700,
          subtotal: 22000,
          total: 22700,
          notes: 'Ring the bell twice',
          callCenterStatus: 'CONFIRMED',
          deliveryStatus: 'IN_TRANSIT',
          cityId: constantineCity.id,
          items: {
            create: [
              {
                productId: products[2].id,
                quantity: 1,
                price: 22000,
                size: 'S'
              }
            ]
          }
        }
      }),

      prisma.order.create({
        data: {
          orderNumber: 'ORD-000004',
          customerName: 'Amina Boudiaf',
          customerPhone: '+213 555 456 789',
          customerEmail: 'amina@example.com',
          deliveryType: 'HOME_DELIVERY',
          deliveryAddress: '789 Boulevard Mohamed V, Annaba',
          deliveryFee: 650,
          subtotal: 32000,
          total: 32650,
          notes: 'Call before delivery',
          callCenterStatus: 'CONFIRMED',
          deliveryStatus: 'DONE',
          cityId: annabaCity.id,
          items: {
            create: [
              {
                productId: products[3].id,
                quantity: 1,
                price: 32000,
                size: 'M'
              }
            ]
          }
        }
      }),

      prisma.order.create({
        data: {
          orderNumber: 'ORD-000005',
          customerName: 'Khadija Mansouri',
          customerPhone: '+213 555 567 890',
          customerEmail: 'khadija@example.com',
          deliveryType: 'HOME_DELIVERY',
          deliveryAddress: '321 Rue des Martyrs, Blida',
          deliveryFee: 450,
          subtotal: 45000,
          total: 45450,
          notes: 'Customer prefers afternoon delivery',
          callCenterStatus: 'NO_RESPONSE',
          deliveryStatus: 'NOT_READY',
          cityId: batnaCity.id,
          items: {
            create: [
              {
                productId: products[5].id,
                quantity: 1,
                price: 45000,
                size: 'L'
              }
            ]
          }
        }
      }),

      prisma.order.create({
        data: {
          orderNumber: 'ORD-000006',
          customerName: 'Youssef Hamidi',
          customerPhone: '+213 555 678 901',
          customerEmail: 'youssef@example.com',
          deliveryType: 'PICKUP',
          deliveryFee: 0,
          subtotal: 12000,
          total: 12000,
          notes: 'Customer will call to confirm pickup time',
          callCenterStatus: 'NEW',
          deliveryStatus: 'NOT_READY',
          cityId: algiersCity.id,
          deliveryDeskId: deliveryDesks[0].id,
          items: {
            create: [
              {
                productId: products[4].id,
                quantity: 1,
                price: 12000,
                size: 'M'
              }
            ]
          }
        }
      })
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${await prisma.user.count()}`);
    console.log(`- Categories: ${await prisma.category.count()}`);
    console.log(`- Products: ${await prisma.product.count()}`);
    console.log(`- Cities: ${await prisma.city.count()}`);
    console.log(`- Delivery Desks: ${await prisma.deliveryDesk.count()}`);
    console.log(`- Orders: ${await prisma.order.count()}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('\n👑 Admin:');
    console.log('admin@example.com / admin123');
    
    console.log('\n📞 Call Center Staff:');
    console.log('callcenter1@example.com / admin123');
    console.log('callcenter2@example.com / admin123');
    console.log('callcenter3@example.com / admin123');
    
    console.log('\n✅ Order Confirmation Staff:');
    console.log('confirmation1@example.com / admin123');
    console.log('confirmation2@example.com / admin123');
    
    console.log('\n🚚 Delivery Coordinator:');
    console.log('delivery@example.com / admin123');
    
    console.log('\n👤 Regular User:');
    console.log('user@example.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase(); 