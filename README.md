# Thing Talk

A safe, AI-powered space for mental health support and self-expression.

[Live Demo](https://athing.space/)

---

## What is Thing Talk?

**Thing Talk** is an open-source platform designed to provide a secure, anonymous environment for individuals to access mental health support through a modern AI chat assistant. It focuses on privacy, empathy, and user safety, offering a supportive space to talk about your feelings and get helpful resources.

---

## Key Features

- **AI Mental Health Chat**  
  - Empathetic, context-aware AI assistant for supportive conversations.
  - Web search integration for up-to-date resources and helplines.
  - Mood and session-based personalization via a stepper onboarding flow.
  - Safety protocols for crisis and escalation.
  - User feedback and rating system after each session.

- **Customization & Privacy**  
  - Multiple themes and backgrounds.
  - Anonymous registration with randomly generated usernames.
  - No email or personal info required.
  - Full account and data control (delete, export, etc).

- **Gamification & Progress (Future-Ready)**  
  - Mood tracking and history.
  - Goals, reminders, streaks, and badges (planned).
  - Session summaries and actionable tips (planned).

- **Resource & Activity Engine (Planned)**  
  - Smart recommendations for articles, videos, and coping activities.
  - FAQ/knowledge base integration.

---

## Architecture

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** tRPC, Prisma ORM, PostgreSQL
- **AI:** OpenAI GPT-3.5-turbo, with custom system prompt and web search (Tavily)
- **Authentication:** Custom JWT-based, anonymous, privacy-first (random username, password, hCaptcha)
- **Other:** Jotai (state), React Icons, Markdown support

---

## Database Schema Highlights

- **User, ChatSession, Message, ChatFeedback** (AI chat, feedback)
- **MoodLog, CopingActivity, UserActivityLog** (mood & activity tracking)
- **Resource, UserResourceInteraction** (resource engine)
- **Goal, Reminder, Badge, UserBadge, Streak** (gamification)
- **EscalationEvent, MessageAnalysis, SessionSummary, ReviewLog** (safety, admin, analytics)

---

## Getting Started

### Prerequisites

- Node.js (LTS)
- Yarn or npm
- PostgreSQL
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repo_link>
   cd thingtalk
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in your database and API keys.

4. **Run database migrations:**
   ```bash
   yarn run dev:migrate:postgres
   ```

5. **Start the app:**
   ```bash
   yarn run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to get started.

---

## Usage Overview

- **Start a Chat Session:**  
  Use the stepper to select your mood and session duration, then chat with the AI assistant.
- **Authentication:**  
  Register anonymously with a randomly generated username and password. No email required. hCaptcha is used to prevent abuse.
- **Customization:**  
  Change your theme and background in Settings.
- **Feedback:**  
  Rate your chat experience and leave comments to help improve the service.

---

## Safety & Privacy

- AI never gives medical advice or diagnoses.
- Crisis detection and escalation protocols are in place.
- Anonymous by default; no real names required.
- Full data control: delete your account and data at any time.

---

## Contributing

We welcome contributions! Please fork, branch, and submit pull requests. See the code for type-safety and testing guidelines.

---

## License

AGPL-3.0

This project is licensed under the GNU Affero General Public License v3.0. See the [LICENSE](LICENSE) file for details.

---

**Want to suggest a new feature or report a bug? Open an issue or join the discussion!**
