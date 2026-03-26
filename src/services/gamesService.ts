/**
 * Games Service
 * Currently uses mock data. Replace implementations with real API calls
 * (e.g., axios.get('/api/games')) when the backend is ready.
 */

import type { Game } from '../types';
import { mockGames } from '../mock/mockGames';

// In-memory store to simulate persistence during the session
let gamesStore: Game[] = [...mockGames];

const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const gamesService = {
  async getAll(): Promise<Game[]> {
    await delay();
    return [...gamesStore];
  },

  async getById(id: string): Promise<Game> {
    await delay();
    const game = gamesStore.find((g) => g.id === id);
    if (!game) throw new Error(`Game with id "${id}" not found`);
    return { ...game };
  },

  async create(gameData: Omit<Game, 'id' | 'createdAt'>): Promise<Game> {
    await delay();
    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    gamesStore = [newGame, ...gamesStore];
    return { ...newGame };
  },

  async update(id: string, gameData: Partial<Game>): Promise<Game> {
    await delay();
    const index = gamesStore.findIndex((g) => g.id === id);
    if (index === -1) throw new Error(`Game with id "${id}" not found`);
    gamesStore[index] = { ...gamesStore[index], ...gameData };
    return { ...gamesStore[index] };
  },

  async toggleStatus(id: string): Promise<Game> {
    await delay();
    const index = gamesStore.findIndex((g) => g.id === id);
    if (index === -1) throw new Error(`Game with id "${id}" not found`);
    const newStatus = gamesStore[index].status === 'active' ? 'inactive' : 'active';
    gamesStore[index] = { ...gamesStore[index], status: newStatus };
    return { ...gamesStore[index] };
  },

  async delete(id: string): Promise<{ success: boolean }> {
    await delay();
    gamesStore = gamesStore.filter((g) => g.id !== id);
    return { success: true };
  },
};
