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

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    // Update the product
    const product = await prisma.product.update({
      where: { id },
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
        categoryId: productData.categoryId,
        slug: productData.slug
      }
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
            alt: img.alt || `${productData.name} image ${index + 1}`,
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
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (status) {
      where.callCenterStatus = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
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
            product: true
          }
        }
      }
    });

    res.json(order);
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

module.exports = router;