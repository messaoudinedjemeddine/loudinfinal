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
  wilayaId: z.number().min(1, 'Wilaya is required'), // Changed from cityId to wilayaId
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

    // Map wilaya ID to city ID - Complete mapping for all 58 Algerian wilayas
    const wilayaToCityMap = {
      1: 'Adrar',
      2: 'Chlef',
      3: 'Laghouat',
      4: 'Oum El Bouaghi',
      5: 'Batna',
      6: 'Béjaïa',
      7: 'Biskra',
      8: 'Béchar',
      9: 'Blida',
      10: 'Bouira',
      11: 'Tamanrasset',
      12: 'Tébessa',
      13: 'Tlemcen',
      14: 'Tiaret',
      15: 'Tizi Ouzou',
      16: 'Algiers',
      17: 'Djelfa',
      18: 'Jijel',
      19: 'Sétif',
      20: 'Saïda',
      21: 'Skikda',
      22: 'Sidi Bel Abbès',
      23: 'Annaba',
      24: 'Guelma',
      25: 'Constantine',
      26: 'Médéa',
      27: 'Mostaganem',
      28: "M'Sila",
      29: 'Mascara',
      30: 'Ouargla',
      31: 'Oran',
      32: 'El Bayadh',
      33: 'Illizi',
      34: 'Bordj Bou Arréridj',
      35: 'Boumerdès',
      36: 'El Tarf',
      37: 'Tindouf',
      38: 'Tissemsilt',
      39: 'El Oued',
      40: 'Khenchela',
      41: 'Souk Ahras',
      42: 'Tipaza',
      43: 'Mila',
      44: 'Aïn Defla',
      45: 'Naâma',
      46: 'Aïn Témouchent',
      47: 'Ghardaïa',
      48: 'Relizane',
      49: 'Timimoun',
      50: 'Bordj Badji Mokhtar',
      51: 'Ouled Djellal',
      52: 'Béni Abbès',
      53: 'In Salah',
      54: 'In Guezzam',
      55: 'Touggourt',
      56: 'Djanet',
      57: "M'Sila",
      58: 'El M\'Ghair'
    };

    const cityName = wilayaToCityMap[orderData.wilayaId];
    if (!cityName) {
      return res.status(400).json({ 
        error: `Unsupported wilaya ID: ${orderData.wilayaId}` 
      });
    }

    // Find the city by name
    const city = await prisma.city.findFirst({
      where: { name: cityName }
    });

    if (!city) {
      return res.status(400).json({ 
        error: `City not found for wilaya: ${cityName}` 
      });
    }

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
          cityId: city.id,
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