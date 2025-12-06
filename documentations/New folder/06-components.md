# Frontend Components

## Overview

Reusable UI components and templates.

## Component Structure

Components are located in `frontend/src/components/` and `frontend/src/components/templates/`.

## Common Patterns

### Event Delegation
Event listeners attached to parent elements for dynamic content:
```javascript
container.addEventListener('click', (e) => {
  if (e.target.matches('[data-action]')) {
    // Handle action
  }
});
```

### Dynamic Rendering
Pages use template literals for HTML generation:
```javascript
const html = `
  <div class="product-card">
    <h3>${product.name}</h3>
    <p>${product.price}</p>
  </div>
`;
```

## Styling

- **Framework**: Tailwind CSS
- **Theme**: Custom color scheme with dark mode support
- **Responsive**: Mobile-first design

## Related Documentation
- [Architecture](01-architecture.md)
- [Pages](02-pages.md)

