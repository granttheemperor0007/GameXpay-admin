/**
 * Transactions Service
 * Currently uses mock data. Replace implementations with real API calls
 * (e.g., axios.get('/api/transactions')) when the backend is ready.
 */

import { mockTransactions } from '../mock/mockTransactions';

let transactionsStore = [...mockTransactions];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const transactionsService = {
  async getAll(filters = {}) {
    await delay();
    let results = [...transactionsStore];

    if (filters.status) {
      results = results.filter((t) => t.status === filters.status);
    }
    if (filters.dateFrom) {
      results = results.filter((t) => new Date(t.createdAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      results = results.filter((t) => new Date(t.createdAt) <= new Date(filters.dateTo));
    }
    if (filters.amountMin !== undefined) {
      results = results.filter((t) => t.amount >= Number(filters.amountMin));
    }
    if (filters.amountMax !== undefined) {
      results = results.filter((t) => t.amount <= Number(filters.amountMax));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q) ||
          t.paystackRef.toLowerCase().includes(q) ||
          t.linkedOrderId.toLowerCase().includes(q)
      );
    }

    return results;
  },

  async getById(id) {
    await delay();
    const txn = transactionsStore.find((t) => t.id === id);
    if (!txn) throw new Error(`Transaction with id "${id}" not found`);
    return { ...txn };
  },
};
