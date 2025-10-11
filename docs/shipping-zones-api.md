# Shipping Zones API Documentation

API endpoints untuk mengelola shipping zones (zona pengiriman).

## Base URL
```
/api/admin/shipping-zones
```

## Authentication
Semua endpoint memerlukan autentikasi admin (role: `admin` atau `super_admin`).

---

## Endpoints

### 1. GET /api/admin/shipping-zones
Mengambil semua shipping zones.

**Response Success (200)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Jakarta & Sekitarnya",
      "description": "Wilayah Jakarta dan sekitarnya",
      "area": ["Jakarta Selatan", "Jakarta Utara", "Tangerang", "Bekasi"],
      "isActive": true
    }
  ]
}
```

---

### 2. POST /api/admin/shipping-zones
Membuat shipping zone baru.

**Request Body**
```json
{
  "name": "Jawa Barat",
  "description": "Wilayah Jawa Barat",
  "area": ["Bandung", "Bogor", "Depok", "Cirebon"],
  "isActive": true
}
```

**Validation Rules**
- `name` (required): string
- `area` (required): array of strings, minimal 1 item
- `description` (optional): string
- `isActive` (optional): boolean, default true

**Response Success (201)**
```json
{
  "data": {
    "id": 2,
    "name": "Jawa Barat",
    "description": "Wilayah Jawa Barat",
    "area": ["Bandung", "Bogor", "Depok", "Cirebon"],
    "isActive": true
  }
}
```

**Response Error (400)**
```json
{
  "error": "Name and area (array) are required"
}
```

---

### 3. GET /api/admin/shipping-zones/:id
Mengambil detail shipping zone berdasarkan ID.

**URL Parameters**
- `id` (required): integer

**Response Success (200)**
```json
{
  "data": {
    "id": 1,
    "name": "Jakarta & Sekitarnya",
    "description": "Wilayah Jakarta dan sekitarnya",
    "area": ["Jakarta Selatan", "Jakarta Utara", "Tangerang", "Bekasi"],
    "isActive": true
  }
}
```

**Response Error (404)**
```json
{
  "error": "Shipping zone not found"
}
```

---

### 4. PUT /api/admin/shipping-zones/:id
Update shipping zone.

**URL Parameters**
- `id` (required): integer

**Request Body** (semua field optional)
```json
{
  "name": "Jakarta Raya",
  "description": "Updated description",
  "area": ["Jakarta Selatan", "Jakarta Utara", "Tangerang", "Bekasi", "Depok"],
  "isActive": true
}
```

**Response Success (200)**
```json
{
  "data": {
    "id": 1,
    "name": "Jakarta Raya",
    "description": "Updated description",
    "area": ["Jakarta Selatan", "Jakarta Utara", "Tangerang", "Bekasi", "Depok"],
    "isActive": true
  }
}
```

**Response Error (404)**
```json
{
  "error": "Shipping zone not found"
}
```

---

### 5. DELETE /api/admin/shipping-zones/:id
Menghapus shipping zone.

**URL Parameters**
- `id` (required): integer

**Response Success (200)**
```json
{
  "data": {
    "message": "Shipping zone deleted successfully"
  }
}
```

**Response Error (404)**
```json
{
  "error": "Shipping zone not found"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 400 Bad Request
```json
{
  "error": "Invalid JSON payload"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Usage Examples

### JavaScript/TypeScript

```typescript
// Get all shipping zones
const getShippingZones = async () => {
  const res = await fetch('/api/admin/shipping-zones');
  const data = await res.json();
  return data.data;
};

// Create new shipping zone
const createShippingZone = async (zone: {
  name: string;
  description?: string;
  area: string[];
  isActive?: boolean;
}) => {
  const res = await fetch('/api/admin/shipping-zones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(zone),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error);
  }
  
  return await res.json();
};

// Update shipping zone
const updateShippingZone = async (id: number, updates: Partial<{
  name: string;
  description: string;
  area: string[];
  isActive: boolean;
}>) => {
  const res = await fetch(`/api/admin/shipping-zones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error);
  }
  
  return await res.json();
};

// Delete shipping zone
const deleteShippingZone = async (id: number) => {
  const res = await fetch(`/api/admin/shipping-zones/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error);
  }
  
  return await res.json();
};
```

---

## Database Schema

```typescript
shippingZones = pgTable("shipping_zones", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  area: jsonb("area").notNull().default([]), // Array of strings
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

---

## Notes

- Semua endpoint dilindungi dengan `validateAdminAccess()`
- Field `area` disimpan sebagai JSONB array di database
- Field `isActive` default true jika tidak disediakan
- Timestamps (`createdAt`, `updatedAt`) dikelola otomatis oleh database
