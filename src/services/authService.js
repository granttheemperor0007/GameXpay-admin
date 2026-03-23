/**
 * Auth Service
 * Currently uses hardcoded credentials. Replace with real API call when backend is ready.
 */

const MOCK_USERS = [
  {
    id: 'user-001',
    email: 'superadmin@gamexpay.com',
    password: 'superadmin123',
    name: 'Grant Admin',
    avatar: '/grant-admin.jpeg',
    role: 'superadmin',
  },
  {
    id: 'user-002',
    email: 'admin@gamexpay.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
];

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    await delay();
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password.');
    }
    // Return a sanitized user object (no password)
    const { password: _pw, ...safeUser } = user;
    return safeUser;
  },

  async logout() {
    await delay(200);
    return { success: true };
  },
};
