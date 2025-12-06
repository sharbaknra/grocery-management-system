# Middleware Documentation

## Overview

Middleware functions handle authentication, authorization, and file uploads across the application.

## Authentication Middleware

### `verifyToken(req, res, next)`
**File:** `middleware/authMiddleware.js`

Verifies JWT token from Authorization header.

**Process:**
1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies token with `JWT_SECRET`
3. Attaches decoded user data to `req.user`
4. Calls `next()` if valid

**Error Responses:**
- `401` - No token, invalid format, or expired token

**Usage:**
```javascript
router.get('/protected', verifyToken, handler);
```

## Role Middleware

### `allowRoles(...roles)`
**File:** `middleware/roleMiddleware.js`

Restricts access to specific roles.

**Process:**
1. Checks `req.user` exists (must be called after `verifyToken`)
2. Validates `req.user.role` is valid string
3. Checks if role is in allowed roles list
4. Calls `next()` if allowed

**Error Responses:**
- `401` - No user data or invalid role
- `403` - Insufficient privileges

**Usage:**
```javascript
router.get('/admin-only', verifyToken, allowRoles('admin', 'manager'), handler);
```

## Admin Middleware

### `adminOnly(req, res, next)`
**File:** `middleware/adminMiddleware.js`

Restricts access to admin role only.

**Usage:**
```javascript
router.post('/admin', auth, adminOnly, handler);
```

## Upload Middleware

### `upload.single(fieldName)`
**File:** `middleware/uploadMiddleware.js`

Handles file uploads using Multer.

**Configuration:**
- **Storage**: Local disk (`./uploads/`)
- **Filename**: `{timestamp}-{originalname}` (spaces → underscores)
- **File Size Limit**: 3MB
- **Allowed Types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

**Process:**
1. Validates file type
2. Validates file size
3. Saves file to `uploads/` directory
4. Attaches file info to `req.file`

**Error Handling:**
- Returns `400` for invalid file types or size exceeded
- Handled by global error middleware in `server.js`

**Usage:**
```javascript
router.post('/upload', auth, upload.single('image'), handler);
```

## Middleware Order

1. `verifyToken` - Must be first for protected routes
2. `allowRoles` or `adminOnly` - Role-based access control
3. `upload.single()` - File upload handling (if needed)
4. Controller handler

## Related Documentation
- [Authentication](01-authentication.md)
- [Products](02-products.md)

