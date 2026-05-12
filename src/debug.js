// Debug localStorage data
console.log('=== DEBUG: LocalStorage Data ===');
console.log('Users:', JSON.parse(localStorage.getItem('realestate_users') || '[]'));
console.log('Properties:', JSON.parse(localStorage.getItem('realestate_properties') || '[]'));

// Clear and reinitialize
localStorage.clear();
console.log('LocalStorage cleared');

// Force page reload to reinitialize data
window.location.reload();