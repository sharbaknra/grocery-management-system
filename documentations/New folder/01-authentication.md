# Authentication and User Management

## Overview

The authentication system uses JWT (JSON Web Tokens) for stateless authentication. Users are authenticated via email/password, and JWT tokens are issued for subsequent API requests. The system supports role-based access control with roles: `admin`, `manager`, `staff`, `purchasing`, and `customer`.

## Architecture

### Components
- **Controller**: `controllers/userController.js` - Handles registration, login, and user management
- **Model**: `models/userModel.js` - Database operations for user data
- **Routes**: `routes/userRoutes.js` - API endpoint definitions
- **Middleware**: 
  - `middleware/authMiddleware.js` - JWT token verification
  - `middleware/roleMiddleware.js` - Role-based access control
- **Utils**: `utils/tokenBlacklist.js` - Token blacklist (in-memory, resets on restart)

### Design Patterns
- **Password Hashing**: bcrypt with salt rounds of 10
- **Token Expiration**: 1 hour (configurable via JWT_SECRET)
- **Role Enforcement**: Public registration always creates `customer` role; staff accounts must be created by admin/manager

## API Endpoints

### Public Endpoints

#### POST `/api/users/register`
Register a new user account (always creates `customer` role).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully!"
}
```

**Error Responses:**
- `400` - Missing fields or email already registered
- `500` - Server error

**Example:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

#### POST `/api/users/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@grocery.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `404` - User not found
- `500` - Server error

