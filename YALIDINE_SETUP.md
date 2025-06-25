# 🚚 Yalidine Shipping Integration Setup Guide

This guide will help you set up and configure the Yalidine shipping integration for your e-commerce platform.

## 📋 Prerequisites

1. **Yalidine Account**: You need a Yalidine business account
2. **API Credentials**: Your Yalidine API ID and API Token
3. **Node.js Backend**: The backend server must be running
4. **Database**: PostgreSQL database with Prisma configured

## 🔧 Backend Setup

### 1. Install Dependencies

Make sure you have the required dependencies in your backend:

```bash
cd backend
npm install axios zod
```

### 2. Environment Configuration

Add the following environment variables to your `.env` file:

```env
# Yalidine Shipping API Configuration
YALIDINE_API_ID=your-yalidine-api-id
YALIDINE_API_TOKEN=your-yalidine-api-token
```

### 3. Get Your Yalidine API Credentials

1. Log in to your Yalidine account
2. Go to the Developer Dashboard
3. Generate your API ID and API Token
4. Copy these credentials to your `.env` file

### 4. Test the API Connection

You can test if your API credentials are working by making a request to the wilayas endpoint:

```bash
curl "https://api.yalidine.app/v1/wilayas/" \
  -H "X-API-ID: YOUR_API_ID" \
  -H "X-API-TOKEN: YOUR_API_TOKEN"
```

## 🎯 Features Implemented

### ✅ Phase 1: Core Integration

1. **Shipping Cost Calculator**
   - Real-time cost calculation based on origin/destination
   - Support for all Algerian wilayas and communes
   - Weight-based pricing with volumetric weight calculation
   - Express and economic delivery options
   - Home delivery and pickup point options

2. **Location Management**
   - Wilayas (provinces) API integration
   - Communes (municipalities) API integration
   - Pickup centers API integration
   - Automatic location data loading

3. **Shipment Creation**
   - Create shipments with full customer details
   - Support for insurance and COD options
   - Automatic tracking number generation
   - Shipping label generation

4. **Real-time Tracking**
   - Track shipments by tracking number
   - Complete shipment history
   - Current status and location
   - Delivery timeline

### 🔄 Phase 2: Advanced Features (Coming Soon)

1. **Bulk Shipment Management**
2. **Automated Order Processing**
3. **Advanced Analytics**
4. **Webhook Integration**

## 🛠️ API Endpoints

### Backend Routes (`/api/shipping`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status` | Check if Yalidine is configured |
| GET | `/wilayas` | Get all wilayas (provinces) |
| GET | `/communes` | Get communes by wilaya |
| GET | `/centers` | Get pickup centers |
| POST | `/calculate-fees` | Calculate shipping costs |
| POST | `/create-shipment` | Create a new shipment |
| GET | `/shipment/:tracking` | Get shipment details |
| GET | `/tracking/:tracking` | Get tracking history |
| PATCH | `/shipment/:tracking` | Update shipment |
| DELETE | `/shipment/:tracking` | Delete shipment |

### Frontend Components

1. **ShippingCalculator** (`/components/shipping-calculator.tsx`)
   - Interactive shipping cost calculator
   - Location selection with dropdowns
   - Package details input
   - Delivery options selection

2. **TrackingComponent** (`/components/tracking-component.tsx`)
   - Real-time shipment tracking
   - Status timeline
   - Shipment details display
   - Label download

3. **ShipmentManager** (`/components/admin/shipment-manager.tsx`)
   - Admin shipment creation
   - Bulk shipment management
   - Tracking and monitoring
   - Label generation

## 📱 Usage Examples

### 1. Calculate Shipping Costs

```typescript
import { yalidineAPI } from '@/lib/yalidine-api';

const fees = await yalidineAPI.calculateFees({
  fromWilayaId: 16, // Alger
  toWilayaId: 19,   // Sétif
  weight: 2.5,
  length: 30,
  width: 20,
  height: 15,
  declaredValue: 50000
});

console.log('Shipping cost:', fees.deliveryOptions.express.home);
```

### 2. Create a Shipment

```typescript
const shipment = await yalidineAPI.createShipment({
  orderId: 'ORD-123456',
  customerName: 'Ahmed Benali',
  customerPhone: '0550123456',
  customerAddress: '123 Rue de la Liberté',
  fromWilayaName: 'Alger',
  toWilayaName: 'Sétif',
  toCommuneName: 'Sétif',
  productList: 'Traditional Karakou Dress',
  price: 25000,
  weight: 1.5,
  length: 30,
  width: 20,
  height: 10,
  doInsurance: true,
  declaredValue: 30000
});
```

### 3. Track a Shipment

```typescript
const tracking = await yalidineAPI.getTracking('yal-123456');
console.log('Current status:', tracking.data[0].status);
```

