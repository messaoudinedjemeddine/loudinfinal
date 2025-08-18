const express = require('express');
const { authenticateToken, requireAdmin, requireSuperAdmin } = require('../middleware/auth');
const prisma = require('../config/database');
const { z } = require('zod');

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers, recentOrders, totalRevenue, orderStatusBreakdown] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }),
      // Calculate total revenue
      prisma.order.aggregate({
        _sum: {
          total: true
        }
      }),
      // Get order status breakdown
      prisma.order.groupBy({
        by: ['callCenterStatus'],
        _count: {
          callCenterStatus: true
        }
      })
    ]);

    // Format order status breakdown
    const statusBreakdown = orderStatusBreakdown.reduce((acc, item) => {
      acc[item.callCenterStatus] = item._count.callCenterStatus;
      return acc;
    }, {});

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: totalRevenue._sum.total || 0,
      orderStatusBreakdown: statusBreakdown,
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Recent orders
router.get('/dashboard/recent-orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Recent orders error:', error);
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});

// Low stock products
router.get('/dashboard/low-stock', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: { lte: 5 },
        isActive: true
      },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1
        }
      },
      take: 10
    });

    // Format products to include image field
    const formattedProducts = products.map(product => ({
      ...product,
      image: product.images[0]?.url || '/placeholder-product.jpg'
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Low stock products error:', error);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
});

// Admin products management
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products: products.map(product => ({
        ...product,
        image: product.images[0]?.url || '/placeholder-product.jpg'
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    
    // First create the product
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        nameAr: productData.nameAr,
        description: productData.description,
        descriptionAr: productData.descriptionAr,
        price: parseFloat(productData.price),
        oldPrice: productData.oldPrice ? parseFloat(productData.oldPrice) : null,
        stock: parseInt(productData.stock),
        reference: productData.reference,
        isOnSale: productData.isOnSale || false,
        isActive: productData.isActive !== false,
        isLaunch: productData.isLaunch || false,
        launchAt: productData.launchAt ? new Date(productData.launchAt) : null,
        categoryId: productData.categoryId,
        slug: productData.slug
      }
    });

    // Then create the images if provided
    if (productData.images && productData.images.length > 0) {
      await prisma.productImage.createMany({
        data: productData.images.map((img, index) => ({
          url: img.url,
          alt: img.alt || `${productData.name} image ${index + 1}`,
          isPrimary: index === 0,
          productId: product.id
        }))
      });
    }

    // Return the product with images
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: true
      }
    });

    res.status(201).json(productWithImages);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        sizes: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get admin product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Build update data object with only provided fields
    const updateData = {};
    
    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.nameAr !== undefined) updateData.nameAr = productData.nameAr;
    if (productData.description !== undefined) updateData.description = productData.description;
    if (productData.descriptionAr !== undefined) updateData.descriptionAr = productData.descriptionAr;
    if (productData.price !== undefined) updateData.price = parseFloat(productData.price);
    if (productData.oldPrice !== undefined) updateData.oldPrice = productData.oldPrice ? parseFloat(productData.oldPrice) : null;
    if (productData.stock !== undefined) updateData.stock = parseInt(productData.stock);
    if (productData.reference !== undefined) updateData.reference = productData.reference;
    if (productData.isOnSale !== undefined) updateData.isOnSale = productData.isOnSale;
    if (productData.isActive !== undefined) updateData.isActive = productData.isActive;
    if (productData.isLaunch !== undefined) updateData.isLaunch = productData.isLaunch;
    if (productData.launchAt !== undefined) updateData.launchAt = productData.launchAt ? new Date(productData.launchAt) : null;
    if (productData.categoryId !== undefined) updateData.categoryId = productData.categoryId;
    if (productData.slug !== undefined) updateData.slug = productData.slug;

    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });

    // Update images if provided
    if (productData.images) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: id }
      });

      // Create new images
      if (productData.images.length > 0) {
        await prisma.productImage.createMany({
          data: productData.images.map((img, index) => ({
            url: img.url,
            alt: img.alt || `${productData.name || existingProduct.name} image ${index + 1}`,
            isPrimary: index === 0,
            productId: id
          }))
        });
      }
    }

    // Return the updated product with images
    const productWithImages = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true
      }
    });

    res.json(productWithImages);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Admin orders management
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, confirmedOnly } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (status) {
      where.callCenterStatus = status;
    }

    // If confirmedOnly is true, only return confirmed orders
    if (confirmedOnly === 'true') {
      where.callCenterStatus = 'CONFIRMED';
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1
                  }
                }
              }
            }
          },
          city: true,
          deliveryDesk: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
    ]);

    // Format orders to include proper structure
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          image: item.product.images[0]?.url || '/placeholder-product.jpg'
        }
      }))
    }));

    res.json({
      orders: formattedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Export orders to CSV
router.get('/orders/export', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        city: true,
        deliveryDesk: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Create CSV headers
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Phone',
      'Customer Email',
      'Order Date',
      'Delivery Type',
      'City',
      'Delivery Address/Desk',
      'Call Center Status',
      'Delivery Status',
      'Subtotal (DA)',
      'Delivery Fee (DA)',
      'Total (DA)',
      'Items',
      'Notes'
    ];

    // Create CSV rows
    const rows = orders.map(order => {
      const items = order.items.map(item => 
        `${item.quantity}x ${item.product.name}${item.size ? ` (Size: ${item.size})` : ''}`
      ).join('; ');

      const deliveryInfo = order.deliveryType === 'HOME_DELIVERY' 
        ? (order.deliveryAddress || 'Home Delivery')
        : (order.deliveryDesk?.name || 'Pickup');

      return [
        order.orderNumber,
        order.customerName,
        order.customerPhone,
        order.customerEmail || '',
        new Date(order.createdAt).toLocaleDateString(),
        order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pickup',
        order.city.name,
        deliveryInfo,
        order.callCenterStatus,
        order.deliveryStatus,
        order.subtotal.toLocaleString(),
        order.deliveryFee.toLocaleString(),
        order.total.toLocaleString(),
        items,
        order.notes || ''
      ];
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="orders-${new Date().toISOString().split('T')[0]}.csv"`);
    res.setHeader('Cache-Control', 'no-cache');
    
    res.send(csvContent);
  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({ error: 'Failed to export orders' });
  }
});

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { callCenterStatus, deliveryStatus } = req.body;

    const updateData = {};
    if (callCenterStatus) updateData.callCenterStatus = callCenterStatus;
    if (deliveryStatus) updateData.deliveryStatus = deliveryStatus;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1
                }
              }
            }
          }
        },
        city: true,
        deliveryDesk: true
      }
    });

    // Format order to include proper structure
    const formattedOrder = {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          image: item.product.images[0]?.url || '/placeholder-product.jpg'
        }
      }))
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true
            }
          },
          orders: {
            select: {
              total: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    // Calculate total spent for each user
    const usersWithStats = users.map(user => {
      const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        orderCount: user._count.orders,
        totalSpent: totalSpent
      };
    });

    res.json({
      users: usersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: role || 'USER'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      ...user,
      orderCount: 0,
      totalSpent: 0
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (including role)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, role, password } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is taken by another user
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email }
      });
      if (emailTaken) {
        return res.status(400).json({ error: 'Email already taken by another user' });
      }
    }

    // Prepare update data
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (role) updateData.role = role;
    
    // Hash new password if provided
    if (password) {
      const bcrypt = require('bcrypt');
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        },
        orders: {
          select: {
            total: true
          }
        }
      }
    });

    // Calculate total spent
    const totalSpent = updatedUser.orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      orderCount: updatedUser._count.orders,
      totalSpent: totalSpent
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true
          }
        }
      }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has orders
    if (existingUser._count.orders > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete user with existing orders. Consider deactivating instead.' 
      });
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(categories.map(category => ({
      ...category,
      productCount: category._count.products
    })));
  } catch (error) {
    console.error('Admin categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single category
router.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Admin: Fetching category with ID:', id);
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    console.log('Admin: Category found:', category ? category.name : 'null');

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const result = {
      ...category,
      productCount: category._count.products
    };
    
    console.log('Admin: Returning category data:', result.name);
    res.json(result);
  } catch (error) {
    console.error('Admin get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create category
router.post('/categories', async (req, res) => {
  try {
    const categoryData = req.body;
    
    // Create category with provided data
    
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        nameAr: categoryData.nameAr,
        description: categoryData.description,
        descriptionAr: categoryData.descriptionAr,
        image: categoryData.image,
        slug: categoryData.slug
      }
    });

    // Category created successfully
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    
    // Update category data

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: categoryData.name,
        nameAr: categoryData.nameAr,
        description: categoryData.description,
        descriptionAr: categoryData.descriptionAr,
        image: categoryData.image,
        slug: categoryData.slug
      }
    });

    // Category updated successfully
    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (categoryWithProducts._count.products > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing products' 
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Inventory management
router.get('/inventory', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, category, stockFilter, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (stockFilter === 'low') {
      where.stock = { lte: 5, gt: 0 };
    } else if (stockFilter === 'out') {
      where.stock = 0;
    } else if (stockFilter === 'in') {
      where.stock = { gt: 5 };
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1
          },
          sizes: {
            orderBy: { size: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products: products.map(product => ({
        ...product,
        image: product.images[0]?.url || '/placeholder-product.jpg',
        totalStock: product.stock + product.sizes.reduce((sum, size) => sum + size.stock, 0)
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Inventory error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Export inventory to Excel/CSV
router.get('/inventory/export', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        sizes: {
          orderBy: { size: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Create CSV content
    const headers = [
      'Reference',
      'Name',
      'Name (Arabic)',
      'Category',
      'Price (DA)',
      'Old Price (DA)',
      'Main Stock',
      'Sizes & Quantities',
      'Total Stock',
      'Status',
      'On Sale',
      'Created Date',
      'Description',
      'Description (Arabic)'
    ];

    const csvContent = [
      headers.join(','),
      ...products.map(product => {
        const sizesInfo = product.sizes.map(size => `${size.size}:${size.stock}`).join(';');
        const totalStock = product.stock + product.sizes.reduce((sum, size) => sum + size.stock, 0);
        
        return [
          product.reference || '',
          `"${product.name}"`,
          `"${product.nameAr || ''}"`,
          product.category?.name || '',
          product.price,
          product.oldPrice || '',
          product.stock,
          `"${sizesInfo}"`,
          totalStock,
          product.isActive ? 'Active' : 'Inactive',
          product.isOnSale ? 'Yes' : 'No',
          new Date(product.createdAt).toLocaleDateString(),
          `"${product.description || ''}"`,
          `"${product.descriptionAr || ''}"`
        ].join(',');
      })
    ].join('\n');

    // Set proper headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="inventory-${new Date().toISOString().split('T')[0]}.csv"`);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Send the CSV content
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export inventory error:', error);
    res.status(500).json({ error: 'Failed to export inventory' });
  }
});

