# Kronos — World Clock & Study Workspace

Kronos is a world clock + productivity dashboard, not a SaaS product. The
site has two routes:

- `/` — the landing page (premium dark hero with a 3D "Kronos clock")
- `/app` — the actual workspace: world clocks, a timezone-reactive desk
  scene, focus timer, tasks, goals, and notes

Routing uses `HashRouter` (URLs look like `/#/app`) specifically because
this deploys to GitHub Pages as a static project site — no server-side
rewrite rules needed for the app route to survive a refresh.

## Stack

- React 19 + TypeScript + Vite
- React Router (`HashRouter`, GitHub Pages-safe)
- Tailwind CSS v4
- Framer Motion (scroll reveals, hover states, drag-to-reorder city list)
- React Three Fiber + Three.js (the rotating armillary "Kronos" hero object)
- lucide-react (icons)
- Data persistence: `localStorage` (tasks, goals, notes, city list, ambient
  settings) — no backend yet

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview   # serve the production build locally to sanity-check it
```

Output goes to `dist/`, ready to deploy to Vercel, Netlify, or any static host.

## Structure

```
src/
  pages/
    Landing.tsx        marketing-free landing page (route: /)
    Dashboard.tsx       the workspace app (route: /app)
  components/
    Nav.tsx, Hero.tsx, KronosOrb.tsx, ParticleField.tsx,
    Features.tsx, Stats.tsx, CTA.tsx, Footer.tsx   — landing page only
    dashboard/
      DashboardTopBar.tsx   logo, active city, live time
      WorldClockPanel.tsx   add / remove / drag-to-reorder city list
      DeskScene.tsx         full-screen timezone-reactive sky + desk
      CrtTerminal.tsx       typing terminal effect on the CRT monitor
      FocusTimer.tsx        circular Pomodoro timer (work/short/long)
      TaskList.tsx          add / complete / delete tasks
      GoalsList.tsx         daily goal progress bars
      NotesWidget.tsx       autosaving quick notes
      StatsRow.tsx          focus time / completed / sessions / streak
      AmbientControls.tsx   floating panel: rain, music, wind, key sounds,
                             clock format, particle density
  lib/
    timezones.ts        city list + time-of-day (morning/afternoon/
                         evening/night) calculation from IANA tz names
    useNow.ts            ticking clock hook
    usePersistentState.ts  localStorage-backed useState
  index.css              design tokens (color, type) + global styles
```

## Design system

- **Colors**: near-black ink (`#0a0b10`), brass/gold accent (`#c9a227`,
  `#e8c05c`) standing in for Kronos and clock hardware, a cool teal
  (`#6ee7d8`) for interactive/data accents, warm off-white text (`#f2f0e8`).
- **Type**: Space Grotesk (display/headlines), Fraunces italic (the single
  epigraph line), Inter (body), IBM Plex Mono (timestamps, labels, data).
- **Signature element**: the 3D rotating armillary clock in the hero —
  three tilted rings on independent axes, a wireframe core, two clock
  hands, and orbiting brass particles. It reacts to pointer position.
- Respects `prefers-reduced-motion` throughout.

## What's in this milestone vs. what's not

**Working now:** timezone-driven day/night environment, drag-to-reorder
world clocks (add/remove from a 12-city library), animated CRT desk scene,
Pomodoro timer, tasks, goals, notes, stats — all persisted to
`localStorage` so they survive a refresh.

**Not wired up yet, intentionally:**
- Ambient/rain/wind/key sounds — toggles exist and are ready, but there's
  no audio source loaded. Say the word and I'll add real ambient tracks.
- No backend — everything lives in the browser. Multi-device sync would
  need the Express + MongoDB + auth layer from the original plan.
- Particle density / animation quality settings are stored but not yet
  wired to actually change render load — worth doing once you're running
  this on lower-end devices.

## What's next

1. Wire up ambient audio (rain / cafe / forest / ocean / fireplace loops)
2. Backend — Express + MongoDB + JWT/Google/GitHub auth, so data syncs
   across devices instead of living only in this browser's localStorage
3. Replace the CSS/SVG desk scene with true 3D (Three.js models) if you
   want more depth/parallax than the current flat-illustration approach
4. AI assistant, analytics, achievements, calendar

Tell me which to build next.
