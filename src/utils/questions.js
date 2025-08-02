// Financial literacy questions database
export const QUESTION_CATEGORIES = {
  BUDGETING: 'budgeting',
  SAVING: 'saving',
  INVESTING: 'investing',
  DEBT: 'debt',
  INSURANCE: 'insurance',
  CREDIT: 'credit'
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const QUESTIONS_DATABASE = [
  // Budgeting Questions
  {
    id: 1,
    category: QUESTION_CATEGORIES.BUDGETING,
    difficulty: DIFFICULTY_LEVELS.EASY,
    question: "What is the recommended percentage of income to allocate for housing expenses?",
    options: ["10-15%", "20-25%", "30-35%", "40-45%"],
    correctAnswer: 2,
    explanation: "Financial experts recommend spending no more than 30-35% of your gross income on housing expenses including rent/mortgage, utilities, and maintenance.",
    points: 10
  },
  {
    id: 2,
    category: QUESTION_CATEGORIES.BUDGETING,
    difficulty: DIFFICULTY_LEVELS.EASY,
    question: "Which of these is considered a 'want' rather than a 'need'?",
    options: ["Rent payment", "Groceries", "Streaming services", "Transportation to work"],
    correctAnswer: 2,
    explanation: "Streaming services are entertainment and considered a 'want'. Rent, groceries, and work transportation are necessities.",
    points: 10
  },
  {
    id: 3,
    category: QUESTION_CATEGORIES.SAVING,
    difficulty: DIFFICULTY_LEVELS.EASY,
    question: "What is the recommended emergency fund size?",
    options: ["1-2 months of expenses", "3-6 months of expenses", "1 year of expenses", "2 years of expenses"],
    correctAnswer: 1,
    explanation: "Most financial experts recommend saving 3-6 months worth of living expenses for emergencies.",
    points: 10
  },
  {
    id: 4,
    category: QUESTION_CATEGORIES.SAVING,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    question: "What is compound interest?",
    options: [
      "Interest only on the principal amount",
      "Interest on both principal and accumulated interest",
      "Interest paid monthly",
      "Interest without fees"
    ],
    correctAnswer: 1,
    explanation: "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods.",
    points: 15
  },
  {
    id: 5,
    category: QUESTION_CATEGORIES.INVESTING,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    question: "What does diversification in investing mean?",
    options: [
      "Investing in only one stock",
      "Spreading investments across different assets",
      "Investing only in bonds",
      "Keeping all money in savings"
    ],
    correctAnswer: 1,
    explanation: "Diversification means spreading your investments across different types of assets to reduce risk.",
    points: 15
  },
  {
    id: 6,
    category: QUESTION_CATEGORIES.DEBT,
    difficulty: DIFFICULTY_LEVELS.EASY,
    question: "Which debt repayment strategy focuses on paying off the smallest balance first?",
    options: ["Avalanche method", "Snowball method", "Minimum payment method", "Interest-only method"],
    correctAnswer: 1,
    explanation: "The snowball method focuses on paying off debts with the smallest balances first to build momentum.",
    points: 10
  },
  {
    id: 7,
    category: QUESTION_CATEGORIES.CREDIT,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    question: "What is a good credit utilization ratio?",
    options: ["Below 10%", "Below 30%", "Below 50%", "Below 70%"],
    correctAnswer: 1,
    explanation: "Credit experts recommend keeping your credit utilization below 30% of your available credit limit.",
    points: 15
  },
  {
    id: 8,
    category: QUESTION_CATEGORIES.INVESTING,
    difficulty: DIFFICULTY_LEVELS.HARD,
    question: "What is the rule of 72?",
    options: [
      "A retirement planning rule",
      "A rule to estimate how long it takes money to double",
      "A tax calculation method",
      "A credit score formula"
    ],
    correctAnswer: 1,
    explanation: "The rule of 72 helps estimate how long it will take for money to double at a given interest rate (72 ÷ interest rate = years to double).",
    points: 20
  },
  {
    id: 9,
    category: QUESTION_CATEGORIES.INSURANCE,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    question: "What is a deductible in insurance?",
    options: [
      "The monthly premium",
      "The amount you pay before insurance covers costs",
      "The maximum coverage amount",
      "The insurance company's profit"
    ],
    correctAnswer: 1,
    explanation: "A deductible is the amount you must pay out-of-pocket before your insurance coverage kicks in.",
    points: 15
  },
  {
    id: 10,
    category: QUESTION_CATEGORIES.BUDGETING,
    difficulty: DIFFICULTY_LEVELS.HARD,
    question: "What is the 50/30/20 budgeting rule?",
    options: [
      "50% savings, 30% needs, 20% wants",
      "50% needs, 30% wants, 20% savings",
      "50% wants, 30% savings, 20% needs",
      "50% investing, 30% spending, 20% emergency fund"
    ],
    correctAnswer: 1,
    explanation: "The 50/30/20 rule suggests allocating 50% to needs, 30% to wants, and 20% to savings and debt repayment.",
    points: 20
  }
];

// Function to get random question by category and difficulty
export const getRandomQuestion = (category = null, difficulty = null) => {
  let filteredQuestions = QUESTIONS_DATABASE;
  
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  if (filteredQuestions.length === 0) {
    return QUESTIONS_DATABASE[Math.floor(Math.random() * QUESTIONS_DATABASE.length)];
  }
  
  return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
};

// Function to get questions for a quiz
export const getQuizQuestions = (count = 5, category = null, difficulty = null) => {
  const questions = [];
  const usedIds = new Set();
  
  while (questions.length < count && usedIds.size < QUESTIONS_DATABASE.length) {
    const question = getRandomQuestion(category, difficulty);
    if (!usedIds.has(question.id)) {
      questions.push(question);
      usedIds.add(question.id);
    }
  }
  
  return questions;
};

// Daily challenge questions (harder difficulty for bonus XP)
export const getDailyChallengeQuestions = () => {
  return getQuizQuestions(5, null, DIFFICULTY_LEVELS.HARD);
};
