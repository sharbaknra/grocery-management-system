# Frontend Architecture

## Overview

The frontend is a Single Page Application (SPA) built with vanilla JavaScript (ES6+), using hash-based routing and a centralized state management system.

## Technology Stack

- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Build**: Vite (or similar bundler)
- **Routing**: Hash-based routing (`#route`)
- **State Management**: Centralized state (`appState.js`)

## Project Structure

```
frontend/
├── src/
│   ├── main.js              # Router and app initialization
│   ├── pages/               # Page components
│   │   ├── auth/           # Login, Register
│   │   ├── manager/        # Manager dashboard
│   │   ├── cashier/        # POS interface
│   │   ├── purchasing/     # Purchasing dashboard
│   │   ├── products/       # Product management
│   │   ├── stock/          # Stock levels
│   │   ├── suppliers/      # Supplier management
│   │   ├── orders/         # Order history
│   │   ├── billing/        # Invoices
│   │   ├── reports/        # Reports
│   │   └── staff/          # Staff management
│   ├── services/           # API service layer
│   ├── state/              # State management
│   ├── components/         # Reusable components
│   └── styles/             # CSS files
└── index.html              # Entry point
```

## Architecture Patterns

### Page Registration Pattern
Each page exports a registration function:
```javascript
export function registerPageName(register) {
  register("route-name", pageFactory);
}
```

### Page Factory Pattern
Pages return an object with `html` and `onMount`:
```javascript
function pageFactory() {
  return {
    html: `<div>Page HTML</div>`,
    onMount: () => { /* initialization */ }
  };
}
```

### State Management
- Centralized state in `appState.js`
- Observer pattern for state changes
- LocalStorage persistence for session

### Service Layer
- API calls abstracted into service modules
- Centralized error handling
- Token management

## Related Documentation
- [Routing](05-routing.md)
- [State Management](04-state-management.md)
- [Services](03-services.md)
- [Pages](02-pages.md)