**Example:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grocery.com","password":"admin123"}'
```

### Protected Endpoints (Admin/Manager Only)

All protected endpoints require:
- `Authorization: Bearer <token>` header
- Valid JWT token
- Appropriate role permissions

#### GET `/api/users`
Get all users (excluding passwords).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Store Manager",
    "email": "admin@grocery.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

**Roles:** `admin`, `manager`

#### POST `/api/users/staff`
Create a new staff or purchasing agent account.

**Request Body:**
```json
{
  "name": "Jane Staff",
  "email": "jane@grocery.com",
  "password": "password123",
  "role": "staff"
}
```

**Valid Roles:** `staff`, `purchasing`

**Response (201):**
```json
{
  "message": "Staff user created successfully!",
  "user": {
    "id": 5,
    "name": "Jane Staff",
    "email": "jane@grocery.com",
    "role": "staff"
  }
}
```

**Error Responses:**
- `400` - Missing fields, invalid role, or email already registered
- `500` - Server error

#### GET `/api/users/:id`
Get user by ID.

**Response (200):**
```json
{
  "id": 1,
  "name": "Store Manager",
  "email": "admin@grocery.com",
  "role": "admin",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - User not found
- `500` - Server error

#### PUT `/api/users/:id`
Update user information.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "staff",
  "password": "newpassword123"
}
```

**Note:** All fields are optional. Password is hashed before storage.

**Response (200):**
```json
{
  "message": "User updated successfully!",
  "user": {
    "id": 1,
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "staff",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid role
- `404` - User not found
- `500` - Server error

#### DELETE `/api/users/:id`
Delete a user account.

**Response (200):**
```json
{
  "message": "User deleted successfully!"
}
```

**Error Responses:**
- `400` - Cannot delete your own account
- `404` - User not found
- `500` - Server error

## Controller Functions

### `userController.register(req, res)`
Handles user registration.

**Parameters:**
- `req.body.name` (string, required) - User's full name
- `req.body.email` (string, required) - User's email address
- `req.body.password` (string, required) - Plain text password

**Process:**
1. Validates required fields
2. Checks if email already exists
3. Hashes password with bcrypt (salt rounds: 10)
4. Creates user with role `customer` (ignores any role from request)
5. Returns success message

**Error Handling:**
- Returns `400` for missing fields or duplicate email
- Returns `500` for database errors

### `userController.login(req, res)`
Handles user authentication.

**Parameters:**
- `req.body.email` (string, required)
- `req.body.password` (string, required)

**Process:**
1. Validates email and password
2. Finds user by email
3. Compares password with bcrypt
4. Generates JWT token with user data (id, email, role)
5. Returns token and success message

**JWT Payload:**
```json
{
  "id": 1,
  "email": "admin@grocery.com",
  "role": "admin"
}
```

**Token Expiration:** 1 hour

### `userController.createStaff(req, res)`
Creates staff or purchasing agent account (admin/manager only).

**Parameters:**
- `req.body.name` (string, required)
- `req.body.email` (string, required)
- `req.body.password` (string, required)
- `req.body.role` (string, required) - Must be `staff` or `purchasing`

**Process:**
1. Validates all fields
2. Validates role is `staff` or `purchasing`
3. Checks for duplicate email
4. Hashes password
5. Creates user with specified role
6. Returns user data (without password)

### `userController.getAllUsers(req, res)`
Retrieves all users (admin/manager only).

**Returns:** Array of user objects (excluding passwords)

### `userController.getUserById(req, res)`
Retrieves user by ID.

**Parameters:**
- `req.params.id` (number, required)

**Returns:** User object or `null` if not found

### `userController.updateUser(req, res)`
Updates user information.

**Parameters:**
- `req.params.id` (number, required)
- `req.body.name` (string, optional)
- `req.body.email` (string, optional)
- `req.body.role` (string, optional) - Must be valid role
- `req.body.password` (string, optional) - Will be hashed

**Process:**
1. Validates user exists
2. Validates role if provided
3. Updates user fields (merges with existing data)
4. Updates password separately if provided
5. Returns updated user

### `userController.deleteUser(req, res)`
Deletes a user account.

**Parameters:**
- `req.params.id` (number, required)

**Process:**
1. Validates user exists
2. Prevents self-deletion (`req.user.id === id`)
3. Deletes user from database
4. Returns success message

## Model Methods

### `User.create(userData)`
Creates a new user record.

**Parameters:**
- `userData.name` (string)
- `userData.email` (string)
- `userData.password` (string) - Should be hashed
- `userData.role` (string, default: 'customer')

**Returns:** `{ id, name, email, role }`

**SQL:**
```sql
INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)
```

### `User.findByEmail(email)`
Finds users by email address.

**Parameters:**
- `email` (string)

**Returns:** Array of user objects (may be empty)

**SQL:**
```sql
SELECT * FROM users WHERE email = ?
```

### `User.getAll()`
Retrieves all users (excluding passwords).

**Returns:** Array of user objects

**SQL:**
```sql
SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC
```

### `User.getById(id)`
Retrieves user by ID.

**Parameters:**
- `id` (number)

**Returns:** User object or `null`

**SQL:**
```sql
SELECT id, name, email, role, created_at FROM users WHERE id = ?
```

### `User.update(id, userData)`
Updates user information.

**Parameters:**
- `id` (number)
- `userData.name` (string, optional)
- `userData.email` (string, optional)
- `userData.role` (string, optional)

**SQL:**
```sql
UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?
```

### `User.updatePassword(id, hashedPassword)`
Updates user password.

**Parameters:**
- `id` (number)
- `hashedPassword` (string) - Pre-hashed password

**SQL:**
```sql
UPDATE users SET password = ? WHERE id = ?
```

### `User.delete(id)`
Deletes a user.

**Parameters:**
- `id` (number)

**SQL:**
```sql
DELETE FROM users WHERE id = ?
```

### `User.seedAdmin()`
Seeds default admin, staff, and purchasing agent accounts (idempotent).

**Default Users:**
- Admin: `admin@grocery.com` / `admin123`
- Staff: `staff@grocery.com` / `staff123`
- Purchasing: `purchasing@grocery.com` / `purchasing123`

**Process:**
- Checks if each user exists
- Creates only if missing
- Called automatically on server start (`server.js`)

## Middleware

### `verifyToken(req, res, next)`
Verifies JWT token from Authorization header.

**Header Format:**
```
Authorization: Bearer <token>
```

**Process:**
1. Extracts token from `Authorization` header
2. Verifies token with `JWT_SECRET`
3. Attaches decoded user data to `req.user`
4. Calls `next()` if valid, returns `401` if invalid

**Error Responses:**
- `401` - No token provided, invalid format, or invalid/expired token

### `allowRoles(...roles)`
Restricts access to specific roles.

**Usage:**
```javascript
router.get('/admin-only', verifyToken, allowRoles('admin', 'manager'), handler);
```

**Process:**
1. Checks `req.user` exists (must be called after `verifyToken`)
2. Validates `req.user.role` is valid string
3. Checks if role is in allowed roles list
4. Calls `next()` if allowed, returns `403` if forbidden

**Error Responses:**
- `401` - No user data or invalid role
- `403` - Insufficient privileges

## Role Permissions

| Role | Register | Login | View Users | Create Staff | Update User | Delete User |
|------|----------|-------|------------|--------------|-------------|-------------|
| Public | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Customer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Staff | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Purchasing | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manager | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Security Considerations

### Password Security
- Passwords are hashed with bcrypt (10 salt rounds)
- Plain text passwords are never stored
- Password comparison uses `bcrypt.compare()` to prevent timing attacks

### Token Security
- Tokens expire after 1 hour
- Tokens are signed with `JWT_SECRET` (must be set in environment)
- Token blacklist exists but resets on server restart (use Redis for production)

### Role Security
- Public registration always creates `customer` role (client cannot specify role)
- Staff accounts can only be created by admin/manager
- Role validation occurs at multiple layers (middleware, controller)

### Input Validation
- Email uniqueness is enforced at database level
- Required fields are validated before database operations
- Invalid roles are rejected with `400` error

## Error Handling

### Common Errors

**400 Bad Request:**
- Missing required fields
- Invalid role
- Email already registered
- Invalid data format

**401 Unauthorized:**
- No token provided
- Invalid token format
- Expired token
- Invalid credentials

**403 Forbidden:**
- Insufficient role privileges

**404 Not Found:**
- User not found

**500 Internal Server Error:**
- Database errors
- Unexpected exceptions

## Usage Examples

### Frontend Login Flow
```javascript
// Login
const response = await fetch('http://localhost:3000/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@grocery.com', password: 'admin123' })
});

const { token } = await response.json();

// Store token
localStorage.setItem('token', token);

// Use token in subsequent requests
const productsResponse = await fetch('http://localhost:3000/api/products', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Creating Staff Account (Admin)
```javascript
const response = await fetch('http://localhost:3000/api/users/staff', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    name: 'Jane Staff',
    email: 'jane@grocery.com',
    password: 'password123',
    role: 'staff'
  })
});
```

## Related Documentation
- [Middleware Documentation](10-middleware.md)
- [API Reference](09-api-reference.md)
- [Database Schema](../database/02-tables.md#users-table)
