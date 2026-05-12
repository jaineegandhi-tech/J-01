// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Property Types (Listing Types)
export const PROPERTY_TYPES = [
  { value: 'sale', label: 'Sale' },
  { value: 'rent', label: 'Rent' },
  { value: 'foreclosure', label: 'Foreclosure' }
];

// Property Categories
export const PROPERTY_CATEGORIES = [
  { value: 'flat', label: 'Flat' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condo' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'penthouse', label: 'Penthouse' }
];

// Property Status
export const PROPERTY_STATUS = [
  { value: 'pending_approval', label: 'Pending Approval', color: '#f97316' },
  { value: 'active', label: 'Active', color: '#10b981' },
  { value: 'rejected', label: 'Rejected', color: '#ef4444' },
  { value: 'expired', label: 'Expired', color: '#6b7280' },
  { value: 'featured', label: 'Featured', color: '#8b5cf6' }
];

// Rejection Reasons
export const REJECTION_REASONS = [
  { value: 'missing_info', label: 'Missing/Incorrect Info' },
  { value: 'invalid_price', label: 'Invalid Price/Details' },
  { value: 'low_quality_images', label: 'Low-Quality Images' },
  { value: 'duplicate_listing', label: 'Duplicate Listing' },
  { value: 'fraudulent', label: 'Fraudulent/Suspicious' },
  { value: 'other', label: 'Other' }
];

// User Roles
export const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'client', label: 'Client' },
  { value: 'agent', label: 'Agent' },
  { value: 'lender', label: 'Lender' },
  { value: 'developer', label: 'Developer' },
  { value: 'advertiser', label: 'Advertiser' },
  { value: 'affiliate', label: 'Affiliate' }
];

// User Status
export const USER_STATUS = [
  { value: 'active', label: 'Active', color: '#10b981' },
  { value: 'inactive', label: 'Inactive', color: '#ef4444' },
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'suspended', label: 'Suspended', color: '#6b7280' }
];

// Transaction Types
export const TRANSACTION_TYPES = [
  { value: 'sale', label: 'Sale' },
  { value: 'rent', label: 'Rent' },
  { value: 'lease', label: 'Lease' }
];

// Transaction Status
export const TRANSACTION_STATUS = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'active', label: 'Active', color: '#10b981' },
  { value: 'rejected', label: 'Rejected', color: '#ef4444' },
  { value: 'completed', label: 'Completed', color: '#3b82f6' },
  { value: 'cancelled', label: 'Cancelled', color: '#6b7280' }
];

// Inquiry Status
export const INQUIRY_STATUS = [
  { value: 'new', label: 'New', color: '#3b82f6' },
  { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { value: 'resolved', label: 'Resolved', color: '#10b981' },
  { value: 'closed', label: 'Closed', color: '#6b7280' }
];

// Payment Status
export const PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'completed', label: 'Completed', color: '#10b981' },
  { value: 'failed', label: 'Failed', color: '#ef4444' },
  { value: 'refunded', label: 'Refunded', color: '#6b7280' }
];

// Dashboard Stats
export const DASHBOARD_STATS = {
  TOTAL_PROPERTIES: 'total_properties',
  ACTIVE_PROPERTIES: 'active_properties',
  TOTAL_USERS: 'total_users',
  ACTIVE_AGENTS: 'active_agents',
  PENDING_INQUIRIES: 'pending_inquiries',
  MONTHLY_REVENUE: 'monthly_revenue',
  RECENT_TRANSACTIONS: 'recent_transactions',
  TOP_AGENTS: 'top_agents'
};

// Chart Colors
export const CHART_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#ec4899',
  '#6b7280'
];

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  MAX_FILES: 10
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-()]+$/,
  PASSWORD_MIN_LENGTH: 8,
  REQUIRED_FIELDS: {
    PROPERTY: ['title', 'type', 'price', 'location', 'description'],
    USER: ['firstName', 'lastName', 'email', 'role'],
    TRANSACTION: ['propertyId', 'buyerId', 'sellerId', 'amount', 'type']
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_CHARTS: '/dashboard/charts',
  
  // Properties
  PROPERTIES: '/properties',
  PROPERTY_BY_ID: '/properties/:id',
  PROPERTY_IMAGES: '/properties/:id/images',
  PROPERTY_FEATURES: '/properties/:id/features',
  
  // Users
  USERS: '/users',
  USER_BY_ID: '/users/:id',
  USER_PROFILE: '/users/profile',
  
  // Agents
  AGENTS: '/agents',
  AGENT_BY_ID: '/agents/:id',
  AGENT_PROPERTIES: '/agents/:id/properties',
  AGENT_STATS: '/agents/:id/stats',
  
  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_BY_ID: '/transactions/:id',
  
  // Inquiries
  INQUIRIES: '/inquiries',
  INQUIRY_BY_ID: '/inquiries/:id',
  
  // Payments
  PAYMENTS: '/payments',
  PAYMENT_BY_ID: '/payments/:id',
  
  // Reports
  REPORTS: '/reports',
  EXPORT_REPORT: '/reports/export',
  
  // Settings
  SETTINGS: '/settings',
  SYSTEM_SETTINGS: '/settings/system',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_NOTIFICATION_READ: '/notifications/:id/read',
  
  // File Upload
  UPLOAD_FILE: '/upload',
  DELETE_FILE: '/upload/:id',
  
  // Referral System
  AFFILIATE_APPLICATIONS: '/referrals/applications',
  APPLICATION_BY_ID: '/referrals/applications/:id',
  ACTIVE_AFFILIATES: '/referrals/affiliates',
  AFFILIATE_BY_ID: '/referrals/affiliates/:id',
  COMMISSION_RULES: '/referrals/commission',
  REFERRAL_TRACKING: '/referrals/tracking',
  PAYOUT_MANAGEMENT: '/referrals/payouts',
  REFERRAL_REPORTS: '/referrals/reports',
  REFERRAL_SETTINGS: '/referrals/settings'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
  SENT: 'Sent successfully!',
  UPLOADED: 'Uploaded successfully!'
};

