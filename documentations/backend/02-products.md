# Products Management

## Overview

The Products module handles all product-related operations including CRUD operations, image uploads, barcode management, and supplier linking. Products are linked to stock records and suppliers for comprehensive inventory management.

## Architecture

### Components
- **Controller**: `controllers/productController.js` - Handles product operations
- **Model**: `models/productModel.js` - Database operations for products
- **Routes**: `routes/productRoutes.js` - API endpoint definitions
- **Middleware**: 
  - `middleware/authMiddleware.js` - Authentication
  - `middleware/adminMiddleware.js` - Admin-only access
  - `middleware/uploadMiddleware.js` - Image upload handling

### Design Patterns
- **Image Upload**: Multer middleware for file handling (max 3MB, JPG/PNG/WEBP)
- **Stock Integration**: Products automatically create stock records on creation
- **Supplier Linking**: Products can be linked to suppliers via `supplier_id`
- **Data Joining**: Product queries join with stock and suppliers tables

## API Endpoints

### GET `/api/products`
Get all products with stock and supplier information.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `name` (string, optional) - Search by product name
- `category` (string, optional) - Filter by category
- `minPrice` (number, optional) - Minimum price filter
- `maxPrice` (number, optional) - Maximum price filter

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Apple",
    "category": "Fruit",
    "price": 50.00,
    "barcode": "123456789",
    "description": "Fresh red apples",
    "expiry_date": "2024-12-31",
    "supplier_id": 1,
    "supplier_name": "Fresh Produce Co",
    "image_url": "1234567890-apple.jpg",
    "quantity": 100,
    "min_stock_level": 50,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Roles:** All authenticated users

### GET `/api/products/search`
Search products by name.

**Query Parameters:**
- `name` (string, required) - Search term

**Response (200):** Same as GET `/api/products`

### GET `/api/products/:id`
Get product by ID.

**Response (200):** Single product object (same structure as above)

**Error Responses:**
- `404` - Product not found

### POST `/api/products/add`
Create a new product (Admin only).

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `name` (string, required) - Product name
- `category` (string, required) - Product category
- `price` (number, required) - Product price (must be non-negative)
- `barcode` (string, optional) - Unique barcode
- `description` (text, optional) - Product description
- `expiry_date` (date, optional) - Expiry date (YYYY-MM-DD)
- `supplierId` (number, optional) - Supplier ID
- `quantity` (number, optional) - Initial stock quantity (default: 0)
- `image` (file, optional) - Product image (max 3MB, JPG/PNG/WEBP)

**Response (201):**
```json
{
  "message": "Product created successfully",
  "productId": 1
}
```

**Error Responses:**
- `400` - Invalid input (negative price/quantity, missing fields)
- `404` - Supplier not found (if supplierId provided)
- `500` - Server error

**Roles:** `admin`, `manager`

### PUT `/api/products/update/:id`
Update product (Admin only).

**Content-Type:** `multipart/form-data`

**Form Fields:** Same as POST, all optional

**Response (200):**
```json
{
  "message": "Product updated successfully"
}
```

**Roles:** `admin`, `manager`

### DELETE `/api/products/delete/:id`
Delete product (Admin only).

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

**Note:** Stock record is automatically deleted (CASCADE)

**Roles:** `admin`, `manager`

## Controller Functions

### `productController.createProduct(req, res)`
Creates a new product and initializes stock.

**Process:**
1. Validates price and quantity (non-negative)
2. Handles image upload (if provided)
3. Validates supplier (if supplierId provided)
4. Creates product record
5. Initializes stock record with initial quantity
6. Returns product ID

### `productController.getAllProducts(req, res)`
Retrieves products with optional filtering.

**Query Handling:**
- `name` → Uses `Product.search()`
- `category` → Uses `Product.filterByCategory()`
- `minPrice` + `maxPrice` → Uses `Product.filterByPrice()`
- No query → Returns all products

### `productController.getProductById(req, res)`
Retrieves single product by ID.

### `productController.searchProducts(req, res)`
Searches products by name (LIKE query).

### `productController.updateProduct(req, res)`
Updates product information.

