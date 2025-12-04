# Data Flow and Transactions

## Transaction Management

### Checkout Transaction Flow

```
BEGIN TRANSACTION
  ├── Validate Stock (SELECT FOR UPDATE)
  ├── Deduct Stock (Atomic UPDATE)
  ├── Create Order
  ├── Create Order Items
  ├── Log Stock Movements
  ├── Clear Cart
  └── COMMIT
```

**Rollback**: On any error, entire transaction rolls back

### Stock Operations

**Restock**:
```sql
UPDATE stock SET quantity = quantity + ? WHERE product_id = ?
```

**Reduce**:
```sql
UPDATE stock SET quantity = quantity - ? 
WHERE product_id = ? AND quantity >= ?
```

**Atomic**: Single SQL statement prevents race conditions

## Data Flow Diagrams

### Product Creation Flow
```
Create Product → Initialize Stock → Link Supplier (optional)
```

### Checkout Flow
```
Cart → Validate Stock → Deduct Stock → Create Order → Create Items → Log Movements → Clear Cart
```

### Stock Update Flow
```
Restock/Reduce → Atomic Update → Log Movement (non-blocking)
```

## Concurrency Control

### Row-Level Locking
- `SELECT FOR UPDATE` locks rows during transaction
- Prevents concurrent modifications
- Used in checkout stock validation

### Atomic Updates
- Single SQL UPDATE prevents race conditions
- Conditional UPDATE prevents negative stock
- No need for application-level locking

## Related Documentation
- [Checkout](../backend/07-checkout.md)
- [Stock Management](../backend/03-stock-management.md)
- [Schema Overview](01-schema-overview.md)