// Promotion Status
export const PROMOTION_STATUS = [
  { value: 'active', label: 'Active', color: '#10b981' },
  { value: 'scheduled', label: 'Scheduled', color: '#3b82f6' },
  { value: 'expired', label: 'Expired', color: '#6b7280' },
  { value: 'inactive', label: 'Inactive', color: '#ef4444' }
];

// Discount Types
export const DISCOUNT_TYPES = [
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'percentage', label: 'Percentage' }
];

// User Segments for Promotions
export const USER_SEGMENTS = [
  { value: 'all', label: 'All Users' },
  { value: 'new', label: 'New Users Only' },
  { value: 'returning', label: 'Returning Users' },
  { value: 'churn', label: 'Churn Users' },
  { value: 'geographic', label: 'Geographic Segment' }
];

// Applicable Services for Promotions
export const PROMOTION_SERVICES = [
  { value: 'subscription_plans', label: 'Subscription Plans' },
  { value: 'transaction_fees', label: 'Transaction Fees' },
  { value: 'listing_upgrades', label: 'Listing Upgrades' },
  { value: 'featured_listings', label: 'Featured Listings' },
  { value: 'premium_services', label: 'Premium Services' }
];

// Referral System Constants
export const REFERRAL_MODES = [
  { value: 'standard', label: 'Standard Affiliate Model' },
  { value: 'chain', label: 'Chain Referral Model (2-Level MLM)' }
];

export const APPLICATION_STATUS = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'active', label: 'Active', color: '#10b981' },
  { value: 'rejected', label: 'Rejected', color: '#ef4444' }
];

export const AFFILIATE_USER_TYPES = [
  { value: 'agent', label: 'Agent' },
  { value: 'client', label: 'Client' },
  { value: 'developer', label: 'Developer' },
  { value: 'advertiser', label: 'Advertiser' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' }
];

export const PAYOUT_METHODS = [
  { value: 'aba', label: 'ABA Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'crypto', label: 'Cryptocurrency' }
];



// Navigation Menu Items
export const MENU_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/admin',
    icon: 'BarChart3'
  },
  {
    key: 'users',
    label: 'Users',
    path: '/admin/users',
    icon: 'Users'
  },
  {
    key: 'properties',
    label: 'Properties',
    path: '/admin/properties',
    icon: 'Building2',
    children: [
      { key: 'all-properties', label: 'All Properties', path: '/admin/properties' },
      { key: 'add-property', label: 'Add Property', path: '/admin/properties/add' },
      { key: 'active-properties', label: 'Active Properties', path: '/admin/properties?status=active' },
      { key: 'featured-properties', label: 'Featured Properties', path: '/admin/properties?status=featured' }
    ]
  },
  {
    key: 'promotions',
    label: 'Promotions',
    path: '/admin/promotions',
    icon: 'Tag',
    children: [
      { key: 'all-promotions', label: 'All Promotions', path: '/admin/promotions' },
      { key: 'add-promotion', label: 'Create Promotion', path: '/admin/promotions/add' },
      { key: 'promo-codes', label: 'Promo Codes', path: '/admin/promotions/codes' },
      { key: 'promotion-analytics', label: 'Analytics', path: '/admin/promotions/analytics' }
    ]
  },
  {
    key: 'transactions',
    label: 'Transactions',
    path: '/admin/transactions',
    icon: 'CreditCard'
  },
  {
    key: 'inquiries',
    label: 'Inquiries',
    path: '/admin/inquiries',
    icon: 'MessageSquare'
  },
  {
    key: 'payments',
    label: 'Payments',
    path: '/admin/payments',
    icon: 'DollarSign'
  },
  {
    key: 'reports',
    label: 'Reports',
    path: '/admin/reports',
    icon: 'FileText',
    children: [
      { key: 'sales-report', label: 'Sales Report', path: '/admin/reports/sales' },
      { key: 'user-report', label: 'User Report', path: '/admin/reports/users' },
      { key: 'property-report', label: 'Property Report', path: '/admin/reports/properties' }
    ]
  },
  {
    key: 'roles',
    label: 'Roles & Permissions',
    path: '/admin/roles',
    icon: 'Shield'
  },
  {
    key: 'referrals',
    label: 'Referral Management',
    path: '/admin/referrals',
    icon: 'Users2',
    children: [
      { key: 'affiliate-applications', label: 'Affiliate Applications', path: '/admin/referrals/applications' },
      { key: 'active-affiliates', label: 'Active Affiliates', path: '/admin/referrals/affiliates' },
      { key: 'commission-rules', label: 'Commission Rules', path: '/admin/referrals/commission' },
      { key: 'payout-management', label: 'Payout Management', path: '/admin/referrals/payouts' },
      { key: 'referral-reports', label: 'Reports & Audits', path: '/admin/referrals/reports' }
    ]
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: 'Settings'
  }
];

export const SYSTEM_SETTINGS_TABS = [
  { id: 'general', label: 'General Settings', icon: 'Globe' },
  { id: 'security', label: 'Security Settings', icon: 'Shield' },
  { id: 'payments', label: 'Payment Gateway', icon: 'CreditCard' }
];