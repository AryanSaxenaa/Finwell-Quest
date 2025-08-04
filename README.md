
# FinWell Quest

FinWell Quest is a modern, gamified personal finance management app built with React Native and Expo. The application is designed to empower users to take control of their finances through interactive tools, AI-powered assistance, and engaging educational content. The project leverages a Neo-Brutalism design system for a bold, accessible, and visually distinct user experience.

## Key Features

### 1. Gamified Financial Learning
- **Daily Challenges & Quizzes:** Users can participate in daily financial challenges and quizzes to test and improve their financial literacy.
- **XP & Leveling System:** Earn experience points (XP) and level up by completing tasks, answering questions, and engaging with the app.
- **Leaderboards:** Compete with friends and the community for top spots on the leaderboard.

### 2. AI-Powered Financial Assistant
- **Conversational AI Chat:** Integrated with Google Gemini API, the AI assistant provides personalized financial advice, budgeting tips, and answers to user queries in real time.
- **Contextual Guidance:** The AI adapts its responses based on user activity and app context, ensuring relevant and actionable insights.

### 3. Budget & Expense Management
- **Budget Creation & Tracking:** Users can set, edit, and monitor budgets for various spending categories.
- **Expense Logging:** Add, edit, and view expense history with intuitive UI components.
- **Visual Insights:** D3.js-powered charts and visualizations help users understand their spending patterns and progress.

### 4. Secure Bank Integration
- **Plaid Sandbox Integration:** Securely connect bank accounts using Plaid's sandbox environment for demo and development purposes.
- **Automated Transaction Import:** Fetch and categorize transactions directly from linked accounts.

### 5. Modern UI/UX
- **Neo-Brutalism Theme:** Consistent, bold, and accessible design language across all screens and components.
- **Custom Components:** Reusable UI elements such as BrutalCard, BrutalButton, and BrutalHeader for a cohesive look and feel.
- **Responsive Navigation:** Multi-stack navigation for seamless transitions between authentication, main features, and learning modules.

### 6. Onboarding & User Education
- **Onboarding Flow:** Engaging onboarding screens introduce users to the app's features and benefits.
- **Learning Hub:** Access to curated educational content and resources to improve financial literacy.

## Technical Approach

- **React Native & Expo:** Enables cross-platform mobile development with rapid iteration and native performance.
- **State Management:** Utilizes Zustand for lightweight, scalable state management.
- **API Integration:** Modular service layer for Plaid, AI, and other external APIs, ensuring maintainability and security.
- **Environment Variables:** Sensitive keys and configuration are managed via `.env` files and are never exposed in the frontend codebase.
- **Component-Driven Architecture:** All UI elements are built as reusable, theme-aware components for consistency and scalability.
- **Testing & Linting:** Codebase is structured for maintainability and extensibility, with best practices for error handling and user feedback.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Finwell-Quest
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and add your API keys as needed.
4. **Run the app:**
   ```bash
   npx expo start
   ```

## Folder Structure

- `src/components/` — Reusable UI components
- `src/screens/` — App screens (auth, main, learning, etc.)
- `src/services/` — API and integration logic
- `src/store/` — State management (Zustand)
- `src/styles/` — Theme and style definitions
- `src/utils/` — Utility functions and helpers

## Acknowledgements

- Plaid (sandbox) for secure bank integration
- Google Gemini API for AI-powered chat
- UI Kitten for foundational UI components
- D3.js for data visualization

---

For questions or contributions, please refer to the repository guidelines or contact the maintainers.
