/**
 * Orders Service
 * Currently uses mock data. Replace implementations with real API calls
 * (e.g., axios.get('/api/orders')) when the backend is ready.
 */

import { mockOrders } from '../mock/mockOrders';

let ordersStore = [...mockOrders];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const ordersService = {
  async getAll(filters = {}) {
    await delay();
    let results = [...ordersStore];

    if (filters.status) {
      results = results.filter((o) => o.status === filters.status);
    }
    if (filters.gameId) {
      results = results.filter((o) => o.game.id === filters.gameId);
    }
    if (filters.bundleId) {
      results = results.filter((o) => o.bundle.id === filters.bundleId);
    }
    if (filters.dateFrom) {
      results = results.filter((o) => new Date(o.createdAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      results = results.filter((o) => new Date(o.createdAt) <= new Date(filters.dateTo));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.playerID.toLowerCase().includes(q)
      );
    }

    return results;
  },

  async getById(id) {
    await delay();
    const order = ordersStore.find((o) => o.id === id);
    if (!order) throw new Error(`Order with id "${id}" not found`);
    return { ...order };
  },

  async updateStatus(id, status) {
    await delay();
    const index = ordersStore.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Order with id "${id}" not found`);
    ordersStore[index] = { ...ordersStore[index], status };
    return { ...ordersStore[index] };
  },

  async addNote(id, note) {
    await delay();
    const index = ordersStore.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Order with id "${id}" not found`);
    ordersStore[index] = { ...ordersStore[index], notes: note };
    return { ...ordersStore[index] };
  },
};
