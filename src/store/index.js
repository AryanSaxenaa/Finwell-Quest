import { create } from 'zustand';
import PlaidService from '../services/plaidService';

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
  aiTokens: 3, // Start with 3 free tokens
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
    position: (state.position + steps) % 36 
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
  
  // AI Token Management
  useAIToken: () => set((state) => ({
    aiTokens: Math.max(0, state.aiTokens - 1)
  })),
  
  earnAITokens: (amount) => set((state) => ({
    aiTokens: state.aiTokens + amount
  })),
  
  hasAITokens: () => {
    const state = get();
    return state.aiTokens > 0;
  },
  
  getAITokens: () => {
    const state = get();
    return state.aiTokens;
  },
}));

// Expense store
export const useExpenseStore = create((set, get) => ({
  expenses: [],
  totalSpent: 0,
  categories: ['Housing', 'Transport', 'Food', 'Entertainment', 'Shopping', 'Bills', 'Other'],
  
  // Plaid integration
  plaidAccounts: [],
  plaidTransactions: [],
  accessTokens: [], // Store access tokens for connected accounts
  isPlaidConnected: false,
  lastSyncDate: null,
  
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

  // Load mock data for demo/testing
  loadMockData: () => {
    console.log('🎭 Loading mock expense data for demo');
    
    const mockExpenses = [
      {
        id: 'mock-exp-001',
        amount: 25.50,
        category: 'Food',
        description: 'Starbucks Coffee',
        date: '2025-08-03',
        merchant: 'Starbucks',
      },
      {
        id: 'mock-exp-002',
        amount: 89.99,
        category: 'Shopping',
        description: 'Amazon Purchase',
        date: '2025-08-02',
        merchant: 'Amazon',
      },
      {
        id: 'mock-exp-003',
        amount: 15.75,
        category: 'Food',
        description: 'McDonald\'s',
        date: '2025-08-02',
        merchant: 'McDonald\'s',
      },
      {
        id: 'mock-exp-004',
        amount: 450.00,
        category: 'Housing',
        description: 'Monthly Rent Payment',
        date: '2025-08-01',
        merchant: 'Property Management Co',
      },
      {
        id: 'mock-exp-005',
        amount: 67.89,
        category: 'Food',
        description: 'Grocery Store',
        date: '2025-07-31',
        merchant: 'Whole Foods',
      },
      {
        id: 'mock-exp-006',
        amount: 125.00,
        category: 'Bills',
        description: 'Electric Bill',
        date: '2025-07-29',
        merchant: 'Electric Company',
      },
      {
        id: 'mock-exp-007',
        amount: 35.99,
        category: 'Entertainment',
        description: 'Netflix Subscription',
        date: '2025-07-28',
        merchant: 'Netflix',
      },
    ];

    const totalMockSpent = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    set({
      expenses: mockExpenses,
      totalSpent: totalMockSpent,
      isPlaidConnected: true,
      plaidAccounts: [
        {
          account_id: 'demo-checking-001',
          name: 'Demo Checking Account',
          mask: '0000',
          balances: {
            available: 2450.75,
            current: 2450.75,
          },
          subtype: 'checking',
          type: 'depository',
        },
      ],
      lastSyncDate: new Date().toISOString(),
    });

    // Update budget spending
    const { updateBudgetSpending } = useBudgetStore.getState();
    mockExpenses.forEach(expense => {
      updateBudgetSpending(expense.category, expense.amount);
    });

    console.log('✅ Mock data loaded successfully');
    return { success: true, expenseCount: mockExpenses.length };
  },

  // Plaid Methods
  connectPlaidAccount: async (publicToken) => {
    console.log('🏦 connectPlaidAccount called with publicToken:', publicToken);
    try {
      // Exchange public token for access token
      console.log('📤 Calling PlaidService.exchangePublicToken...');
      const tokenResponse = await PlaidService.exchangePublicToken(publicToken);
      console.log('📥 Token exchange response:', tokenResponse);
      const accessToken = tokenResponse.access_token;
      
      // Get account information
      console.log('📤 Calling PlaidService.getAccounts...');
      const accountsResponse = await PlaidService.getAccounts(accessToken);
      console.log('📥 Accounts response:', accountsResponse);
      
      set((state) => ({
        accessTokens: [...state.accessTokens, accessToken],
        plaidAccounts: [...state.plaidAccounts, ...accountsResponse.accounts],
        isPlaidConnected: true,
      }));

      // Sync transactions for the new account
      console.log('🔄 Starting transaction sync...');
      await get().syncTransactions();
      console.log('✅ Transaction sync completed');
      
      return { success: true, accounts: accountsResponse.accounts };
    } catch (error) {
      console.error('❌ Failed to connect Plaid account:', error);
      return { success: false, error: error.message };
    }
  },

  syncTransactions: async () => {
    try {
      const { accessTokens } = get();
      if (accessTokens.length === 0) {
        console.log('⚠️ No access tokens available for transaction sync');
        return;
      }

      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Last 30 days

      let allTransactions = [];

      for (const accessToken of accessTokens) {
        try {
          console.log('📤 Syncing transactions for access token:', accessToken.substring(0, 20) + '...');
          const transactionsResponse = await PlaidService.getTransactions(
            accessToken,
            startDate,
            endDate,
            100
          );
          
          const formattedTransactions = transactionsResponse.transactions.map(
            transaction => PlaidService.formatTransaction(transaction)
          );
          
          allTransactions = [...allTransactions, ...formattedTransactions];
          console.log(`✅ Successfully synced ${formattedTransactions.length} transactions`);
        } catch (error) {
          console.error('❌ Failed to sync transactions for access token:', error);
          // Continue with other tokens if one fails
          continue;
        }
      }

      if (allTransactions.length === 0) {
        console.log('⚠️ No transactions retrieved from Plaid API');
        return;
      }

      // Filter out income transactions and merge with existing expenses
      const expenseTransactions = allTransactions.filter(t => !t.isIncome);
      
      console.log('📊 Processing transactions for categorization:');
      expenseTransactions.forEach((tx, index) => {
        console.log(`  ${index + 1}. ${tx.description} -> Category: "${tx.category}" (Amount: $${tx.amount})`);
      });
      
      console.log('📊 Store categories available:', get().categories);
      
      set((state) => ({
        plaidTransactions: allTransactions,
        expenses: [...expenseTransactions], // Replace manual expenses with Plaid data
        totalSpent: expenseTransactions.reduce((sum, exp) => sum + exp.amount, 0),
        lastSyncDate: new Date().toISOString(),
      }));

      // Update budget spending with new data
      const { updateBudgetSpending } = useBudgetStore.getState();
      expenseTransactions.forEach(expense => {
        updateBudgetSpending(expense.category, expense.amount);
      });

      return { success: true, transactionCount: allTransactions.length };
    } catch (error) {
      console.error('Failed to sync transactions:', error);
      return { success: false, error: error.message };
    }
  },

  getSpendingInsights: () => {
    const { plaidTransactions } = get();
    if (plaidTransactions.length === 0) return null;

    const last7Days = plaidTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return transactionDate >= sevenDaysAgo && !t.isIncome;
    });

    const last30Days = plaidTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return transactionDate >= thirtyDaysAgo && !t.isIncome;
    });

    const categorySpending = {};
    last30Days.forEach(transaction => {
      categorySpending[transaction.category] = (categorySpending[transaction.category] || 0) + transaction.amount;
    });

    const topCategory = Object.keys(categorySpending).reduce((a, b) => 
      categorySpending[a] > categorySpending[b] ? a : b
    );

    return {
      weeklySpent: last7Days.reduce((sum, t) => sum + t.amount, 0),
      monthlySpent: last30Days.reduce((sum, t) => sum + t.amount, 0),
      topSpendingCategory: topCategory,
      topSpendingAmount: categorySpending[topCategory],
      categoryBreakdown: categorySpending,
      averageDailySpending: last30Days.reduce((sum, t) => sum + t.amount, 0) / 30,
      recentTransactions: last7Days.slice(0, 5), // Last 5 transactions
    };
  },

  disconnectPlaid: () => set({
    plaidAccounts: [],
    plaidTransactions: [],
    accessTokens: [],
    isPlaidConnected: false,
    lastSyncDate: null,
  }),
}));

// Budget store
export const useBudgetStore = create((set, get) => ({
  budgets: [
    { 
      id: 1, 
      category: 'Housing', 
      limit: 1000, 
      spent: 0, // Template budget - no initial spending
      color: '#8B4513' 
    },
    { 
      id: 2, 
      category: 'Transport', 
      limit: 200, 
      spent: 0, // Template budget - no initial spending
      color: '#36A2EB' 
    },
    { 
      id: 3, 
      category: 'Food', 
      limit: 400, 
      spent: 0, // Template budget - no initial spending
      color: '#FF9F40' 
    },
    { 
      id: 4, 
      category: 'Entertainment', 
      limit: 150, 
      spent: 0, // Template budget - no initial spending
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
