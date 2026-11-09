# Project Guide

## Application

- **Stack:** React 19, Vite, Tailwind CSS, Recharts, and `date-fns`.
- **Entry point:** `src/main.jsx`; application shell: `src/App.jsx`.
- **Persistence:** Browser `localStorage`, accessed through `src/utils/storage.js`.
- **UI:** Atomic components in `src/components/`, top-level views in `src/pages/`, and shared logic in `src/hooks/` and `src/utils/`.

## Commands

- `npm run dev` — start the Vite development server.
- `npm run lint` — run ESLint.
- `npm run build` — create the production bundle in `dist/`.
- `npm run preview` — serve the production bundle locally.

## Verification

- Confirm the active dev server serves this project before reviewing it.
- Check the interface at 375px, 768px, and 1440px widths.
- Run lint and a production build before handoff.
- Keep generated screenshots and temporary test output outside source folders.

## Product Constraints

- Keep the app local-first: do not add remote storage, analytics, or credentials without explicit approval.
- Persist user data through the storage adapter, preserving existing data keys and migrations where needed.
- Support keyboard interaction, visible focus indicators, and reduced-motion preferences.
