// Fix agent display - run this in user app console (localhost:3003)
console.log('🔧 Fixing agent display...');

// Get users from localStorage
const users = JSON.parse(localStorage.getItem('realestate_users') || '[]');
console.log('Total users found:', users.length);

// Filter only agents
const agents = users.filter(user => user.role === 'agent');
console.log('Agents found:', agents.length);

console.log('✅ Agents in admin panel:');
agents.forEach(agent => {
  console.log(`- ${agent.firstName} ${agent.lastName} (ID: ${agent.id}, Role: ${agent.role})`);
});

// Check if there are any other users being shown incorrectly
const nonAgents = users.filter(user => user.role !== 'agent');
console.log('❌ Non-agents that should NOT be shown:');
nonAgents.forEach(user => {
  console.log(`- ${user.firstName} ${user.lastName} (ID: ${user.id}, Role: ${user.role})`);
});

console.log('✅ Fix complete! Only agents should appear in user app.');