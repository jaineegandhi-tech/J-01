export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes('all') || user.permissions.includes(permission);
};

export const canAccessRoute = (user, route) => {
  if (!user) return false;
  
  const routePermissions = {
    '/': 'dashboard',
    '/dashboard': 'dashboard',
    '/users': 'users',
    '/properties': 'properties',
    '/transactions': 'transactions',
    '/inquiries': 'inquiries',
    '/payments': 'payments',
    '/reports': 'reports',
    '/roles': 'roles',
    '/referrals': 'referrals',
    '/settings': 'settings'
  };
  
  const requiredPermission = routePermissions[route];
  return hasPermission(user, requiredPermission);
};