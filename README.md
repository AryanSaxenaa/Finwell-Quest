
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




Screenshots
Home Page (before adding any transaction or Connecting the bank account)
<img src="https://github.com/user-attachments/assets/8d69be0d-8362-4af5-b00a-529fecbd73b9" width="400"/>
Connecting bank using Plaid API
<img src="https://github.com/user-attachments/assets/5a59bcff-5179-4d33-bfcf-f96cc1bcac1e" width="400"/>
Home Page (After adding transactions)
<img src="https://github.com/user-attachments/assets/92546708-94da-4f59-826c-28bf6bdade94" width="400"/>
Add Expense
<img src="https://github.com/user-attachments/assets/1a3e2c13-75eb-440c-b02c-2eb977524907" width="400"/>
View History
<img src="https://github.com/user-attachments/assets/55c769af-5692-4582-8011-085355c07e2d" width="400"/>
Game Center
<img src="https://github.com/user-attachments/assets/b4775418-4b32-4fdf-8cd1-c99b7f97c571" width="400"/>
Game Board
<img src="https://github.com/user-attachments/assets/cf821ff1-6539-4316-bfd6-088c84c4ced7" width="400"/>
Leaderboard
<img src="https://github.com/user-attachments/assets/9e602412-871b-45c8-ad82-342ab91a9527" width="400"/>
Learning Hub
<img src="https://github.com/user-attachments/assets/a5ee3eef-d0cb-4961-b31b-1f4821ab25ca" width="400"/>
AI Advisor
<img src="https://github.com/user-attachments/assets/a6ed6db4-8dd7-4f11-930e-3d5cfe504163" width="400"/> <img src="https://github.com/user-attachments/assets/4c58ed5b-7cab-4f95-b43a-10facf7766e5" width="400"/>



## Video

https://github.com/user-attachments/assets/f4422cd4-8d6f-498b-9870-fce390b12af8



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
