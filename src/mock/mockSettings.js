// ── Account & Admin ──────────────────────────────────────────────
export const mockAdmins = [
  { id: 1, name: 'Grant Bryan', email: 'superadmin@gamexpay.com', role: 'Super Admin', lastLogin: '2026-03-22 09:15', status: 'active', avatar: null },
  { id: 2, name: 'Jane Okafor', email: 'admin@gamexpay.com', role: 'Admin', lastLogin: '2026-03-21 14:30', status: 'active', avatar: null },
  { id: 3, name: 'Emeka Nwosu', email: 'emeka@gamexpay.com', role: 'Support', lastLogin: '2026-03-20 11:00', status: 'inactive', avatar: null },
];

export const mockRoles = [
  { id: 1, name: 'Super Admin', members: 1, permissions: { dashboard: true, games: true, orders: true, transactions: true, settings: true, users: true } },
  { id: 2, name: 'Admin', members: 1, permissions: { dashboard: true, games: false, orders: true, transactions: true, settings: false, users: false } },
  { id: 3, name: 'Support', members: 1, permissions: { dashboard: true, games: false, orders: true, transactions: false, settings: false, users: false } },
];

export const mockSessions = [
  { id: 1, device: 'Chrome on macOS', ip: '197.210.84.22', location: 'Lagos, Nigeria', lastActive: '2 minutes ago', current: true },
  { id: 2, device: 'Safari on iPhone 15', ip: '197.210.84.55', location: 'Lagos, Nigeria', lastActive: '3 hours ago', current: false },
  { id: 3, device: 'Firefox on Windows 11', ip: '41.58.200.12', location: 'Abuja, Nigeria', lastActive: '1 day ago', current: false },
];

export const mockAuditLogs = [
  { id: 1, action: 'Updated game bundle price (CODM 80 CP → ₦1,200)', user: 'superadmin@gamexpay.com', ip: '197.210.84.22', timestamp: '2026-03-22 09:12', category: 'Games' },
  { id: 2, action: 'Marked order GXP-1023 as Completed', user: 'superadmin@gamexpay.com', ip: '197.210.84.22', timestamp: '2026-03-22 08:45', category: 'Orders' },
  { id: 3, action: 'Admin login successful', user: 'admin@gamexpay.com', ip: '197.210.86.10', timestamp: '2026-03-21 14:30', category: 'Auth' },
  { id: 4, action: 'Added new game: Genshin Impact', user: 'superadmin@gamexpay.com', ip: '197.210.84.22', timestamp: '2026-03-21 11:00', category: 'Games' },
  { id: 5, action: 'Updated transaction limits (daily cap ₦5,000,000)', user: 'superadmin@gamexpay.com', ip: '197.210.84.22', timestamp: '2026-03-20 16:20', category: 'Settings' },
  { id: 6, action: 'Cancelled order GXP-998', user: 'admin@gamexpay.com', ip: '197.210.86.10', timestamp: '2026-03-20 10:05', category: 'Orders' },
  { id: 7, action: 'Generated new API key: Production v2', user: 'superadmin@gamexpay.com', ip: '197.210.84.22', timestamp: '2026-03-19 15:30', category: 'Security' },
];

// ── Payment & Transactions ────────────────────────────────────────
export const mockPaymentMethods = [
  { id: 'card', name: 'Card Payments', description: 'Visa, Mastercard, Verve', enabled: true },
  { id: 'ussd', name: 'USSD', description: '*737#, *901# and other codes', enabled: true },
  { id: 'bank_transfer', name: 'Bank Transfer', description: 'Direct bank transfers', enabled: true },
  { id: 'crypto', name: 'Cryptocurrency', description: 'BTC, ETH, USDT', enabled: false },
  { id: 'mobile_money', name: 'Mobile Money', description: 'MTN MoMo, Airtel Money', enabled: false },
];

export const mockTransactionLimits = {
  card: { min: 100, max: 500000, dailyCap: 2000000 },
  ussd: { min: 100, max: 100000, dailyCap: 500000 },
  bank_transfer: { min: 1000, max: 5000000, dailyCap: 10000000 },
};

export const mockFeeStructure = [
  { id: 1, method: 'Card', type: 'Percentage', value: 1.5, cap: 2000 },
  { id: 2, method: 'USSD', type: 'Flat', value: 50, cap: null },
  { id: 3, method: 'Bank Transfer', type: 'Percentage', value: 1.0, cap: 1500 },
  { id: 4, method: 'Crypto', type: 'Percentage', value: 0.5, cap: null },
];

export const mockFraudRules = [
  { id: 1, condition: 'Transaction amount', operator: '>', threshold: 500000, action: 'Flag for review' },
  { id: 2, condition: 'Failed attempts per hour', operator: '>=', threshold: 5, action: 'Block IP temporarily' },
  { id: 3, condition: 'Daily volume per user', operator: '>', threshold: 1000000, action: 'Require verification' },
  { id: 4, condition: 'Velocity (tx per minute)', operator: '>', threshold: 10, action: 'Rate limit user' },
];

