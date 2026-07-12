# Cosmic Energy Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-page Vite React website for อาจารย์ภัทรฤทัย ปราญ์ชมุณีภร with a cosmic-energy 3D animated design.

**Architecture:** Create a small React app with focused components: header, Three.js cosmic scene, hero, energy checker, services, social/contact CTA. Keep content data in arrays inside `App.jsx` because the site is intentionally small.

**Tech Stack:** Vite latest, React, Three.js, CSS animations.

---

### Task 1: Scaffold Vite React App

**Files:**
- Create/modify: `package.json`
- Create/modify: `index.html`
- Create/modify: `src/main.jsx`
- Create/modify: `src/App.jsx`
- Create/modify: `src/styles.css`

- [ ] Create a Vite React project in the current workspace.
- [ ] Install `three`.
- [ ] Verify `npm run build` works before custom UI changes.

### Task 2: Build Cosmic 3D Scene

**Files:**
- Create: `src/components/CosmicScene.jsx`

- [ ] Add a Three.js canvas with star particles, orbit rings, a central glowing orb, and floating card planes.
- [ ] Animate scene rotation and object motion with `requestAnimationFrame`.
- [ ] Dispose geometry/materials on unmount.
- [ ] Respect `prefers-reduced-motion`.

### Task 3: Build One-Page Content

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] Add Thai content from the public source notes without unsupported biography claims.
- [ ] Add hero, energy checker, services, social channel section, and contact CTA.
- [ ] Make the energy checker update local UI state.

### Task 4: Polish Responsive Design

**Files:**
- Modify: `src/styles.css`

- [ ] Implement midnight/gold/violet palette.
- [ ] Ensure mobile layout has no overflow and text remains readable.
- [ ] Add hover/focus states and reduced-motion fallbacks.

### Task 5: Verify

**Commands:**
- `npm run build`
- Start dev server and inspect desktop and mobile viewports.

- [ ] Capture implementation screenshots.
- [ ] Compare against generated concept for layout, palette, copy, 3D asset role, motion, and responsiveness.
