const express = require('express');
const prisma = require('../config/database');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      categories: categories.map(category => ({
        ...category,
        productCount: category._count.products
      }))
    });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: {
            isActive: true
          },
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          },
          take: 20
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      ...category,
      products: category.products.map(product => ({
        ...product,
        image: product.images[0]?.url || '/placeholder-product.jpg'
      }))
    });
  } catch (error) {
    console.error('Category fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

module.exports = router;