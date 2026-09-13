# Life RPG

Turn your day into a dungeon crawl. Life RPG converts real tasks into quests — completing
them earns XP, gold, and levels up your character across a non-linear progression curve,
with streaks, attribute stats, and a cosmetic shop.

Built for **Tech Zephyr 4.0**, Round 1.

## Theme

Retro 16-bit dungeon aesthetic — pixel font (`Press Start 2P`), monospace body font
(`VT323`), hard-edged pixel borders, and drop-shadow buttons. Tasks are "Quests,"
points are "Gold," and stat growth is framed as an RPG attribute system
(Intellect, Strength, Wisdom, Discipline, Charisma).

## Tech Stack

- **Frontend:** React 18 (Vite), Tailwind CSS, Framer Motion for micro-interactions
- **Backend / Auth / Database:** Firebase Authentication (email + password) and
  Cloud Firestore (NoSQL, real-time listeners for cross-device sync)
- **Hosting:** Vercel / Netlify / Firebase Hosting (any static host works — see below)

Firebase was chosen as a Backend-as-a-Service so that authentication, session
management, and database access rules are handled by managed, audited
infrastructure rather than a hand-rolled server — while keeping nearly all
application code in the frontend, per the rulebook's allowed BaaS options.

## Core Systems

- **Auth & security:** Firebase Auth handles signup/login/session. Firestore
  security rules (`firestore.rules`) restrict every read/write to
  `request.auth.uid == uid`, so a user can only ever see or modify their own
  character and tasks.
- **Database schema:** `characters/{uid}` holds character state (XP, gold,
  streak, attributes, inventory); `characters/{uid}/tasks/{taskId}` holds that
  user's quests as a subcollection.
- **Progression engine:** XP required for level *n* is `100 * n^1.5` — a
  non-linear curve where each level costs more than the last
  (see `src/utils/leveling.js`).
- **Streaks:** Completing any quest updates `streak.lastCompletedDate`; the
  streak increments on consecutive days and resets after a missed day
  (`src/utils/dates.js`).
- **Attributes:** Each quest category (Coding, Gym, Reading, Chores, Social)
  feeds a specific stat (Intellect, Strength, Wisdom, Discipline, Charisma).
- **Economy:** Completing quests earns gold, spendable in the Shop tab on
  cosmetic frames, themes, and badges.
- **Optimistic UI:** Completing a quest updates the UI instantly; the Firestore
  write happens in the background, with an on-screen notice if sync fails.
- **Accessibility:** Semantic roles (`role="progressbar"`, `role="tablist"`,
  `role="alert"`/`role="status"`), full keyboard operability (Tab/Enter/Space
  on all interactive elements, visible focus rings), and responsive layout
  from mobile to desktop.

## AI Tool Disclosure

Portions of this codebase (component scaffolding, Firestore integration
boilerplate, and styling) were generated with AI assistance (Claude) and then
reviewed, tested, and adjusted by the team, per the rulebook's disclosure
requirement.

## Setup

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd life-rpg
   npm install
   ```

2. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/) → Add project
   - In the project, go to **Build → Authentication → Sign-in method** and enable
     **Email/Password**
   - Go to **Build → Firestore Database → Create database** (start in production
     mode — the included rules file locks it down)
   - Go to **Project settings → General → Your apps → Add app (Web)** and copy
     the config values

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in the six `VITE_FIREBASE_*` values from step 2.

4. **Deploy Firestore security rules**
   Paste the contents of `firestore.rules` into Firebase Console →
   Firestore Database → Rules, and publish. (Or use the Firebase CLI:
   `firebase deploy --only firestore:rules`.)

5. **Run locally**
   ```bash
   npm run dev
   ```

6. **Build & deploy**
   ```bash
   npm run build
   ```
   Deploy the `dist/` folder to Vercel, Netlify, or Firebase Hosting. Remember
   to add the same `VITE_FIREBASE_*` environment variables in your host's
   dashboard (Vercel/Netlify build settings), since `.env` is not committed.

## Project Structure

```
src/
  App.jsx                 Auth-gated routing
  firebase.js              Firebase init
  context/
    AuthContext.jsx        Auth state, signup/login/logout
    useCharacter.js         Real-time character + task data, XP/streak/economy logic
  components/
    AuthScreen.jsx          Login / signup form
    Dashboard.jsx            Main app shell (quests + shop tabs)
    CharacterPanel.jsx      Level, XP bar, attributes, streak, gold
    TaskForm.jsx            Add a quest
    TaskList.jsx            Active/completed quests, completion interaction
    LevelUpModal.jsx         Celebration on level up
    Shop.jsx                Currency shop for cosmetics
    Navbar.jsx              Header + logout + offline indicator
    Skeleton.jsx            Loading state
  utils/
    leveling.js             XP curve, categories, shop items
    dates.js                Streak date logic
```
