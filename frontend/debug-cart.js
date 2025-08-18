// Debug script to check cart contents
// Run this in the browser console

console.log('🔍 Debugging cart contents...');

// Check localStorage for cart data
const cartData = localStorage.getItem('cart');
console.log('📦 Cart data from localStorage:', cartData);

if (cartData) {
  try {
    const cart = JSON.parse(cartData);
    console.log('📋 Parsed cart:', cart);
    
    if (cart.items && cart.items.length > 0) {
      console.log('🛍️ Cart items:');
      cart.items.forEach((item, index) => {
        console.log(`${index + 1}. Product ID: ${item.id}`);
        console.log(`   Name: ${item.name}`);
        console.log(`   Price: ${item.price}`);
        console.log(`   Quantity: ${item.quantity}`);
        console.log('---');
      });
    } else {
      console.log('🛒 Cart is empty');
    }
  } catch (error) {
    console.error('❌ Error parsing cart data:', error);
  }
} else {
  console.log('🛒 No cart data found in localStorage');
}

// Check if there are any other storage keys
console.log('🔑 All localStorage keys:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`${key}: ${localStorage.getItem(key)}`);
}

// Check sessionStorage
console.log('🔑 All sessionStorage keys:');
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  console.log(`${key}: ${sessionStorage.getItem(key)}`);
}
