// Sync agents from admin panel to user app - run this in browser console
console.log('🔄 Syncing agents...');

// Get users from admin panel
const users = JSON.parse(localStorage.getItem('realestate_users') || '[]');
console.log('All users:', users);

// Filter agents
const agents = users.filter(user => user.role === 'agent');
console.log('Agents found:', agents);

if (agents.length === 0) {
  console.log('❌ No agents found in admin panel data');
} else {
  console.log(`✅ Found ${agents.length} agents:`);
  agents.forEach(agent => {
    console.log(`- ${agent.firstName} ${agent.lastName} (ID: ${agent.id})`);
  });
}

// Trigger storage event for real-time sync
window.dispatchEvent(new StorageEvent('storage', {
  key: 'realestate_users',
  newValue: JSON.stringify(users)
}));

console.log('✅ Agent data synced!');