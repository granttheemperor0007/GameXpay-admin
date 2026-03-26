/**
 * Transactions Service
 * Currently uses mock data. Replace implementations with real API calls
 * (e.g., axios.get('/api/transactions')) when the backend is ready.
 */

import type { Transaction } from '../types';
import { mockTransactions } from '../mock/mockTransactions';

let transactionsStore: Transaction[] = [...mockTransactions];

const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface TransactionFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  amountMin?: string | number
  amountMax?: string | number
  search?: string
}

export const transactionsService = {
  async getAll(filters: TransactionFilters = {}): Promise<Transaction[]> {
    await delay();
    let results = [...transactionsStore];

    if (filters.status) {
      results = results.filter((t) => t.status === filters.status);
    }
    if (filters.dateFrom) {
      results = results.filter((t) => new Date(t.createdAt) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
      results = results.filter((t) => new Date(t.createdAt) <= new Date(filters.dateTo!));
    }
    if (filters.amountMin !== '' && filters.amountMin != null) {
      results = results.filter((t) => t.amount >= Number(filters.amountMin));
    }
    if (filters.amountMax !== '' && filters.amountMax != null) {
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

  async getById(id: string): Promise<Transaction> {
    await delay();
    const txn = transactionsStore.find((t) => t.id === id);
    if (!txn) throw new Error(`Transaction with id "${id}" not found`);
    return { ...txn };
  },
};
