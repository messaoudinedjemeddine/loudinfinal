// Test script to verify cart functionality
// Run this in the browser console

console.log('🧪 Testing cart functionality...');

// Clear any existing cart
localStorage.removeItem('cart');
console.log('✅ Cleared existing cart');

// Test product data (using the new product IDs from database)
const testProduct = {
  id: 'cmeh2yql0000j47p46ll9779c', // Elegant Haik Dress
  name: 'Elegant Haik Dress',
  price: 18000,
  image: '/placeholder.svg',
  quantity: 1
};

// Add test product to cart
const cart = {
  items: [testProduct]
};

localStorage.setItem('cart', JSON.stringify(cart));
console.log('✅ Added test product to cart:', testProduct);

// Verify cart was saved
const savedCart = localStorage.getItem('cart');
console.log('📦 Saved cart data:', savedCart);

// Test order data
const testOrderData = {
  customerName: 'Test Customer',
  customerPhone: '0550123456',
  deliveryType: 'HOME_DELIVERY',
  wilayaId: 5, // Batna
  deliveryAddress: 'Test Address',
  items: [{
    productId: testProduct.id,
    quantity: testProduct.quantity
  }]
};

console.log('📋 Test order data:', testOrderData);
console.log('✅ Test setup complete! You can now try placing an order.');
