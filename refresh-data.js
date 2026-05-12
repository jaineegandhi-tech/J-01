// Refresh property data - run this in browser console
console.log('🔄 Refreshing property data...');

// Clear existing data to force reload
localStorage.removeItem('realestate_properties');
localStorage.removeItem('realestate_users');

// Reload the page to reinitialize data
window.location.reload();

console.log('✅ Data refreshed! Page will reload automatically.');