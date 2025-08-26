# 🚀 Yalidine Integration Setup Guide

This guide will help you properly integrate Yalidine shipping API into your e-commerce application.

## 📋 Prerequisites

1. **Yalidine Account**: You need a Yalidine account with API access
2. **API Credentials**: Your Yalidine API ID and API Token
3. **Backend Environment**: Node.js backend with the shipping routes already implemented

## 🔧 Step 1: Get Yalidine API Credentials

1. Go to the [Yalidine Developer Dashboard](https://yalidine.app)
2. Log in to your account
3. Navigate to API settings
4. Generate your **API ID** and **API TOKEN**
5. Save these credentials securely

## 🔧 Step 2: Configure Environment Variables

Create a `.env` file in your `backend` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin User Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Security
BCRYPT_ROUNDS=12

# Yalidine Shipping API Configuration
YALIDINE_API_ID=your-actual-api-id-here
YALIDINE_API_TOKEN=your-actual-api-token-here
```

**Replace** `your-actual-api-id-here` and `your-actual-api-token-here` with your real Yalidine credentials.

## 🔧 Step 3: Test the Integration

### Test Yalidine API Connection

```bash
cd backend
node test-yalidine.js
```

This will test:
- ✅ API configuration
- ✅ Connection to Yalidine servers
- ✅ Fetching wilayas (provinces)
- ✅ Fetching communes (cities)
- ✅ Fetching delivery centers
- ✅ Calculating shipping fees
- ✅ Rate limit monitoring

### Test Checkout Flow

```bash
cd backend
node test-checkout-flow.js
```

This will test:
- ✅ Shipping fee calculations
- ✅ Parcel data preparation
- ✅ Phone number validation
- ✅ Weight calculations

## 🔧 Step 4: Start Your Servers

### Backend Server
```bash
cd backend
npm run dev
```

### Frontend Server
```bash
cd frontend
npm run dev
```

## 🔧 Step 5: Test the Checkout Page

1. Go to your frontend application (usually `http://localhost:3000`)
2. Add some products to your cart
3. Go to the checkout page
4. Fill in customer information
5. Select a wilaya (province)
6. Select a commune (city)
7. Choose delivery type (Home or Pickup)
8. Verify shipping fees are calculated correctly
9. Complete the order

## 📊 What's Already Implemented

### Backend Features ✅
- **Yalidine Service**: Complete API integration
- **Shipping Routes**: All necessary endpoints
- **Caching**: 5-minute cache for API responses
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: Respects Yalidine API limits
- **Validation**: Input validation with Zod schemas

### Frontend Features ✅
- **Yalidine API Client**: Type-safe API calls
- **Checkout Page**: Complete checkout flow
- **Dynamic Loading**: Wilayas, communes, centers
- **Real-time Calculations**: Shipping fees
- **Form Validation**: Client-side validation
- **Error Handling**: User-friendly error messages

### API Endpoints Available ✅
- `GET /api/shipping/status` - Check Yalidine status
- `GET /api/shipping/wilayas` - Get all provinces
- `GET /api/shipping/communes` - Get cities by province
- `GET /api/shipping/centers` - Get pickup centers
- `POST /api/shipping/calculate-fees` - Calculate shipping costs
- `POST /api/shipping/create-shipment` - Create shipping label
- `GET /api/shipping/shipment/:tracking` - Get shipment details
- `GET /api/shipping/tracking/:tracking` - Get tracking history

## 🚨 Important Notes

### Rate Limits
Yalidine API has the following rate limits:
- **Per second**: 5 requests
- **Per minute**: 50 requests
- **Per hour**: 1000 requests
- **Per day**: 10000 requests

The application includes caching to minimize API calls.

### Phone Number Format
Algerian phone numbers must be in the correct format:
- **Mobile**: `05xxxxxxxx`, `06xxxxxxxx`, `07xxxxxxxx`
- **Landline**: `02xxxxxxx`, `03xxxxxxx`, `04xxxxxxx`

### Weight Calculations
The system automatically calculates:
- **Volumetric weight**: `length × width × height × 0.0002`
- **Billable weight**: Maximum of actual weight and volumetric weight
- **Oversize fees**: Applied for packages over 5kg

## 🐛 Troubleshooting

### Common Issues

1. **"Yalidine API not configured"**
   - Check your `.env` file has the correct credentials
   - Restart your backend server after changing `.env`

2. **"API connection failed"**
   - Verify your API credentials are correct
   - Check your internet connection
   - Ensure you haven't exceeded rate limits

3. **"Failed to fetch wilayas"**
   - Check Yalidine API status
   - Verify your account is active
   - Check rate limit headers in response

4. **"Invalid phone number"**
   - Ensure phone number follows Algerian format
   - Remove any spaces or special characters

### Debug Commands

```bash
# Test API connection
node test-yalidine.js

# Test checkout flow
node test-checkout-flow.js

# Check backend logs
npm run dev

# Check frontend console
# Open browser developer tools
```

## 📞 Support

If you encounter issues:

1. **Check the logs**: Look for error messages in console
2. **Run test scripts**: Use the provided test files
3. **Verify credentials**: Double-check your API credentials
4. **Contact Yalidine**: Email `developer@yalidine.com` for API issues

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ `node test-yalidine.js` shows "All tests passed!"
- ✅ Checkout page loads wilayas and communes
- ✅ Shipping fees are calculated correctly
- ✅ Orders can be placed successfully
- ✅ Shipping labels are generated

---

**Happy shipping! 🚚**
