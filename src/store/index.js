import { create } from 'zustand';

// Auth store
export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

// Game store
export const useGameStore = create((set, get) => ({
  score: 0,
  level: 1,
  xp: 0,
  lives: 3,
  position: 0,
  currentQuestion: null,
  gameStats: {
    totalGamesPlayed: 0,
    totalScore: 0,
    bestScore: 0,
  },
  
  updateScore: (points) => set((state) => ({ 
    score: state.score + points,
    xp: state.xp + points 
  })),
  
  loseLife: () => set((state) => ({ lives: Math.max(0, state.lives - 1) })),
  
  resetGame: () => set({ 
    score: 0, 
    lives: 3, 
    position: 0, 
    currentQuestion: null 
  }),
  
  movePlayer: (steps) => set((state) => ({ 
    position: (state.position + steps) % 25 
  })),
  
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  
  updateGameStats: () => set((state) => ({
    gameStats: {
      ...state.gameStats,
      totalGamesPlayed: state.gameStats.totalGamesPlayed + 1,
      totalScore: state.gameStats.totalScore + state.score,
      bestScore: Math.max(state.gameStats.bestScore, state.score),
    }
  })),
}));

// Expense store
export const useExpenseStore = create((set) => ({
  expenses: [],
  totalSpent: 0,
  categories: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'],
  
  addExpense: (expense) => set((state) => {
    const newExpenses = [...state.expenses, expense];
    const newTotal = newExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { 
      expenses: newExpenses, 
      totalSpent: newTotal 
    };
  }),
  
  removeExpense: (id) => set((state) => {
    const newExpenses = state.expenses.filter(exp => exp.id !== id);
    const newTotal = newExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { 
      expenses: newExpenses, 
      totalSpent: newTotal 
    };
  }),
  
  getExpensesByCategory: () => {
    const { expenses, categories } = useExpenseStore.getState();
    return categories.map(category => ({
      category,
      total: expenses
        .filter(exp => exp.category === category)
        .reduce((sum, exp) => sum + exp.amount, 0)
    }));
  },
}));

// AI Chat store
export const useChatStore = create((set) => ({
  chatHistory: [],
  aiMode: 'advisor', // 'advisor', 'hype', 'roast'
  
  addMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message]
  })),
  
  setAIMode: (mode) => set({ aiMode: mode }),
  
  clearChat: () => set({ chatHistory: [] }),
}));
