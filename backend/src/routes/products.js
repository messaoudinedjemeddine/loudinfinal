const express = require('express');
const { z } = require('zod');
const prisma = require('../config/database');
const router = express.Router();

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('12'),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sortBy: z.enum(['price', 'rating', 'createdAt', 'name']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  inStock: z.string().optional(),
  onSale: z.string().optional()
});

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const query = querySchema.parse(req.query);
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      isActive: true
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.category) {
      where.category = {
        slug: query.category
      };
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
      if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
    }

    if (query.inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (query.onSale === 'true') {
      where.isOnSale = true;
    }

    // Build orderBy clause
    const orderBy = {};
    orderBy[query.sortBy] = query.sortOrder;

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1
          },
          sizes: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products: products.map(product => ({
        ...product,
        image: product.images[0]?.url || '/placeholder-product.jpg'
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
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

    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isOnSale: true
      },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1
        }
      },
      take: 8,
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      products: products.map(product => ({
        ...product,
        image: product.images[0]?.url || '/placeholder-product.jpg'
      }))
    });
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// Get single product by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        sizes: true
      }
    });
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Transform the product to match frontend expectations
    const transformedProduct = {
      ...product,
      images: product.images.map(img => img.url) // Convert image objects to URL strings
    };
    
    res.json({ product: transformedProduct });
  } catch (error) {
    console.error('Product fetch by slug error:', error);
    res.status(500).json({ error: 'Failed to fetch product by slug' });
  }
});

module.exports = router;