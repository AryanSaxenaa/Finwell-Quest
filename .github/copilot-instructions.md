<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# FinPath Quest - React Native Application with UI Kitten

This is a React Native financial literacy application built with Expo and UI Kitten. The application combines expense tracking, gamified learning, and AI-powered financial advice.

## Tech Stack
- **React Native** with Expo
- **UI Kitten** for components and theming
- **React Navigation** for routing (Stack + Bottom Tabs)
- **Zustand** for state management
- **Expo SQLite** for local data storage
- **Expo Vector Icons** for iconography
- **Eva Design System** for consistent design

## Architecture

### Navigation Structure
- **Root Stack**: Auth Flow to Main Tab Navigator
- **Auth Screens**: Splash, Onboarding, Login, Register, Two-Factor
- **Main Tabs**: Home, Game, Learn, Social
- **Nested Stacks**: Each tab has its own stack navigator for deeper screens

### State Management (Zustand Stores)
- `useAuthStore`: Authentication state and user data
- `useGameStore`: Game mechanics, score, level, XP, lives, position
- `useExpenseStore`: Expense tracking, categories, totals
- `useChatStore`: AI chat history and personality modes

### Key Features
1. **Expense Tracking**: Add and view expenses with category breakdown and visual charts
2. **Dice Game**: 5×5 grid board with financial literacy questions
3. **AI Chat**: Three personality modes (Advisor, Hype, Roast) with contextual advice
4. **Learning Hub**: Educational content and quizzes
5. **Social Features**: Leaderboard and user profiles

## File Structure
```
src/
├── components/          # Reusable UI components
├── navigation/          # Navigation configuration
├── screens/
│   ├── auth/           # Authentication screens
│   └── main/           # Main app screens
├── services/           # API and external services
├── store/              # Zustand state management
└── utils/              # Helper functions and utilities
```

## Design Patterns
- Use UI Kitten components consistently
- Follow Eva Design System for theming
- Implement proper error handling and loading states
- Use React Navigation best practices for screen transitions
- Maintain responsive design for different screen sizes

## Game Mechanics
- 25-tile board with numbered positions
- Dice roll (1-6) for movement
- Question tiles trigger financial literacy quizzes
- Lives system (lose life for wrong answers)
- XP and scoring system with levels
- Daily challenges and achievements

## AI Integration
- Context-aware responses using expense data and game stats
- Three personality modes: Professional Advisor, Motivational Hype, Constructive Roast
- Chat history persistence
- Real-time financial advice based on spending patterns

## Development Guidelines
- Use TypeScript-style prop validation where possible
- Implement proper loading and error states
- Follow React Native performance best practices
- Use Expo managed workflow for easier development
- Maintain consistent styling with UI Kitten theme
- Test on both iOS and Android platforms

## API Expectations
- RESTful endpoints for user authentication
- Chat API for AI responses
- Leaderboard data synchronization
- User progress and achievement tracking
