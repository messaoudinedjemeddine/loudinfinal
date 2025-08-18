// Setup test cart with valid product data
// Run this in the browser console to set up a test cart

console.log('🧪 Setting up test cart...');

// Clear any existing cart
localStorage.removeItem('cart');
console.log('✅ Cleared existing cart');

// Test product data (using the new product IDs from database)
const testProducts = [
  {
    id: 'cmeh2yql0000j47p46ll9779c', // Elegant Haik Dress
    name: 'Elegant Haik Dress',
    price: 18000,
    image: '/placeholder.svg',
    quantity: 1
  },
  {
    id: 'cmeh2yql0000i47p45zbk87ia', // Modern Takchita
    name: 'Modern Takchita',
    price: 32000,
    image: '/placeholder.svg',
    quantity: 1
  }
];

// Add test products to cart
const cart = {
  items: testProducts
};

localStorage.setItem('cart', JSON.stringify(cart));
console.log('✅ Added test products to cart:', testProducts);

// Verify cart was saved
const savedCart = localStorage.getItem('cart');
console.log('📦 Saved cart data:', savedCart);

console.log('✅ Test cart setup complete!');
console.log('🌐 Now visit: http://localhost:3000/checkout-new');
console.log('📋 You can now test the new checkout page with valid product data.');
