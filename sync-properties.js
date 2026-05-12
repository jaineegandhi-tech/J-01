// Property Data Sync Script
// Run this in browser console to ensure properties are visible in user app

console.log('🔄 Syncing property data...');

// Get existing properties from admin panel
const existingProperties = JSON.parse(localStorage.getItem('realestate_properties') || '[]');
console.log('📊 Found', existingProperties.length, 'properties in admin panel');

// Ensure all properties have active status for user app visibility
const activeProperties = existingProperties.map(property => ({
  ...property,
  status: property.status === 'sold' || property.status === 'rented' ? property.status : 'active',
  image: property.images && property.images[0] ? property.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
}));

// Update localStorage
localStorage.setItem('realestate_properties', JSON.stringify(activeProperties));

// Trigger storage event for real-time sync
window.dispatchEvent(new StorageEvent('storage', {
  key: 'realestate_properties',
  newValue: JSON.stringify(activeProperties)
}));

console.log('✅ Property data synced successfully!');
console.log('🏠 Active properties:', activeProperties.filter(p => p.status === 'active').length);
console.log('📋 All properties:', activeProperties.length);

// Display sample property for verification
if (activeProperties.length > 0) {
  console.log('📝 Sample property:', {
    id: activeProperties[0].id,
    title: activeProperties[0].title,
    status: activeProperties[0].status,
    price: activeProperties[0].price,
    location: activeProperties[0].location
  });
}