import * as mock from '../mock/mockSettings';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const settingsService = {
  // Account & Admin
  async getAdmins() { await delay(); return [...mock.mockAdmins]; },
  async getRoles() { await delay(); return [...mock.mockRoles]; },
  async getSessions() { await delay(); return [...mock.mockSessions]; },
  async getAuditLogs() { await delay(); return [...mock.mockAuditLogs]; },

  // Payment
  async getPaymentMethods() { await delay(); return [...mock.mockPaymentMethods]; },
  async getTransactionLimits() { await delay(); return { ...mock.mockTransactionLimits }; },
  async getFeeStructure() { await delay(); return [...mock.mockFeeStructure]; },
  async getFraudRules() { await delay(); return [...mock.mockFraudRules]; },
  async getPayoutConfig() { await delay(); return { ...mock.mockPayoutConfig }; },

  // Games
  async getGameCatalog() { await delay(); return [...mock.mockGameCatalog]; },
  async getCurrencyRates() { await delay(); return [...mock.mockCurrencyRates]; },
  async getBonusConfig() { await delay(); return { ...mock.mockBonusConfig }; },

  // Regional
  async getRegions() { await delay(); return [...mock.mockRegions]; },

  // Notifications
  async getNotificationChannels() { await delay(); return [...mock.mockNotificationChannels]; },
  async getAlertTriggers() { await delay(); return [...mock.mockAlertTriggers]; },
  async getWebhooks() { await delay(); return [...mock.mockWebhooks]; },

  // Security
  async getIPWhitelist() { await delay(); return [...mock.mockIPWhitelist]; },
  async getIPBlacklist() { await delay(); return [...mock.mockIPBlacklist]; },
  async getApiKeys() { await delay(); return [...mock.mockApiKeys]; },
  async getSecurityConfig() { await delay(); return { ...mock.mockSecurityConfig }; },

  // Integrations
  async getGatewayCredentials() { await delay(); return [...mock.mockGatewayCredentials]; },
  async getAnalyticsIntegrations() { await delay(); return [...mock.mockAnalyticsIntegrations]; },
  async getGameProviderKeys() { await delay(); return [...mock.mockGameProviderKeys]; },

  // Reporting
  async getScheduledReports() { await delay(); return [...mock.mockScheduledReports]; },
  async getReportingConfig() { await delay(); return { ...mock.mockReportingConfig }; },

  // General
  async getGeneralConfig() { await delay(); return { ...mock.mockGeneralConfig }; },
  async getFeatureFlags() { await delay(); return [...mock.mockFeatureFlags]; },

  // Generic save — swap with real API calls later
  async save(section, data) {
    await delay(600);
    console.log(`[SettingsService] Saved "${section}":`, data);
    return { success: true };
  },
};
