// Date utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const getMonthName = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'long' });
};

// Game utilities
export const calculateLevel = (xp) => {
  return Math.floor(xp / 100) + 1;
};

export const getXPForNextLevel = (currentXP) => {
  const currentLevel = calculateLevel(currentXP);
  return currentLevel * 100;
};

export const getXPProgress = (currentXP) => {
  const currentLevel = calculateLevel(currentXP);
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const progressXP = currentXP - xpForCurrentLevel;
  const totalXPNeeded = xpForNextLevel - xpForCurrentLevel;
  
  return {
    progress: progressXP,
    total: totalXPNeeded,
    percentage: (progressXP / totalXPNeeded) * 100
  };
};

// Expense utilities
export const groupExpensesByCategory = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = {
        category,
        total: 0,
        count: 0,
        expenses: []
      };
    }
    acc[category].total += expense.amount;
    acc[category].count += 1;
    acc[category].expenses.push(expense);
    return acc;
  }, {});
};

export const groupExpensesByMonth = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const month = getMonthName(expense.date);
    if (!acc[month]) {
      acc[month] = {
        month,
        total: 0,
        count: 0,
        expenses: []
      };
    }
    acc[month].total += expense.amount;
    acc[month].count += 1;
    acc[month].expenses.push(expense);
    return acc;
  }, {});
};

export const calculateBudgetStatus = (spent, budget) => {
  const percentage = (spent / budget) * 100;
  if (percentage >= 100) return 'over';
  if (percentage >= 80) return 'warning';
  return 'good';
};

// Storage utilities (for future local storage implementation)
export const storage = {
  save: async (key, data) => {
    try {
      // In a real app, this would use AsyncStorage or SQLite
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  },

  load: async (key) => {
    try {
      // In a real app, this would use AsyncStorage or SQLite
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  },

  remove: async (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};
