# Kronos — Landing Page & 3D Hero (Milestone 1)

This is the first milestone of the Kronos redesign: a production-ready
**landing page** with the premium dark visual identity, glassmorphism,
ambient particle background, and a custom 3D "Kronos clock" hero built with
React Three Fiber.

This does **not** yet include the app (task manager, notes, dashboard,
auth, backend, database). That's deliberate — those are separate, sizeable
builds and are best done one at a time so each one is real and working,
not a placeholder. See "What's next" below.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion (scroll reveals, hover states, page-load sequence)
- React Three Fiber + Three.js (the rotating armillary "Kronos" hero object)
- lucide-react (icons)

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
  components/
    Nav.tsx          fixed glass navbar
    Hero.tsx          headline, live clock readout, CTA, 3D orb wrapper
    KronosOrb.tsx      the 3D armillary clock (React Three Fiber)
    ParticleField.tsx  ambient 2D canvas background, mouse-reactive
    DayTimeline.tsx     "a day with Kronos" horizontal timeline
    Features.tsx       8-tool feature grid (glass cards)
    Stats.tsx          stat band
    CTA.tsx            closing call to action
    Footer.tsx
  App.tsx
  index.css            design tokens (color, type) + global styles
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

## What's next

Natural next milestones, each better as its own focused build:

1. App shell — sidebar, dashboard layout, command palette (⌘K)
2. Task manager — full CRUD, drag-and-drop, priorities, due dates
3. Notes — markdown, folders, search
4. Backend — Express + MongoDB + JWT/Google/GitHub auth
5. AI assistant, calendar, analytics, focus mode, achievements

Tell me which one to build next and whether it should talk to a real
backend or run on local/mock data first.
