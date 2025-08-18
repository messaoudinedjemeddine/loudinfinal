// Clear frontend cache script
// Run this in the browser console to clear all cached data

console.log('🧹 Clearing frontend cache...');

// Clear localStorage
localStorage.clear();
console.log('✅ localStorage cleared');

// Clear sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage cleared');

// Clear any cached data in memory
if (window.caches) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
    }
    console.log('✅ Cache storage cleared');
  });
}

// Force page reload to get fresh data
console.log('🔄 Reloading page to get fresh data...');
window.location.reload(true);
