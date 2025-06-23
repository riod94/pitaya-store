# Admin Products API Documentation

API ini menyediakan operasi CRUD (Create, Read, Update, Delete) untuk manajemen produk di area admin. Semua endpoint memerlukan autentikasi dan otorisasi role `admin` atau `super_admin`.

## Base URL
```
/api/admin/products
```

## Authentication
Semua endpoint memerlukan session yang valid dengan role `admin` atau `super_admin`. Jika tidak terotentikasi, akan mengembalikan status `401 Unauthorized`. Jika role tidak sesuai, akan mengembalikan status `403 Forbidden`.

## Endpoints

### 1. Get Products List
Mengambil daftar produk dengan pagination dan filter.

**Endpoint:** `GET /api/admin/products`

**Query Parameters:**
- `page` (optional): Nomor halaman, default: 1
- `limit` (optional): Jumlah item per halaman, default: 10
- `search` (optional): Pencarian berdasarkan nama produk
- `status` (optional): Filter berdasarkan status (`active`, `inactive`, `discontinued`)
- `categoryId` (optional): Filter berdasarkan ID kategori
- `sortBy` (optional): Field untuk sorting, default: `createdAt`
- `sortOrder` (optional): Urutan sorting (`asc`, `desc`), default: `desc`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "sku": "PROD-001",
      "name": "Nama Produk",
      "slug": "nama-produk",
      "description": "Deskripsi produk",
      "shortDescription": "Deskripsi singkat",
      "costPrice": "50000",
      "hpp": "60000",
      "sellingPrice": "100000",
      "weight": 500,
      "dimensions": { "length": 10, "width": 5, "height": 3 },
      "stockQuantity": 100,
      "minStockLevel": 10,
      "maxStockLevel": 500,
      "images": ["image1.jpg", "image2.jpg"],
      "thumbnailUrl": "thumbnail.jpg",
      "status": "active",
      "isTrackingStock": true,
      "allowBackorder": false,
      "featured": false,
      "metaTitle": "Meta Title",
      "metaDescription": "Meta Description",
      "metaKeywords": "keyword1, keyword2",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Kategori",
        "slug": "kategori"
      },
      "unit": {
        "id": 1,
        "name": "Pieces",
        "symbol": "pcs"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Create Product
Membuat produk baru.

**Endpoint:** `POST /api/admin/products`

**Request Body:**
```json
{
  "sku": "PROD-002",
  "name": "Nama Produk Baru",
  "slug": "nama-produk-baru",
  "description": "Deskripsi produk",
  "shortDescription": "Deskripsi singkat",
  "categoryId": 1,
  "unitId": 1,
  "costPrice": "50000",
  "hpp": "60000",
  "sellingPrice": "100000",
  "weight": 500,
  "dimensions": { "length": 10, "width": 5, "height": 3 },
  "stockQuantity": 100,
  "minStockLevel": 10,
  "maxStockLevel": 500,
  "images": ["image1.jpg"],
  "thumbnailUrl": "thumbnail.jpg",
  "status": "active",
  "isTrackingStock": true,
  "allowBackorder": false,
  "featured": false,
  "metaTitle": "Meta Title",
  "metaDescription": "Meta Description",
  "metaKeywords": "keyword1, keyword2"
}
```

**Required Fields:**
- `sku`: String, unique
- `name`: String
- `slug`: String, unique
- `costPrice`: Decimal
- `hpp`: Decimal
- `sellingPrice`: Decimal

**Response:**
```json
{
  "message": "Product created successfully",
  "data": { /* Product object */ }
}
```

### 3. Get Product by ID
Mengambil detail produk berdasarkan ID.

**Endpoint:** `GET /api/admin/products/{id}`

**Response:**
```json
{
  "data": { /* Product object with full details */ }
}
```

### 4. Update Product
Mengupdate produk berdasarkan ID.

**Endpoint:** `PUT /api/admin/products/{id}`

**Request Body:**
```json
{
  "name": "Nama Produk Updated",
  "sellingPrice": "150000",
  "stockQuantity": 150
}
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "data": { /* Updated product object */ }
}
```

### 5. Delete Product
Menghapus produk berdasarkan ID.

**Endpoint:** `DELETE /api/admin/products/{id}`

**Response:**
```json
{
  "message": "Product \"Nama Produk\" deleted successfully"
}
```

### 6. Bulk Operations
Operasi bulk untuk multiple products.

**Endpoint:** `POST /api/admin/products/bulk`

#### Bulk Delete
```json
{
  "action": "delete",
  "productIds": [1, 2, 3]
}
```

#### Bulk Update Status
```json
{
  "action": "updateStatus",
  "productIds": [1, 2, 3],
  "status": "inactive"
}
```

#### Bulk Update Featured
```json
{
  "action": "updateFeatured",
  "productIds": [1, 2, 3],
  "featured": true
}
```

#### Bulk Update Stock
```json
{
  "action": "updateStock",
  "productIds": [1, 2, 3],
  "stockQuantity": 100
}
```

**Response:**
```json
{
  "message": "Successfully updated status to \"inactive\" for 3 product(s)",
  "updatedProducts": [/* Array of updated products */],
  "notFound": 0
}
```

### 7. Product Statistics
Mengambil statistik dan analytics produk.

**Endpoint:** `GET /api/admin/products/stats`

**Response:**
```json
{
  "productsByStatus": {
    "active": 45,
    "inactive": 3,
    "discontinued": 2
  },
  "lowStockProducts": [/* Array of products with low stock */],
  "lowStockCount": 5,
  "productsByCategory": [
    {
      "categoryId": 1,
      "categoryName": "Electronics",
      "count": 20,
      "avgPrice": "150000"
    }
  ],
  "recentProducts": [/* 10 recently added products */],
  "featuredProductsCount": 8,
  "priceStats": {
    "minPrice": "10000",
    "maxPrice": "500000",
    "avgPrice": "125000",
    "totalValue": "5000000"
  },
  "stockStats": {
    "totalStock": 1250,
    "avgStock": 25,
    "totalProducts": 50,
    "outOfStock": 2
  },
  "summary": {
    "totalProducts": 50,
    "activeProducts": 45,
    "inactiveProducts": 3,
    "discontinuedProducts": 2,
    "outOfStockProducts": 2,
    "lowStockProducts": 5,
    "featuredProducts": 8
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized - No session found"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden - Admin access required"
}
```

### 400 Bad Request
```json
{
  "error": "Field sku is required"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 409 Conflict
```json
{
  "error": "SKU already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Usage Examples

### JavaScript/TypeScript
```javascript
// Get products with filter
const response = await fetch('/api/admin/products?page=1&status=active&search=laptop');
const { data, pagination } = await response.json();

// Create new product
const newProduct = {
  sku: 'LAPTOP-001',
  name: 'Gaming Laptop',
  slug: 'gaming-laptop',
  costPrice: '8000000',
  hpp: '9000000',
  sellingPrice: '12000000'
};

const createResponse = await fetch('/api/admin/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newProduct)
});

// Bulk update status
const bulkUpdate = await fetch('/api/admin/products/bulk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'updateStatus',
    productIds: [1, 2, 3],
    status: 'inactive'
  })
});
```

## Testing
API ini telah dilengkapi dengan comprehensive test suite menggunakan Bun built-in test framework.

### Menjalankan Test
```bash
# Jalankan semua test
bun test scripts/test-admin-api.test.ts

# Jalankan test dengan watch mode
bun test --watch scripts/test-admin-api.test.ts

# Jalankan test dengan verbose output
bun test --verbose scripts/test-admin-api.test.ts
```

### Prerequisites
Pastikan sebelum menjalankan test:
1. Server development berjalan (`bun run dev`)
2. Database sudah dikonfigurasi dan migrasi sudah dijalankan
3. Sudah login sebagai admin/super_admin di browser

### Test Coverage
Test suite mencakup:
- GET endpoints (list, pagination, filters, by ID)
- POST endpoint (create product)
- PUT endpoint (update product)  
- DELETE endpoint (delete product)
- Bulk operations (status, featured, stock updates)
- Statistics endpoint
- Error handling dan edge cases
- Input validation
- Duplicate checking (SKU, slug)

### Test Structure
```typescript
describe("Admin Products API", () => {
  // Setup dan cleanup otomatis
  beforeAll(() => { /* setup */ });
  afterAll(() => { /* cleanup test data */ });
  
  describe("GET /api/admin/products", () => {
    test("should get products list", async () => {
      // Test implementation
    });
  });
  
  // Test groups lainnya...
});
```

### Custom Test Commands
Tambahkan ke `package.json` untuk kemudahan:
```json
{
  "scripts": {
    "test:api": "bun test scripts/test-admin-api.test.ts",
    "test:api:watch": "bun test --watch scripts/test-admin-api.test.ts"
  }
}
```

## Security Notes
1. Semua endpoint dilindungi dengan validasi session dan role
2. Hanya role `admin` dan `super_admin` yang dapat mengakses API
3. Validasi input dilakukan untuk mencegah data yang tidak valid
4. SKU dan slug harus unique
5. Error handling komprehensif untuk berbagai kasus edge
