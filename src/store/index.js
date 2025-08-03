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
  lastLevelUp: false,
  gameStats: {
    totalGamesPlayed: 0,
    totalScore: 0,
    bestScore: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    categoryStats: {
      budgeting: { answered: 0, correct: 0 },
      saving: { answered: 0, correct: 0 },
      investing: { answered: 0, correct: 0 },
      debt: { answered: 0, correct: 0 },
      insurance: { answered: 0, correct: 0 },
      credit: { answered: 0, correct: 0 },
    },
    streaks: {
      currentStreak: 0,
      longestStreak: 0,
  },
  badges: [],
  },
  
  // Daily Challenge
  dailyChallenge: {
    date: null,
    question: null,
    completed: false,
    wasCorrect: false,
    xpEarned: 0,
  },  // Level progression: Every 100 XP = 1 level
  calculateLevel: (xp) => Math.floor(xp / 100) + 1,
  getXPForNextLevel: (currentXP) => (Math.floor(currentXP / 100) + 1) * 100,
  getXPProgress: (currentXP) => currentXP % 100,
  
  updateScore: (points, category = null, isCorrect = true) => set((state) => {
    const newXP = state.xp + points;
    const newLevel = Math.floor(newXP / 100) + 1;
    const leveledUp = newLevel > state.level;
    
    // Update category stats
    const newCategoryStats = { ...state.gameStats.categoryStats };
    if (category && newCategoryStats[category]) {
      newCategoryStats[category].answered += 1;
      if (isCorrect) {
        newCategoryStats[category].correct += 1;
      }
    }
    
    // Update streaks
    const newStreaks = { ...state.gameStats.streaks };
    if (isCorrect) {
      newStreaks.currentStreak += 1;
      newStreaks.longestStreak = Math.max(newStreaks.longestStreak, newStreaks.currentStreak);
    } else {
      newStreaks.currentStreak = 0;
    }
    
    return {
      score: state.score + points,
      xp: newXP,
      level: newLevel,
      lastLevelUp: leveledUp,
      gameStats: {
        ...state.gameStats,
        totalQuestionsAnswered: state.gameStats.totalQuestionsAnswered + 1,
        totalCorrectAnswers: state.gameStats.totalCorrectAnswers + (isCorrect ? 1 : 0),
        categoryStats: newCategoryStats,
        streaks: newStreaks,
      }
    };
  }),
  
  loseLife: () => set((state) => ({ lives: Math.max(0, state.lives - 1) })),
  
  clearLevelUp: () => set({ lastLevelUp: false }),
  
  levelUp: () => set((state) => ({ lastLevelUp: true })),
  
  checkLevelUp: () => {
    const state = get();
    const newLevel = Math.floor(state.xp / 100) + 1;
    return newLevel > state.level;
  },
  
  resetGame: () => set({ 
    score: 0, 
    lives: 3, 
    position: 0, 
    currentQuestion: null,
    lastLevelUp: false,
    // Don't reset XP and level - keep player progression
    // Only reset the current game state
  }),
  
  // Add a complete reset function for new players
  resetAllProgress: () => set({
    score: 0,
    level: 1,
    xp: 0,
    lives: 3,
    position: 0,
    currentQuestion: null,
    lastLevelUp: false,
    gameStats: {
      totalGamesPlayed: 0,
      totalScore: 0,
      bestScore: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      categoryStats: {
        budgeting: { answered: 0, correct: 0 },
        saving: { answered: 0, correct: 0 },
        investing: { answered: 0, correct: 0 },
        debt: { answered: 0, correct: 0 },
        insurance: { answered: 0, correct: 0 },
        credit: { answered: 0, correct: 0 },
      },
      streaks: {
        currentStreak: 0,
        longestStreak: 0,
      },
    },
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
  
  // Daily Challenge methods
  generateDailyChallenge: (question, date) => set({
    dailyChallenge: {
      date,
      question,
      completed: false,
      wasCorrect: false,
      xpEarned: 0,
    }
  }),
  
  completeDailyChallenge: (wasCorrect, xpEarned) => set((state) => ({
    dailyChallenge: {
      ...state.dailyChallenge,
      completed: true,
      wasCorrect,
      xpEarned,
    }
  })),
  
  checkDailyChallengeReset: () => {
    const today = new Date().toDateString();
    const state = get();
    
    if (state.dailyChallenge.date !== today) {
      set({
        dailyChallenge: {
          date: null,
          question: null,
          completed: false,
          wasCorrect: false,
          xpEarned: 0,
        }
      });
    }
  },
  
  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    const leveledUp = newLevel > state.level;
    
    return {
      xp: newXP,
      level: newLevel,
      lastLevelUp: leveledUp,
    };
  }),
}));

// Expense store
export const useExpenseStore = create((set) => ({
  expenses: [],
  totalSpent: 0,
  categories: ['Housing', 'Transport', 'Food', 'Entertainment', 'Shopping', 'Bills', 'Other'],
  
  addExpense: (expense) => set((state) => {
    const newExpenses = [...state.expenses, expense];
    const newTotal = newExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Update budget spending
    const { updateBudgetSpending } = useBudgetStore.getState();
    updateBudgetSpending(expense.category, expense.amount);
    
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

// Budget store
export const useBudgetStore = create((set, get) => ({
  budgets: [
    { 
      id: 1, 
      category: 'Housing', 
      limit: 1000, 
      spent: 800, 
      color: '#8B4513' 
    },
    { 
      id: 2, 
      category: 'Transport', 
      limit: 200, 
      spent: 45, 
      color: '#36A2EB' 
    },
    { 
      id: 3, 
      category: 'Food', 
      limit: 400, 
      spent: 195, 
      color: '#FF9F40' 
    },
    { 
      id: 4, 
      category: 'Entertainment', 
      limit: 150, 
      spent: 80, 
      color: '#9966FF' 
    },
  ],

  getBudgetByCategory: (category) => {
    const { budgets } = get();
    return budgets.find(budget => budget.category === category);
  },

  updateBudgetSpent: (category, amount) => set((state) => ({
    budgets: state.budgets.map(budget => 
      budget.category === category 
        ? { ...budget, spent: budget.spent + amount }
        : budget
    )
  })),

  setBudgetLimit: (category, limit) => set((state) => ({
    budgets: state.budgets.map(budget => 
      budget.category === category 
        ? { ...budget, limit }
        : budget
    )
  })),

  updateBudgetSpending: (category, amount) => set((state) => ({
    budgets: state.budgets.map(budget => 
      budget.category === category 
        ? { ...budget, spent: budget.spent + amount }
        : budget
    )
  })),

  resetMonthlyBudgets: () => set((state) => ({
    budgets: state.budgets.map(budget => ({ ...budget, spent: 0 }))
  })),

  addBudget: (budget) => set((state) => ({
    budgets: [...state.budgets, { ...budget, id: Date.now() }]
  })),

  removeBudget: (id) => set((state) => ({
    budgets: state.budgets.filter(budget => budget.id !== id)
  })),

  getBudgetSummary: () => {
    const { budgets } = get();
    return budgets.map(budget => ({
      ...budget,
      remaining: budget.limit - budget.spent,
      percentage: Math.round((budget.spent / budget.limit) * 100),
      isOverBudget: budget.spent > budget.limit
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
