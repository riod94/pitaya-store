# Payment Accounts API Documentation

API endpoints untuk mengelola bank accounts dan e-wallet accounts untuk pembayaran manual.

## Overview

Sistem pembayaran manual mendukung 4 metode:
1. **Bank Transfer** - Transfer manual ke rekening bank (bisa lebih dari 1 rekening)
2. **E-Wallet** - Transfer manual ke e-wallet (GoPay, OVO, DANA, LinkAja, ShopeePay)
3. **Cash on Delivery (COD)** - Bayar saat terima (terbatas pada shipping zones)
4. **Credit/Debit Card** - Disabled (coming soon dengan payment gateway)

---

## Bank Accounts API

### Base URL
```
/api/admin/bank-accounts
```

### Authentication
Semua endpoint memerlukan autentikasi admin (role: `admin` atau `super_admin`).

---

### 1. GET /api/admin/bank-accounts
Mengambil semua bank accounts.

**Response Success (200)**
```json
{
  "data": [
    {
      "id": 1,
      "bankName": "BCA",
      "accountNumber": "1234567890",
      "accountHolderName": "John Doe",
      "branch": "Jakarta Pusat",
      "swiftCode": "CENAIDJA",
      "logo": null,
      "isActive": true,
      "sortOrder": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. POST /api/admin/bank-accounts
Membuat bank account baru.

**Request Body**
```json
{
  "bankName": "Mandiri",
  "accountNumber": "9876543210",
  "accountHolderName": "Jane Smith",
  "branch": "Jakarta Selatan",
  "swiftCode": "BMRIIDJA",
  "logo": null,
  "isActive": true,
  "sortOrder": 1
}
```

**Validation Rules**
- `bankName` (required): string
- `accountNumber` (required): string
- `accountHolderName` (required): string
- `branch` (optional): string
- `swiftCode` (optional): string (untuk international transfer)
- `logo` (optional): string (URL)
- `isActive` (optional): boolean, default true
- `sortOrder` (optional): number, default 0

**Response Success (201)**
```json
{
  "data": {
    "id": 2,
    "bankName": "Mandiri",
    "accountNumber": "9876543210",
    "accountHolderName": "Jane Smith",
    "branch": "Jakarta Selatan",
    "swiftCode": "BMRIIDJA",
    "logo": null,
    "isActive": true,
    "sortOrder": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. GET /api/admin/bank-accounts/:id
Mengambil detail bank account berdasarkan ID.

**Response Success (200)**
```json
{
  "data": {
    "id": 1,
    "bankName": "BCA",
    "accountNumber": "1234567890",
    "accountHolderName": "John Doe",
    "branch": "Jakarta Pusat",
    "swiftCode": "CENAIDJA",
    "logo": null,
    "isActive": true,
    "sortOrder": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. PUT /api/admin/bank-accounts/:id
Update bank account.

**Request Body** (semua field optional)
```json
{
  "bankName": "BCA",
  "accountNumber": "1234567890",
  "accountHolderName": "John Doe Updated",
  "branch": "Jakarta Utara",
  "isActive": true
}
```

**Response Success (200)**
```json
{
  "data": {
    "id": 1,
    "bankName": "BCA",
    "accountNumber": "1234567890",
    "accountHolderName": "John Doe Updated",
    "branch": "Jakarta Utara",
    "swiftCode": "CENAIDJA",
    "logo": null,
    "isActive": true,
    "sortOrder": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. DELETE /api/admin/bank-accounts/:id
Menghapus bank account.

**Response Success (200)**
```json
{
  "data": {
    "message": "Bank account deleted successfully"
  }
}
```

---

## E-Wallet Accounts API

### Base URL
```
/api/admin/ewallet-accounts
```

### Authentication
Semua endpoint memerlukan autentikasi admin (role: `admin` atau `super_admin`).

---

### 1. GET /api/admin/ewallet-accounts
Mengambil semua e-wallet accounts.

**Response Success (200)**
```json
{
  "data": [
    {
      "id": 1,
      "provider": "GoPay",
      "accountNumber": "081234567890",
      "accountHolderName": "John Doe",
      "logo": null,
      "qrCode": null,
      "isActive": true,
      "sortOrder": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. POST /api/admin/ewallet-accounts
Membuat e-wallet account baru.

**Request Body**
```json
{
  "provider": "OVO",
  "accountNumber": "081298765432",
  "accountHolderName": "Jane Smith",
  "logo": null,
  "qrCode": null,
  "isActive": true,
  "sortOrder": 1
}
```

**Validation Rules**
- `provider` (required): string (GoPay, OVO, DANA, LinkAja, ShopeePay)
- `accountNumber` (required): string (nomor HP atau ID akun)
- `accountHolderName` (required): string
- `logo` (optional): string (URL)
- `qrCode` (optional): string (URL untuk QR code)
- `isActive` (optional): boolean, default true
- `sortOrder` (optional): number, default 0

**Response Success (201)**
```json
{
  "data": {
    "id": 2,
    "provider": "OVO",
    "accountNumber": "081298765432",
    "accountHolderName": "Jane Smith",
    "logo": null,
    "qrCode": null,
    "isActive": true,
    "sortOrder": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. GET /api/admin/ewallet-accounts/:id
Mengambil detail e-wallet account berdasarkan ID.

**Response Success (200)**
```json
{
  "data": {
    "id": 1,
    "provider": "GoPay",
    "accountNumber": "081234567890",
    "accountHolderName": "John Doe",
    "logo": null,
    "qrCode": null,
    "isActive": true,
    "sortOrder": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. PUT /api/admin/ewallet-accounts/:id
Update e-wallet account.

**Request Body** (semua field optional)
```json
{
  "provider": "GoPay",
  "accountNumber": "081234567890",
  "accountHolderName": "John Doe Updated",
  "isActive": true
}
```

**Response Success (200)**
```json
{
  "data": {
    "id": 1,
    "provider": "GoPay",
    "accountNumber": "081234567890",
    "accountHolderName": "John Doe Updated",
    "logo": null,
    "qrCode": null,
    "isActive": true,
    "sortOrder": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. DELETE /api/admin/ewallet-accounts/:id
Menghapus e-wallet account.

**Response Success (200)**
```json
{
  "data": {
    "message": "E-wallet account deleted successfully"
  }
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
  "error": "Bank name, account number, and account holder name are required"
}
```

### 404 Not Found
```json
{
  "error": "Bank account not found"
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
// Get all bank accounts
const getBankAccounts = async () => {
  const res = await fetch('/api/admin/bank-accounts');
  const data = await res.json();
  return data.data;
};

// Create new bank account
const createBankAccount = async (account: {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch?: string;
  swiftCode?: string;
}) => {
  const res = await fetch('/api/admin/bank-accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error);
  }
  
  return await res.json();
};

// Get all e-wallet accounts
const getEwalletAccounts = async () => {
  const res = await fetch('/api/admin/ewallet-accounts');
  const data = await res.json();
  return data.data;
};

// Create new e-wallet account
const createEwalletAccount = async (account: {
  provider: string;
  accountNumber: string;
  accountHolderName: string;
}) => {
  const res = await fetch('/api/admin/ewallet-accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
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

### Bank Accounts Table
```typescript
bankAccounts = pgTable("bank_account", {
  id: serial("id").primaryKey(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  accountHolderName: text("account_holder_name").notNull(),
  branch: text("branch"),
  swiftCode: text("swift_code"),
  logo: text("logo"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### E-Wallet Accounts Table
```typescript
ewalletAccounts = pgTable("ewallet_account", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  accountNumber: text("account_number").notNull(),
  accountHolderName: text("account_holder_name").notNull(),
  logo: text("logo"),
  qrCode: text("qr_code"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

---

## Payment Method Flow

### 1. Bank Transfer
- Admin mengaktifkan toggle "Bank Transfer" di settings
- Admin menambahkan 1 atau lebih bank accounts
- Customer memilih bank transfer saat checkout
- Customer melihat list bank accounts yang tersedia
- Customer melakukan transfer manual
- Customer upload bukti transfer
- Admin verifikasi pembayaran manual

### 2. E-Wallet
- Admin mengaktifkan toggle "E-Wallet" di settings
- Admin menambahkan 1 atau lebih e-wallet accounts
- Customer memilih e-wallet saat checkout
- Customer melihat list e-wallet accounts yang tersedia
- Customer melakukan transfer manual atau scan QR code
- Customer upload bukti transfer
- Admin verifikasi pembayaran manual

### 3. Cash on Delivery (COD)
- Admin mengaktifkan toggle "COD" di settings
- COD hanya tersedia untuk customer di shipping zones yang sudah dikonfigurasi
- Customer di luar shipping zones tidak akan melihat opsi COD
- Customer bayar saat barang diterima
- Kurir mengkonfirmasi pembayaran

### 4. Credit/Debit Card
- Saat ini disabled
- Akan diaktifkan setelah integrasi payment gateway
- Tidak perlu verifikasi manual

---

## Notes

- Semua endpoint dilindungi dengan `validateAdminAccess()`
- Bank accounts dan e-wallet accounts bisa lebih dari 1
- `sortOrder` digunakan untuk mengurutkan tampilan di frontend
- `isActive` untuk enable/disable account tanpa menghapus dari database
- COD terbatas pada shipping zones yang sudah dikonfigurasi
- Credit/Debit Card masih disabled dan akan diaktifkan dengan payment gateway
