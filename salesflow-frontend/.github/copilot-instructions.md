# Copilot / AI Agent Instructions for salesflow-frontend

Purpose: Give concise, actionable context so an AI coding agent can be immediately productive working on this Vite + React + TypeScript frontend.

Quick start commands
- Dev server: `npm run dev` (runs `vite`).
- Build: `npm run build` (runs `tsc -b` then `vite build`). Type checking is required before building.
- Preview production build: `npm run preview`.
- Lint: `npm run lint` (runs `eslint .`).

Big-picture architecture
- Single-page React app bootstrapped by Vite and TypeScript (entry: `src/main.tsx`).
- Styling via Tailwind CSS (`tailwind.config.js`, `postcss.config.js`, `src/index.css`).
- HTTP interactions use `axios` (see `dependencies` in `package.json`). There is no central API client file yet — search for `axios` imports to find calls.
- Lightweight client-side auth is implemented in `src/contexts/AuthContext.tsx` (JWT stored in `localStorage` under `jwt_token`).

Key files and examples
- `src/main.tsx`: application entry. If you need app-wide context providers (like `AuthProvider`), wrap them here.
  - Example: wrap `<App />` with `<AuthProvider>` so `useAuth()` works across the app.
- `src/contexts/AuthContext.tsx`: provides `useAuth()` and `AuthProvider`.
  - Pattern: `AuthProvider` persists JWT to `localStorage` and exposes `login(token)` / `logout()`.
  - `useAuth()` throws an error when used outside the provider — do not call it from modules loaded outside React tree.
- `src/App.tsx`: simple UI example using Tailwind utility classes.
- `vite.config.ts`: contains Vite plugins and behavior. Prefer `import.meta.env` for runtime env vars.

Project-specific conventions & patterns
- Type-only import style is used in some files (e.g., `import type { ReactNode } from 'react'`). Preserve `type` imports when refactoring types.
- Build pipeline runs `tsc -b` before `vite build`: any changes must type-check with `tsc`.
- LocalStorage key for auth: `jwt_token` — keep this consistent across auth code.
- `useAuth()` invariant: code relies on React context; ensure components that call `useAuth()` are rendered under `AuthProvider`.

Developer workflows and debugging
- Use `npm run dev` for iterative development. Vite provides an overlay for runtime errors.
- When making production changes, run `npm run build` locally to catch TypeScript or build-time issues.
- Linting: `npm run lint` (ESLint + React plugins). Fix lint issues before committing where reasonable.

Integration points and external dependencies
- Backend API calls use `axios`. No global `axios` instance is present by default — consider adding `src/lib/api.ts` for centralized configuration (baseURL, interceptors for auth token).
- Routing dependency present: `react-router-dom` is installed — routes may not yet be implemented in `src/`.

Editing guidance for agents
- Make minimal, focused changes: keep public APIs and filenames stable.
- When adding runtime environment config, prefer Vite conventions (`import.meta.env.VITE_...`) and document new env keys in `README.md`.
- If using the auth token in API calls, read token from `AuthContext` (or from `localStorage` if running outside React) and add it via an axios interceptor.

Where to look first (search tips)
- `src/contexts/AuthContext.tsx` — auth patterns and `localStorage` usage.
- `src/main.tsx` and `src/App.tsx` — app bootstrap and root layout.
- `package.json` — scripts (`dev`, `build`, `preview`, `lint`) and dependencies.
- `tailwind.config.js`, `postcss.config.js`, `src/index.css` — styling pipeline.

If you change project-level config
- Ensure `npm run build` still completes locally (typecheck + build).
- Update `README.md` if you add new scripts or env vars.

If anything in this doc is unclear or missing, tell me what you'd like expanded or any particular workflows you expect the agent to follow.
