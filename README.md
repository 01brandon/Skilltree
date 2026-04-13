# SkillTree

Track every skill. Measure real progress. Build a learning habit that holds.

SkillTree is a study analytics web app where you log study sessions, track skill progress, and maintain daily streaks — all backed by Firebase and built with React.

---
# SkillTree

> Track every skill. Measure real progress. Build a learning habit that holds.

SkillTree is a full-stack study analytics web application built with React and Firebase. Log study sessions, track skill progress across any subject, maintain daily streaks, and visualise your weekly activity — all backed by a persistent Firestore database with real-time updates.

## Live Demo

**[skilltree.vercel.app](https://skilltree.vercel.app)**

---

## Features

### Core
- **Skill management** — Add, edit, and delete skills across 10 categories (Programming, Design, Mathematics, Science, Language, Business, Music, Writing, Health, Other)
- **Session logging** — Record study sessions with duration in minutes, date, and optional notes
- **Progress tracking** — Set progress percentage per skill with an animated progress bar
- **Resource attachments** — Attach links and notes to any skill for reference

### Analytics
- **Daily streak counter** — Calculates consecutive study days from real session data
- **Weekly activity chart** — CSS bar chart showing hours studied per day for the last 7 days
- **Lifetime statistics** — Total hours, sessions logged, skills tracked, and average time per skill
- **Profile page** — Personal stats overview with weekly chart

### Experience
- **Dark / light mode** — Toggle with persistent preference saved to localStorage
- **Real-time updates** — Firestore `onSnapshot` listeners keep UI in sync without page refreshes
- **Animated reveals** — IntersectionObserver-driven scroll animations throughout
- **Responsive design** — Collapsible sidebar, mobile nav drawer, fluid layouts
- **Unsplash images** — Category-matched images automatically set on skill creation

### Authentication
- Email and password sign up and sign in
- Google OAuth sign-in via popup
- Persistent sessions across page refreshes
- Protected routes — unauthenticated users redirected to login

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router v |
| Styling | Tailwind CSS + custom CSS variables |
| Icons | Font Awesome 6 |
| Fonts | Playfair Display, DM Sans (Google Fonts) |
| Backend | Firebase Authentication + Firestore |
| Hosting | Vercel |
| Cache | localStorage (client-side only) |

---


## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Firebase project (free Spark plan is sufficient)

### Installation

```bash
# clone the repository
git clone https://github.com/01brandon/Skilltree.git

# navigate into the project
cd Skilltree

# install all dependencies
npm install
```

### Configure environment variables

```bash
# copy the example file
cp .env.example .env
```

Open `.env` and fill in your Firebase project values (see [Environment Variables](#environment-variables) below).

### Run the development server

```bash
npm run dev
```

The app will open at `http://localhost:3000`.

---

## Firebase Setup



## Available Scripts

```bash
# start development server at localhost:3000
npm run dev

```

---

## Architecture

### Frontend

A single-page React application with client-side routing via React Router v6. All navigation happens without full page reloads. The app is structured around two layout types:

- **Public layout** — Navbar + page content + Footer, used for the home page and about page
- **Dashboard layout** — Collapsible sidebar + `<Outlet>` for page content, used for all authenticated pages

### Backend

Firebase provides the entire backend:

- **Firebase Authentication** manages user identity, sessions, and OAuth
- **Firestore** stores all user and skill data with real-time listeners via `onSnapshot`

There is no custom server, no Node.js backend, and no REST API. All data access happens directly from the browser via the Firebase SDK.

### State management

No external state library is used. State is managed with:

- **React `useState` and `useEffect`** — local component state
- **Context API** — `AuthContext` for auth state, `ThemeContext` for dark mode, both available app-wide
- **localStorage** — client-side cache for skills and sessions (speed only, not source of truth)

---


## Database Structure

```
Firestore
└── users/
    └── {userId}/
        ├── uid: string
        ├── email: string
        ├── displayName: string
        ├── photoURL: string
        ├── createdAt: timestamp
        ├── bio: string
        ├── skillCount: number
        └── skills/
            └── {skillId}/
                ├── name: string
                ├── category: string
                ├── level: number (1–5)
                ├── description: string
                ├── estimatedHours: number
                ├── progress: number (0–100)
                ├── imageUrl: string
                ├── resources: array of { title, url, note }
                ├── createdAt: timestamp
                ├── updatedAt: timestamp
                └── sessions/
                    └── {sessionId}/
                        ├── duration: number (minutes)
                        ├── notes: string
                        ├── date: string (YYYY-MM-DD)
                        └── createdAt: timestamp
```

Each user owns their own document and subcollections. No user can query or write to another user's data.

---

## Roadmap

- [ ] PDF export of study history
- [ ] Public skill profiles and sharing
- [ ] Milestone badges and achievements
- [ ] Mobile app via React Native
- [ ] AI-powered study suggestions
- [ ] Team and cohort skill boards
- [ ] Google Calendar integration
- [ ] Stripe-based Pro plan

---

## License

MIT — see [LICENSE](LICENSE) for details.
