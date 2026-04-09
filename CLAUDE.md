# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce frontend for a mug/cup store ("ecomerce-tazas"). Built with React 19 + Vite, styled with Tailwind CSS + DaisyUI. The app communicates with a backend API via Axios and uses Socket.IO for real-time features. The UI language is Spanish.

## Commands

```bash
pnpm dev        # Dev server on port 3000
pnpm build      # Production build
pnpm lint       # ESLint
pnpm preview    # Preview production build
```

Package manager is **pnpm**. `.npmrc` has `shamefully-hoist=true` (required for Tailwind v3 + DaisyUI `require()` in config files).

## Architecture

### Routing & Layouts

Routes are defined in `src/App.jsx` using react-router v7. Three route guard components control access:
- **ProtectedRoute** — requires authenticated user
- **GuestRoute** — only for unauthenticated users (login/register)
- **AdminRoute** — requires admin role

Two layouts exist:
- `src/Layout/Layout.jsx` — public store layout (Navbar + Footer + Outlet)
- `src/Layout/DashboardLayout.jsx` — admin panel layout (no footer, sidebar navigation)

Admin dashboard routes live under `/admin/dashboard/*` and are wrapped in `DashboardProductProvider`.

### State Management — Context + Custom Hooks Pattern

All global state lives in React Context providers (`src/Context/`), each consumed through a corresponding custom hook (`src/Hooks/`). The provider nesting order in `App.jsx` matters:

`UserContext > ProductContext > CategoryContext > CartContext > WishlistContext > ThemeContext`

Key contexts: UserContext (auth state, session management), CartContext, WishlistContext, ProductContext, CategoryContext, DashboardProductContext (admin product management), ThemeContext (dark mode via `class` strategy).

### API Layer

All HTTP calls go through the shared Axios instance in `src/services/api.js`. Never import `axios` directly — always import `api`.

- `src/services/api.js` — Axios instance with `VITE_BACKEND_URL` base URL, `withCredentials: true`, and three interceptors:
  - **Request**: Attaches `Authorization: Bearer` header from `window.__accessToken`
  - **Response 429**: Shows user-friendly rate-limit toast with retry-after info
  - **Response 401**: Auto-refreshes token via `/auth/refresh`, queues and retries failed requests; silences 401s on `/auth/check-session`
- `src/services/authServices.js` — Auth services with in-memory access token on `window.__accessToken` (never in localStorage), cross-tab sync via BroadcastChannel (`useBroadcastAuth` hook).
- Other service files (`cartServices`, `productServices`, etc.) import the shared `api` instance and export async functions.

### Security Components

The project has XSS-aware sanitization built in:
- `src/Components/ui/SafeHTML.jsx`, `SafeInput.jsx`, `SafeText.jsx`, `SafeTextarea.jsx` — sanitized rendering/input components using DOMPurify
- `src/Hooks/useSanitize.js` — sanitization hook
- ESLint config includes `eslint-plugin-security` and disables `react/no-danger` only for the sanitization components

### UI Components

Reusable UI primitives are in `src/Components/ui/` and re-exported from `src/Components/ui/index.js`. Use these when building new UI (Button, Badge, Pagination, Portal, etc.).

### Environment Variables

Vite env vars are prefixed with `VITE_`. Key vars:
- `VITE_BACKEND_URL` — backend API base URL
- `VITE_API_TIMEOUT` — API timeout in ms

### Dev Server Proxy

Vite proxies `/api` and `/socket.io` requests to the backend (`vite.config.js`). WebSocket proxying is enabled for Socket.IO.
