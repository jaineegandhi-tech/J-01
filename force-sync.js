// Force sync properties - run this in browser console
console.log('🔄 Force syncing properties...');

// Get properties from admin panel
const adminProperties = JSON.parse(localStorage.getItem('realestate_properties') || '[]');
console.log('Admin properties:', adminProperties);

// Update all properties to be available (not sold/rented)
const updatedProperties = adminProperties.map(prop => ({
  ...prop,
  status: prop.status === 'sold' || prop.status === 'rented' ? 'active' : prop.status
}));

// Save back to localStorage
localStorage.setItem('realestate_properties', JSON.stringify(updatedProperties));

// Trigger storage event
window.dispatchEvent(new StorageEvent('storage', {
  key: 'realestate_properties',
  newValue: JSON.stringify(updatedProperties)
}));

console.log('✅ Properties synced! Available properties:', updatedProperties.filter(p => p.status !== 'sold' && p.status !== 'rented').length);