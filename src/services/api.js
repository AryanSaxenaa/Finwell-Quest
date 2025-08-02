// API service for handling authentication
export const authAPI = {
  login: async (email, password) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: { email, name: 'User', id: '1' },
          token: 'fake-jwt-token'
        });
      }, 1000);
    });
  },

  register: async (userData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: userData,
          token: 'fake-jwt-token'
        });
      }, 1000);
    });
  },

  verifyTwoFactor: async (code) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: code === '123456',
          message: code === '123456' ? 'Verified' : 'Invalid code'
        });
      }, 500);
    });
  }
};

// API service for AI chat
export const chatAPI = {
  sendMessage: async (message, context, mode = 'advisor') => {
    // Simulate AI API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = {
          advisor: [
            "Based on your spending patterns, I recommend creating a more detailed budget.",
            "Consider allocating 20% of your income to savings and investments.",
            "Your entertainment spending seems high this month. Let's optimize that."
          ],
          hype: [
            "You're CRUSHING IT! Keep that financial momentum going! 🔥",
            "Level up that saving game! You've got this! 💪",
            "Your progress is AMAZING! Time to reach for the stars! ⭐"
          ],
          roast: [
            "Really? Another coffee purchase? Your wallet is crying! ☕💸",
            "At this rate, you'll be eating ramen until retirement! 🍜",
            "I've seen better financial decisions from a toddler! 👶💰"
          ]
        };
        
        const modeResponses = responses[mode] || responses.advisor;
        const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];
        
        resolve({
          success: true,
          response: randomResponse,
          timestamp: new Date().toISOString()
        });
      }, 800);
    });
  }
};

// API service for leaderboard
export const leaderboardAPI = {
  getGlobalLeaderboard: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          leaderboard: [
            { id: 1, username: 'FinanceWiz', score: 2450, rank: 1 },
            { id: 2, username: 'MoneyMaster', score: 2380, rank: 2 },
            { id: 3, username: 'BudgetBoss', score: 2290, rank: 3 },
            { id: 4, username: 'SavingsGuru', score: 2150, rank: 4 },
            { id: 5, username: 'InvestorPro', score: 2050, rank: 5 },
          ]
        });
      }, 1000);
    });
  },

  submitScore: async (score) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          newRank: Math.floor(Math.random() * 100) + 1
        });
      }, 500);
    });
  }
};
