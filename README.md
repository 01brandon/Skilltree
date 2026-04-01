# SkillTree

A personal learning tracker that lets you map out skills, log study sessions, and watch your progress build over time. Built for people who are serious about learning things deliberately — not for collecting course certificates.

---

## What it does

You add a skill — say music theory, or Spanish — and SkillTree gives it a home. From there you can:

- Set a difficulty level and estimated hours
- Attach resources (links, notes, references)
- Log study sessions with duration and notes
- Track overall progress with a manual percentage slider
- See all your skills in a filterable, searchable grid
- Get a dashboard overview of total hours, sessions, and active skills

Everything syncs to Firebase so your data follows you across devices.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication (email + Google) |
| Database | Cloud Firestore |
| Local cache | localStorage (offline reads) |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-username/skilltree.git
cd skilltree
npm install
```

### 2. Set up Firebase

Create a project at [console.firebase.google.com](https://console.firebase.google.com), then:

- Enable **Authentication** — turn on Email/Password and Google sign-in
- Enable **Firestore Database**
- Set Firestore rules (see below)

### 3. Add your environment variables

Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 4. Firestore rules

Paste this into your Firestore rules tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run it

```bash
npm run dev
```

---

## Project structure

```
src/
├── components/
│   ├── AuthGuard.jsx       # redirects unauthenticated users
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── SkillCard.jsx       # card used in the skills grid
│   └── Tabs.jsx            # info + study session tabs on the detail page
├── context/
│   └── AuthContext.jsx     # firebase auth state + login/signup/logout
├── hooks/
│   └── useFetch.js         # generic fetch hook + firestore wrapper
├── layouts/
│   └── DashboardLayout.jsx # sidebar layout for all dashboard routes
├── pages/
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashboardPage.jsx   # stats overview
│   ├── CharactersPage.jsx  # skills browse grid
│   ├── DetailPage.jsx      # single skill view with tabs
│   └── EditCharacterPage.jsx # add / edit skill form
├── utils/
│   ├── characterStorage.js # localStorage cache helpers
│   └── firebase.js         # firebase app init
├── App.jsx                 # route definitions
├── main.jsx
└── index.css               # tailwind + custom CSS variables
```

---

## Data model

Firestore structure:

```
users/
  {uid}/
    displayName, email, createdAt, skillCount
    skills/
      {skillId}/
        name, category, level, description,
        estimatedHours, progress, resources[],
        imageUrl, createdAt, updatedAt
        sessions/
          {sessionId}/
            duration (minutes), notes, date, createdAt
```

---

## Building for production

```bash
npm run build
