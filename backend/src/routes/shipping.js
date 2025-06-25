const express = require('express');
const router = express.Router();
const yalidineService = require('../services/yalidine');
const { z } = require('zod');

// Validation schemas
const calculateFeesSchema = z.object({
  fromWilayaId: z.number().int().positive(),
  toWilayaId: z.number().int().positive(),
  weight: z.number().positive().optional(),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  declaredValue: z.number().positive().optional()
});

const createShipmentSchema = z.object({
  orderId: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerAddress: z.string().min(1),
  fromWilayaName: z.string().min(1),
  toWilayaName: z.string().min(1),
  toCommuneName: z.string().min(1),
  productList: z.string().min(1),
  price: z.number().positive(),
  weight: z.number().positive(),
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  isStopDesk: z.boolean().optional(),
  stopDeskId: z.number().int().positive().optional(),
  doInsurance: z.boolean().optional(),
  declaredValue: z.number().positive().optional(),
  freeshipping: z.boolean().optional(),
  hasExchange: z.boolean().optional(),
  productToCollect: z.string().optional()
});

// Check if Yalidine is configured
router.get('/status', (req, res) => {
  res.json({
    configured: yalidineService.isConfigured(),
    message: yalidineService.isConfigured() 
      ? 'Yalidine shipping is available' 
      : 'Yalidine API not configured'
  });
});

// Get all wilayas (provinces)
router.get('/wilayas', async (req, res) => {
  try {
    if (!yalidineService.isConfigured()) {
      return res.status(503).json({ error: 'Yalidine shipping not configured' });
    }

    const wilayas = await yalidineService.getWilayas();
    res.json(wilayas);
  } catch (error) {
    console.error('Error fetching wilayas:', error);
    res.status(500).json({ error: 'Failed to fetch wilayas' });
  }
});

// Get communes by wilaya
router.get('/communes', async (req, res) => {
  try {
    if (!yalidineService.isConfigured()) {
      return res.status(503).json({ error: 'Yalidine shipping not configured' });
    }

    const { wilayaId } = req.query;
    const communes = await yalidineService.getCommunes(wilayaId ? parseInt(wilayaId) : null);
    res.json(communes);
  } catch (error) {
    console.error('Error fetching communes:', error);
    res.status(500).json({ error: 'Failed to fetch communes' });
  }
});

// Get pickup centers
router.get('/centers', async (req, res) => {
  try {
    if (!yalidineService.isConfigured()) {
      return res.status(503).json({ error: 'Yalidine shipping not configured' });
    }

    const { wilayaId } = req.query;
    const centers = await yalidineService.getCenters(wilayaId ? parseInt(wilayaId) : null);
    res.json(centers);
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ error: 'Failed to fetch pickup centers' });
  }
});

// Calculate shipping fees
router.post('/calculate-fees', async (req, res) => {
  try {
    if (!yalidineService.isConfigured()) {
      return res.status(503).json({ error: 'Yalidine shipping not configured' });
    }

    const validatedData = calculateFeesSchema.parse(req.body);
    const { fromWilayaId, toWilayaId, weight, length, width, height, declaredValue } = validatedData;

    // Get base fees from Yalidine
    const feesData = await yalidineService.calculateFees(fromWilayaId, toWilayaId);
    
    // Calculate weight fees if dimensions provided
    let weightFees = 0;
    let billableWeight = weight || 1;
    
    if (weight && length && width && height) {
      billableWeight = yalidineService.getBillableWeight(weight, length, width, height);
      weightFees = yalidineService.calculateWeightFees(billableWeight, feesData.oversize_fee);
    }

    // Calculate COD fees
    const codFees = declaredValue ? (declaredValue * feesData.cod_percentage / 100) : 0;

    // Get delivery options for the first commune (you might want to get specific commune)
    const firstCommune = Object.values(feesData.per_commune)[0];
    
    const deliveryOptions = {
      express: {
        home: firstCommune.express_home + weightFees,
        desk: firstCommune.express_desk + weightFees
      },
      economic: {
        home: firstCommune.economic_home ? firstCommune.economic_home + weightFees : null,
        desk: firstCommune.economic_desk ? firstCommune.economic_desk + weightFees : null
      }
    };

    res.json({
      fromWilaya: feesData.from_wilaya_name,
      toWilaya: feesData.to_wilaya_name,
      zone: feesData.zone,
      weightFees,
      codFees,
      deliveryOptions,
      billableWeight,
      oversizeFee: feesData.oversize_fee,
      codPercentage: feesData.cod_percentage,
      insurancePercentage: feesData.insurance_percentage,
      returnFee: feesData.retour_fee
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    console.error('Error calculating fees:', error);
    res.status(500).json({ error: 'Failed to calculate shipping fees' });
  }
});

// Create shipment
router.post('/create-shipment', async (req, res) => {
  try {
    if (!yalidineService.isConfigured()) {
      return res.status(503).json({ error: 'Yalidine shipping not configured' });
    }

    const validatedData = createShipmentSchema.parse(req.body);
    
    // Validate phone number
    if (!yalidineService.validatePhoneNumber(validatedData.customerPhone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Format data for Yalidine API
    const parcelData = yalidineService.formatParcelData(validatedData);
    
    // Create shipment
    const result = await yalidineService.createParcel(parcelData);
    
    // Get the result for the specific order
    const orderResult = result[validatedData.orderId];
    
    if (!orderResult || !orderResult.success) {
      return res.status(400).json({ 
        error: 'Failed to create shipment', 
        message: orderResult?.message || 'Unknown error' 
      });
    }

    res.json({
      success: true,
      tracking: orderResult.tracking,
      orderId: orderResult.order_id,
      label: orderResult.label,
      importId: orderResult.import_id
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    console.error('Error creating shipment:', error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// Get shipment details
router.get('/shipment/:tracking', async (req, res) => {
  try {
    if (!yalidineService.isConfigured()) {
      return res.status(503).json({ error: 'Yalidine shipping not configured' });
    }

    const { tracking } = req.params;
    const shipment = await yalidineService.getParcel(tracking);
    res.json(shipment);
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({ error: 'Failed to fetch shipment details' });
  }
});

// Get shipment tracking history
router.get('/tracking/:tracking', async (req, res) => {
  try {
    if (!yalidineService.isConfigured()) {
      return res.status(503).json({ error: 'Yalidine shipping not configured' });
    }

    const { tracking } = req.params;
    const history = await yalidineService.getParcelHistory(tracking);
    res.json(history);
  } catch (error) {
    console.error('Error fetching tracking:', error);
    res.status(500).json({ error: 'Failed to fetch tracking information' });
  }
});

// Update shipment
router.patch('/shipment/:tracking', async (req, res) => {
  try {
    if (!yalidineService.isConfigured()) {
      return res.status(503).json({ error: 'Yalidine shipping not configured' });
    }

    const { tracking } = req.params;
    const updateData = req.body;
    
    const result = await yalidineService.updateParcel(tracking, updateData);
    res.json(result);
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({ error: 'Failed to update shipment' });
  }
});

// Delete shipment
router.delete('/shipment/:tracking', async (req, res) => {
  try {
    if (!yalidineService.isConfigured()) {
      return res.status(503).json({ error: 'Yalidine shipping not configured' });
    }

    const { tracking } = req.params;
    const result = await yalidineService.deleteParcel(tracking);
    res.json(result);
  } catch (error) {
    console.error('Error deleting shipment:', error);
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
});

module.exports = router; 