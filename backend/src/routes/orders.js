const express = require('express');
const { z } = require('zod');
const prisma = require('../config/database');
const router = express.Router();

const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  customerEmail: z.string().email().optional(),
  deliveryType: z.enum(['HOME_DELIVERY', 'PICKUP']),
  deliveryAddress: z.string().optional(),
  cityId: z.string().min(1, 'City is required'),
  deliveryDeskId: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    sizeId: z.string().optional()
  })).min(1, 'At least one item is required')
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const orderData = createOrderSchema.parse(req.body);

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of orderData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { sizes: true }
      });

      if (!product || !product.isActive) {
        return res.status(400).json({ 
          error: `Product not found: ${item.productId}` 
        });
      }

      // Check stock
      let availableStock = product.stock;
      if (item.sizeId) {
        const size = product.sizes.find(s => s.id === item.sizeId);
        if (!size) {
          return res.status(400).json({ 
            error: `Size not found for product: ${product.name}` 
          });
        }
        availableStock = size.stock;
      }

      if (availableStock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product: ${product.name}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        sizeId: item.sizeId,
        size: item.sizeId ? product.sizes.find(s => s.id === item.sizeId)?.size : null
      });
    }

    // Calculate delivery fee (simplified logic)
    const deliveryFee = orderData.deliveryType === 'HOME_DELIVERY' ? 500 : 0;
    const total = subtotal + deliveryFee;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerEmail: orderData.customerEmail,
          deliveryType: orderData.deliveryType,
          deliveryAddress: orderData.deliveryAddress,
          deliveryFee,
          subtotal,
          total,
          notes: orderData.notes,
          cityId: orderData.cityId,
          deliveryDeskId: orderData.deliveryDeskId,
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          city: true,
          deliveryDesk: true
        }
      });

      // Update stock
      for (const item of orderData.items) {
        if (item.sizeId) {
          await tx.productSize.update({
            where: { id: item.sizeId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }
      }

      return newOrder;
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
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

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;