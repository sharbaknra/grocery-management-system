# State Management

## Overview

Centralized state management using observer pattern with LocalStorage persistence.

## State Structure

```javascript
{
  user: {
    id: number,
    name: string,
    email: string,
    role: string
  },
  token: string,
  cart: {
    items: Array,
    subtotal: number
  }
}
```

## State API

### `getState()`
Returns current state snapshot (immutable).

### `subscribe(listener)`
Subscribe to state changes. Returns unsubscribe function.

### `appActions.setSession({ user, token })`
Set user session and persist to LocalStorage.

### `appActions.clearSession()`
Clear session and remove from LocalStorage.

### `appActions.setCart(cart)`
Update cart state (does not persist).

## Persistence

- **Session**: Persisted to LocalStorage as `gms_session`
- **Cart**: Not persisted (fetched from API on login)
- **Hydration**: State restored from LocalStorage on page load

## Token Management

- Token stored in state and LocalStorage
- Automatically injected into API requests via `apiClient`
- Cleared on logout

## Related Documentation
- [Architecture](01-architecture.md)
- [Routing](05-routing.md)