**Process:**
1. Validates product exists
2. Validates price (if provided)
3. Validates supplier (if supplierId provided)
4. Merges incoming data with existing data
5. Updates product record

### `productController.deleteProduct(req, res)`
Deletes product and associated stock.

**Process:**
1. Deletes stock record first (maintains data integrity)
2. Deletes product record
3. Returns success message

## Model Methods

### `Product.create(data)`
Creates a new product.

**Parameters:**
- `data.name` (string)
- `data.category` (string)
- `data.price` (number)
- `data.barcode` (string, optional)
- `data.description` (text, optional)
- `data.expiry_date` (date, optional)
- `data.supplier_id` (number, optional)
- `data.image_url` (string, optional)

**Returns:** `insertId` (product ID)

**SQL:**
```sql
INSERT INTO products (name, category, price, barcode, description, expiry_date, supplier_id, image_url)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
```

### `Product.getAll()`
Retrieves all products with stock and supplier info.

**Returns:** Array of product objects

**SQL:** Joins `products`, `stock`, and `suppliers` tables

### `Product.getById(id)`
Retrieves product by ID with stock and supplier info.

**Returns:** Product object or `null`

### `Product.search(searchTerm)`
Searches products by name.

**SQL:**
```sql
WHERE p.name LIKE ?
```

### `Product.update(id, data)`
Updates product information.

**SQL:**
```sql
UPDATE products SET name = ?, category = ?, price = ?, barcode = ?, 
description = ?, expiry_date = ?, supplier_id = ?, image_url = ?
WHERE id = ?
```

### `Product.delete(id)`
Deletes product.

**SQL:**
```sql
DELETE FROM products WHERE id = ?
```

### `Product.filterByCategory(category)`
Filters products by category.

### `Product.filterByPrice(minPrice, maxPrice)`
Filters products by price range.

## Image Upload

### Upload Middleware
- **Storage**: Local disk (`./uploads/`)
- **Filename**: `{timestamp}-{originalname}` (spaces replaced with underscores)
- **File Size Limit**: 3MB
- **Allowed Types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
- **Error Handling**: Returns `400` for invalid file types or size exceeded

### Image URL
- Stored as filename in `products.image_url`
- Served statically at `/uploads/{filename}`
- Configured in `server.js`: `app.use('/uploads', express.static('uploads'))`

## Data Structure

### Product Object
```javascript
{
  id: number,
  name: string,
  category: string,
  price: number,
  barcode: string | null,
  description: string | null,
  expiry_date: date | null,
  supplier_id: number | null,
  supplier_name: string | null,
  supplier_contact_name: string | null,
  supplier_phone: string | null,
  supplier_email: string | null,
  image_url: string | null,
  quantity: number,           // From stock table
  min_stock_level: number,    // From stock table
  created_at: timestamp,
  updated_at: timestamp
}
```

## Validation Rules

### Price
- Must be a number
- Must be non-negative
- Returns `400` if negative or NaN

### Quantity
- Must be an integer
- Must be non-negative
- Defaults to `0` if not provided

### Supplier ID
- Must be a positive integer
- Must exist in suppliers table
- Returns `404` if supplier not found

### Barcode
- Optional
- Must be unique (enforced at database level)
- Returns `400` if duplicate

## Error Handling

### Common Errors

**400 Bad Request:**
- Negative price or quantity
- Missing required fields
- Invalid supplier ID
- Invalid file type or size

**404 Not Found:**
- Product not found
- Supplier not found

**500 Internal Server Error:**
- Database errors
- File upload errors

## Usage Examples

### Create Product with Image
```javascript
const formData = new FormData();
formData.append('name', 'Apple');
formData.append('category', 'Fruit');
formData.append('price', '50.00');
formData.append('quantity', '100');
formData.append('supplierId', '1');
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/products/add', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

### Search Products
```javascript
const response = await fetch('http://localhost:3000/api/products/search?name=apple', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Related Documentation
- [Stock Management](03-stock-management.md)
- [Suppliers](04-suppliers.md)
- [Upload Middleware](10-middleware.md)
- [Database Schema](../database/02-tables.md#products-table)