## 🎨 Frontend Integration

### 1. Add to Checkout Page

```tsx
import { ShippingCalculator } from '@/components/shipping-calculator';

// In your checkout component
<ShippingCalculator
  onShippingSelected={(shippingData) => {
    setShippingCost(shippingData.cost);
    setDeliveryMethod(shippingData.method);
  }}
  orderTotal={cartTotal}
  items={cartItems}
/>
```

### 2. Add to Admin Dashboard

```tsx
import { ShipmentManager } from '@/components/admin/shipment-manager';

// In your admin shipping page
<ShipmentManager />
```

### 3. Add Tracking Page

```tsx
import { TrackingComponent } from '@/components/tracking-component';

// In your tracking page
<TrackingComponent initialTrackingNumber={trackingNumber} />
```

## 🔒 Security Considerations

1. **API Credentials**: Never expose API credentials in frontend code
2. **Rate Limiting**: Yalidine has rate limits (5/sec, 50/min, 1000/hour, 10000/day)
3. **Validation**: All inputs are validated on both frontend and backend
4. **Error Handling**: Comprehensive error handling for API failures

## 📊 Rate Limits

| Time Period | Limit | HTTP Header |
|-------------|-------|-------------|
| Per Second | 5 requests | `x-second-quota-left` |
| Per Minute | 50 requests | `x-minute-quota-left` |
| Per Hour | 1000 requests | `x-hour-quota-left` |
| Per Day | 10000 requests | `x-day-quota-left` |

## 🚨 Error Handling

The integration includes comprehensive error handling:

1. **API Connection Errors**: Graceful fallback when API is unavailable
2. **Invalid Credentials**: Clear error messages for configuration issues
3. **Rate Limit Exceeded**: Automatic retry with exponential backoff
4. **Validation Errors**: Detailed error messages for invalid inputs

## 🧪 Testing

### 1. Test API Connection

```bash
# Test wilayas endpoint
curl "http://localhost:5000/api/shipping/wilayas"

# Test status endpoint
curl "http://localhost:5000/api/shipping/status"
```

### 2. Test Cost Calculation

```bash
curl -X POST "http://localhost:5000/api/shipping/calculate-fees" \
  -H "Content-Type: application/json" \
  -d '{
    "fromWilayaId": 16,
    "toWilayaId": 19,
    "weight": 2.5,
    "length": 30,
    "width": 20,
    "height": 15
  }'
```

### 3. Test Shipment Creation

```bash
curl -X POST "http://localhost:5000/api/shipping/create-shipment" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-001",
    "customerName": "Test Customer",
    "customerPhone": "0550123456",
    "customerAddress": "Test Address",
    "fromWilayaName": "Alger",
    "toWilayaName": "Sétif",
    "toCommuneName": "Sétif",
    "productList": "Test Product",
    "price": 10000,
    "weight": 1,
    "length": 20,
    "width": 15,
    "height": 10
  }'
```

## 🔧 Troubleshooting

### Common Issues

1. **"Yalidine API not configured"**
   - Check your `.env` file has the correct API credentials
   - Restart your backend server after adding credentials

2. **"Failed to fetch wilayas"**
   - Verify your API credentials are correct
   - Check your internet connection
   - Verify Yalidine API is accessible

3. **"Invalid phone number format"**
   - Phone numbers must be in Algerian format: 05xxxxxxxx, 06xxxxxxxx, or 07xxxxxxxx
   - For landlines: 02xxxxxxx, 03xxxxxxx, or 04xxxxxxx

4. **"Rate limit exceeded"**
   - Wait for the rate limit to reset
   - Implement caching for frequently accessed data
   - Consider implementing request queuing

### Debug Mode

Enable debug logging by setting the environment variable:

```env
DEBUG=yalidine:*
```

## 📞 Support

For issues with the Yalidine API integration:

1. **Check the logs**: Look for error messages in your backend console
2. **Verify credentials**: Ensure your API credentials are correct
3. **Test API directly**: Use curl commands to test the Yalidine API directly
4. **Contact Yalidine**: For API-specific issues, contact developer@yalidine.com

## 🚀 Next Steps

1. **Configure your API credentials** in the `.env` file
2. **Test the integration** using the provided test commands
3. **Integrate into your checkout flow** using the ShippingCalculator component
4. **Set up admin management** using the ShipmentManager component
5. **Monitor usage** and implement caching as needed

## 📚 Additional Resources

- [Yalidine API Documentation](https://api.yalidine.app/docs)
- [Algerian Postal Codes](https://www.poste.dz/codes-postaux/)
- [Yalidine Developer Dashboard](https://yalidine.app/developer)

---

**Note**: This integration is designed for the Algerian market and uses Yalidine's shipping services. Make sure you comply with all local regulations and Yalidine's terms of service. 