export const mockPayoutConfig = { frequency: 'Weekly', threshold: 50000, dayOfWeek: 'Monday' };

// ── Game & Platform ───────────────────────────────────────────────
export const mockGameCatalog = [
  { id: 1, name: 'Call of Duty Mobile', category: 'FPS', enabled: true, regions: ['NG', 'GH', 'KE'] },
  { id: 2, name: 'Free Fire', category: 'Battle Royale', enabled: true, regions: ['NG', 'GH'] },
  { id: 3, name: 'PUBG Mobile', category: 'Battle Royale', enabled: true, regions: ['NG'] },
  { id: 4, name: 'Genshin Impact', category: 'RPG', enabled: false, regions: ['NG', 'GH', 'KE', 'ZA'] },
  { id: 5, name: 'Mobile Legends', category: 'MOBA', enabled: true, regions: ['NG', 'GH'] },
  { id: 6, name: 'Clash of Clans', category: 'Strategy', enabled: true, regions: ['NG', 'GH', 'KE'] },
  { id: 7, name: 'EA FC Mobile', category: 'Sports', enabled: false, regions: ['NG'] },
];

export const mockCurrencyRates = [
  { id: 1, from: 'USD', to: 'NGN', rate: 1610, lastUpdated: '2026-03-22 06:00' },
  { id: 2, from: 'GBP', to: 'NGN', rate: 2030, lastUpdated: '2026-03-22 06:00' },
  { id: 3, from: 'EUR', to: 'NGN', rate: 1740, lastUpdated: '2026-03-22 06:00' },
  { id: 4, from: 'GHS', to: 'NGN', rate: 100, lastUpdated: '2026-03-22 06:00' },
];

export const mockBonusConfig = {
  welcomeBonus: { enabled: true, percent: 10, maxAmount: 5000 },
  cashback: { enabled: true, percent: 2, minSpend: 10000 },
  referral: { enabled: true, amount: 500, referrerAmount: 200 },
};

// ── Regional & Compliance ─────────────────────────────────────────
export const mockRegions = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', enabled: true, kyc: 'Full', minAge: 18, taxRate: 7.5, amlThreshold: 5000000 },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', enabled: true, kyc: 'Basic', minAge: 18, taxRate: 0, amlThreshold: 10000 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', enabled: true, kyc: 'Basic', minAge: 18, taxRate: 16, amlThreshold: 500000 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', enabled: false, kyc: 'Full', minAge: 18, taxRate: 15, amlThreshold: 250000 },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', enabled: false, kyc: 'None', minAge: 18, taxRate: 0, amlThreshold: 1000000 },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', enabled: false, kyc: 'Basic', minAge: 18, taxRate: 0, amlThreshold: 1000000 },
];

// ── Notifications ─────────────────────────────────────────────────
export const mockNotificationChannels = [
  { id: 'email', name: 'Email', description: 'Transaction receipts and alerts', enabled: true },
  { id: 'sms', name: 'SMS', description: 'OTP and critical alerts only', enabled: true },
  { id: 'push', name: 'Push Notifications', description: 'In-app and browser push', enabled: false },
  { id: 'webhook', name: 'Webhook', description: 'HTTP POST to your endpoints', enabled: true },
];

export const mockAlertTriggers = [
  { id: 1, event: 'Large transaction detected', channel: 'Email + SMS', threshold: 200000, enabled: true },
  { id: 2, event: 'Failed payment attempt', channel: 'Email', threshold: null, enabled: true },
  { id: 3, event: 'Daily revenue target reached', channel: 'Email', threshold: 500000, enabled: false },
  { id: 4, event: 'New admin login', channel: 'Email + SMS', threshold: null, enabled: true },
  { id: 5, event: 'Order volume spike', channel: 'Email', threshold: 50, enabled: false },
];

export const mockWebhooks = [
  { id: 1, event: 'payment.success', url: 'https://api.yourapp.com/webhooks/payment-success', active: true },
  { id: 2, event: 'payment.failed', url: 'https://api.yourapp.com/webhooks/payment-failed', active: true },
  { id: 3, event: 'order.completed', url: 'https://api.yourapp.com/webhooks/orders', active: false },
  { id: 4, event: 'order.cancelled', url: '', active: false },
];

// ── Security ──────────────────────────────────────────────────────
export const mockIPWhitelist = [
  { id: 1, ip: '197.210.84.22', label: 'Office — Lagos HQ', type: 'whitelist', added: '2026-01-10' },
  { id: 2, ip: '197.210.84.55', label: 'Remote Dev Machine', type: 'whitelist', added: '2026-02-05' },
];

export const mockIPBlacklist = [
  { id: 1, ip: '185.220.101.45', label: 'Suspicious activity', type: 'blacklist', added: '2026-03-10' },
  { id: 2, ip: '94.102.49.190', label: 'Known fraud IP', type: 'blacklist', added: '2026-03-15' },
];