// Import inventory from Excel/CSV
router.post('/inventory/import', async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (const productData of products) {
      try {
        // Check if product exists by reference
        const existingProduct = await prisma.product.findUnique({
          where: { reference: productData.reference },
          include: { sizes: true }
        });

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              name: productData.name,
              nameAr: productData.nameAr,
              description: productData.description,
              descriptionAr: productData.descriptionAr,
              price: parseFloat(productData.price) || 0,
              oldPrice: productData.oldPrice ? parseFloat(productData.oldPrice) : null,
              stock: parseInt(productData.mainStock) || 0,
              isOnSale: productData.isOnSale === 'Yes',
              isActive: productData.status === 'Active'
            }
          });

          // Update sizes if provided
          if (productData.sizes) {
            const sizesData = productData.sizes.split(';').map(sizeInfo => {
              const [size, stock] = sizeInfo.split(':');
              return { size: size.trim(), stock: parseInt(stock) || 0 };
            });

            // Delete existing sizes
            await prisma.productSize.deleteMany({
              where: { productId: existingProduct.id }
            });

            // Create new sizes
            for (const sizeData of sizesData) {
              await prisma.productSize.create({
                data: {
                  size: sizeData.size,
                  stock: sizeData.stock,
                  productId: existingProduct.id
                }
              });
            }
          }

          results.updated++;
        } else {
          // Create new product
          const newProduct = await prisma.product.create({
            data: {
              name: productData.name,
              nameAr: productData.nameAr,
              description: productData.description,
              descriptionAr: productData.descriptionAr,
              price: parseFloat(productData.price) || 0,
              oldPrice: productData.oldPrice ? parseFloat(productData.oldPrice) : null,
              stock: parseInt(productData.mainStock) || 0,
              reference: productData.reference,
              isOnSale: productData.isOnSale === 'Yes',
              isActive: productData.status === 'Active',
              slug: productData.reference.toLowerCase().replace(/\s+/g, '-')
            }
          });

          // Create sizes if provided
          if (productData.sizes) {
            const sizesData = productData.sizes.split(';').map(sizeInfo => {
              const [size, stock] = sizeInfo.split(':');
              return { size: size.trim(), stock: parseInt(stock) || 0 };
            });

            for (const sizeData of sizesData) {
              await prisma.productSize.create({
                data: {
                  size: sizeData.size,
                  stock: sizeData.stock,
                  productId: newProduct.id
                }
              });
            }
          }

          results.created++;
        }
      } catch (error) {
        results.errors.push({
          reference: productData.reference,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Import completed',
      results
    });
  } catch (error) {
    console.error('Import inventory error:', error);
    res.status(500).json({ error: 'Failed to import inventory' });
  }
});

module.exports = router;