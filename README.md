# FinPath Quest - Financial Literacy Application

A React Native mobile application that combines expense tracking, gamified learning, and AI-powered financial advice to make financial literacy engaging and accessible.

## Features

### Core Functionality
- **Expense Tracking**: Monitor spending habits with intuitive category breakdowns and visual charts
- **Gamified Learning**: Interactive dice-based board games with financial literacy questions
- **AI Financial Assistant**: Personalized advice with three distinct personality modes
- **Social Learning**: Global leaderboards and progress tracking

### Game Mechanics
- **5×5 Grid Board**: Navigate through numbered tiles using dice rolls
- **Question System**: Answer financial literacy questions to earn points and XP
- **Lives & Scoring**: Strategic gameplay with life management and level progression
- **Daily Challenges**: Special tasks for bonus XP and rewards

### AI Assistant Modes
- **Advisor**: Professional, helpful financial guidance
- **Hype**: Motivational and energetic coaching
- **Roast**: Constructive criticism with humor

## Tech Stack

- **Framework**: React Native with Expo
- **UI Library**: UI Kitten (Eva Design System)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Zustand
- **Database**: Expo SQLite
- **Icons**: Expo Vector Icons

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (or Expo Go app on physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AryanSaxenaa/Finwell-Quest.git
   cd Finwell-Quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platform**
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web Browser
   npm run web
   ```

### Development Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── AddExpenseModal.js
├── navigation/          # Navigation configuration
│   ├── AppNavigator.js
│   ├── MainTabNavigator.js
│   ├── HomeStackNavigator.js
│   ├── GameStackNavigator.js
│   ├── LearnStackNavigator.js
│   └── SocialStackNavigator.js
├── screens/
│   ├── auth/           # Authentication screens
│   │   ├── SplashScreen.js
│   │   ├── OnboardingScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── TwoFactorScreen.js
│   └── main/           # Main app screens
│       ├── HomeDashboard.js
│       ├── ExpenseHistory.js
│       ├── GameHome.js
│       ├── GameBoard.js
│       ├── QuestionScreen.js
│       ├── GameResults.js
│       ├── LearningHub.js
│       ├── AIChat.js
│       ├── QuizDetail.js
│       ├── Leaderboard.js
│       └── Profile.js
├── store/              # Zustand state management
│   └── index.js
├── services/           # External services
│   └── api.js
└── utils/              # Utility functions
    ├── helpers.js
    └── questions.js
```

## Application Flow

### Authentication Flow
1. **Splash Screen** - Check authentication status
2. **Onboarding** - Introduce app features (3 slides)
3. **Login/Register** - User authentication
4. **Two-Factor** - Additional security verification
5. **Main App** - Access to full functionality

### Main Application Tabs
1. **Home Dashboard**
   - Expense overview with visual charts
   - Quick actions (Add Expense, Start Game, Chat AI)
   - Daily AI tips and progress statistics

2. **Game Center**
   - Dice-based board game
   - Financial literacy questions
   - XP and level progression
   - Daily challenges

3. **Learn & AI**
   - Educational content and quizzes
   - AI chat with multiple personalities
   - Learning progress tracking

4. **Social & Profile**
   - Global leaderboard
   - User profile and settings
   - Achievement tracking

## State Management

The application uses Zustand for lightweight state management with four main stores:

- **`useAuthStore`**: User authentication and profile data
- **`useGameStore`**: Game mechanics, scoring, and progress
- **`useExpenseStore`**: Expense tracking and categorization
- **`useChatStore`**: AI chat history and personality modes

## API Integration

The application includes mock API services for:
- User authentication
- AI chat responses
- Leaderboard data
- User progress tracking

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

## Build and Deployment

### Development Build
```bash
# Start development server
npx expo start

# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios
```

### Production Build
```bash
# Create production build
npx expo export

# Submit to app stores
npx expo submit
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## Roadmap

### Planned Features
- Real-time multiplayer game modes
- Advanced AI chat integration
- Bank API integration for expense import
- Enhanced social features
- Offline mode with data synchronization
- Push notifications
- Advanced analytics and insights
- Customizable themes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For technical support or questions, please:
- Open an issue on GitHub
- Contact the development team
- Review the documentation

## Acknowledgments

- UI Kitten team for the comprehensive component library
- Eva Design System for design consistency
- Expo team for streamlined React Native development
- Open source community for various dependencies

---

**Built for financial literacy education and empowerment**
