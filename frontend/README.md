# Grocery Management System – Frontend

This directory hosts the vanilla HTML/CSS/JS interface that sits on top of the existing Express + MySQL backend. It is intentionally framework-free so it can be opened directly in a browser or bundled later if needed.

## Project Layout

```
frontend/
├── index.html               # App shell + script loader
├── README.md                # This file
├── docs/
│   └── backend-surface.md   # Backend reference for UI developers
└── src/
    ├── assets/              # Icons, images, fonts
    ├── components/          # Reusable UI primitives
    │   └── templates/       # HTML string templates per feature
    ├── pages/               # Route-level modules (auth, products, etc.)
    ├── services/            # API clients talking to Express
    ├── state/               # App-wide stores (auth, cart, events)
    ├── styles/              # tokens.css + global.css
    └── main.js              # Entry point that bootstraps the SPA shell
```

## Getting Started

1. Serve the backend (see root `README.md`), ensuring `http://localhost:3000/api` is reachable.
2. Open `frontend/index.html` in any modern browser. For local development, you can also run a lightweight static server:
   ```powershell
   # from the repository root
   npx serve frontend
   ```
3. Use the default credentials documented in the backend README to log in once the auth page is wired.

## Development Guidelines

- **Modular ES Modules:** Each page exports render/teardown functions so the router can swap them without globals.
- **Services Layer:** All fetch logic belongs in `src/services/*Service.js`. Pages should only call high-level helpers (e.g., `productsService.list()`).
- **State Management:** `src/state/appState.js` will expose `subscribe`, `getState`, and `dispatch` helpers so components stay reactive without frameworks.
- **Styling:** Global tokens live in `styles/tokens.css`; utility and layout rules go into `styles/global.css`. Components may ship scoped styles if necessary, but prefer composing existing tokens.
- **Accessibility & Offline:** Follow semantic HTML, focus management, and support the offline-friendly UX hinted at in the provided UI mockups.
- **Legacy Mockups:** Static HTML mockups from `frontend/ui/**/code.html` were migrated into `src/components/templates/mockups/`. Use the loader in `mockupRegistry.js` to inspect or reuse them while wiring modern modules.

For deeper backend knowledge (endpoints, roles, payloads), consult `docs/backend-surface.md`. This ensures the UI remains in lockstep with the Express API as both evolve.