export const mockApiKeys = [
  { id: 1, name: 'Production API Key', key: 'gxp_live_k8sH2mNpQr4wXzYaBcDeFgHiJkLmNoP', scope: 'Full Access', created: '2026-01-15', lastUsed: '2026-03-22', active: true },
  { id: 2, name: 'Test / Sandbox Key', key: 'gxp_test_aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpP', scope: 'Read Only', created: '2026-02-01', lastUsed: '2026-03-20', active: true },
  { id: 3, name: 'Analytics Integration', key: 'gxp_live_zZyYxXwWvVuUtTsSrRqQpPoOnNmMlLkK', scope: 'Read Only', created: '2026-02-20', lastUsed: '2026-03-18', active: false },
];

export const mockSecurityConfig = { maxLoginAttempts: 5, lockoutDuration: 30, dataRetentionDays: 365, sessionTimeout: 60 };

// ── Integrations ──────────────────────────────────────────────────
export const mockGatewayCredentials = [
  { id: 1, provider: 'Paystack', logo: '🅿️', fields: { publicKey: 'pk_demo_REPLACE_WITH_REAL_KEY', secretKey: 'sk_demo_REPLACE_WITH_REAL_KEY', webhookSecret: 'whsec_REPLACE_WITH_REAL_SECRET' }, active: true },
  { id: 2, provider: 'Flutterwave', logo: '🦋', fields: { publicKey: 'FLWPUBK-REPLACE_WITH_REAL_KEY-X', secretKey: 'FLWSECK-REPLACE_WITH_REAL_KEY-X', encKey: 'FLWENC-REPLACE_WITH_REAL_KEY' }, active: false },
];

export const mockAnalyticsIntegrations = [
  { id: 1, name: 'Google Analytics', trackingId: 'G-XXXXXXXXXX', enabled: true },
  { id: 2, name: 'Mixpanel', token: '', enabled: false },
  { id: 3, name: 'Segment', writeKey: '', enabled: false },
];

export const mockGameProviderKeys = [
  { id: 1, provider: 'CODM (Activision)', apiKey: 'act_xxxxxxxxxxxx', region: 'NG', active: true },
  { id: 2, provider: 'Free Fire (Garena)', apiKey: 'garena_xxxxxxxxxx', region: 'NG', active: true },
  { id: 3, provider: 'PUBG (Krafton)', apiKey: '', region: 'NG', active: false },
];

// ── Reporting ─────────────────────────────────────────────────────
export const mockScheduledReports = [
  { id: 1, name: 'Daily Revenue Summary', frequency: 'Daily', format: 'PDF', recipient: 'superadmin@gamexpay.com', enabled: true, nextRun: '2026-03-23 08:00' },
  { id: 2, name: 'Weekly Transaction Report', frequency: 'Weekly', format: 'CSV', recipient: 'superadmin@gamexpay.com', enabled: true, nextRun: '2026-03-28 08:00' },
  { id: 3, name: 'Monthly P&L Report', frequency: 'Monthly', format: 'Excel', recipient: 'superadmin@gamexpay.com', enabled: false, nextRun: '2026-04-01 08:00' },
  { id: 4, name: 'Game Performance Report', frequency: 'Weekly', format: 'PDF', recipient: 'admin@gamexpay.com', enabled: true, nextRun: '2026-03-28 09:00' },
];

export const mockReportingConfig = { defaultDateRange: '30d', dataRetention: '365', timezone: 'Africa/Lagos', defaultFormat: 'PDF' };

// ── General / System ──────────────────────────────────────────────
export const mockGeneralConfig = {
  platformName: 'GameXPay',
  supportEmail: 'support@gamexpay.com',
  timezone: 'Africa/Lagos',
  language: 'en',
  maintenanceMode: false,
  maintenanceMessage: 'We are performing scheduled maintenance. We will be back shortly.',
  smtpHost: 'smtp.resend.com',
  smtpPort: 587,
  smtpUser: 'resend',
  smtpPassword: '',
  smtpFrom: 'noreply@gamexpay.com',
};

export const mockFeatureFlags = [
  { id: 1, feature: 'Crypto Payments', key: 'crypto_payments', enabled: false, description: 'Enable cryptocurrency payment processing' },
{ id: 3, feature: 'Loyalty Points', key: 'loyalty_points', enabled: true, description: 'Reward users with points on every purchase' },
  { id: 4, feature: 'Auto-Fulfillment', key: 'auto_fulfillment', enabled: true, description: 'Automatically process and fulfill orders on payment' },
  { id: 5, feature: 'Guest Checkout', key: 'guest_checkout', enabled: false, description: 'Allow purchases without account registration' },
  { id: 6, feature: 'Email Receipts', key: 'email_receipts', enabled: true, description: 'Send automatic email receipts after purchase' },
];
