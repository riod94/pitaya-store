import { test, expect, describe, beforeAll, afterAll } from "bun:test";

const BASE_URL = 'http://localhost:3000';

// Variabel global untuk simpan cookie session admin
let adminCookie: string | null = null;

// Helper: login admin sebelum test
async function loginAsAdmin() {
  const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      email: 'riyo.s94@gmail.com',
      password: 'admin123'
    }),
    redirect: 'manual' // jangan follow redirect!
  });
  const setCookie = loginRes.headers.get('set-cookie');
  if (setCookie) {
    // Cari session-token dari semua cookie yang dikembalikan
    const match = setCookie.match(/(next-auth\.session-token|__Secure-next-auth\.session-token)=[^;]+/);
    if (match) {
      adminCookie = match[0];
      console.log('Cookie session:', adminCookie); // debug
    } else {
      throw new Error('Session-token tidak ditemukan di set-cookie');
    }
  } else {
    throw new Error('Gagal login admin, cookie tidak ditemukan');
  }
}

// Helper function untuk API calls (selalu kirim cookie admin jika ada)
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const headers: any = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (adminCookie) {
    headers['Cookie'] = adminCookie;
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const data = await response.json();
  return { data, status: response.status, response };
}


// Test data
const testProduct = {
  sku: 'TEST-BUN-001',
  name: 'Test Product Bun',
  slug: 'test-product-bun',
  description: 'Produk untuk testing dengan Bun',
  shortDescription: 'Produk test Bun',
  costPrice: '50000',
  hpp: '60000',
  sellingPrice: '100000',
  stockQuantity: 10,
  status: 'active',
  featured: false
};

let createdProductId: number | null = null;

describe("Admin Products API", () => {
  beforeAll(async () => {
    console.log('🧪 Starting Admin Products API Tests dengan Bun');
    console.log('⚠️  Pastikan server berjalan di http://localhost:3000');
    await loginAsAdmin();
    console.log('🧪 Starting Admin Products API Tests with Bun');
    console.log('⚠️  Pastikan server berjalan di http://localhost:3000');
    console.log('⚠️  Pastikan sudah login sebagai admin/super_admin');
  });

  afterAll(async () => {
    // Cleanup: hapus test product jika masih ada
    if (createdProductId) {
      try {
        await apiCall(`/api/admin/products/${createdProductId}`, {
          method: 'DELETE'
        });
        console.log(`🧹 Cleaned up test product ID: ${createdProductId}`);
      } catch (error) {
        console.log('⚠️  Failed to cleanup test product:', error);
      }
    }
  });

  describe("GET /api/admin/products", () => {
    test("should get products list", async () => {
      const result = await apiCall('/api/admin/products');

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(result.data).toHaveProperty('pagination');
      expect(Array.isArray(result.data.data)).toBe(true);
    });

    test("should get products with pagination", async () => {
      const result = await apiCall('/api/admin/products?page=1&limit=5');

      expect(result.status).toBe(200);
      expect(result.data.pagination).toHaveProperty('page', 1);
      expect(result.data.pagination).toHaveProperty('limit', 5);
    });

    test("should get products with search filter", async () => {
      const result = await apiCall('/api/admin/products?search=test');

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
    });

    test("should get products with status filter", async () => {
      const result = await apiCall('/api/admin/products?status=active');

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
    });
  });

  describe("POST /api/admin/products", () => {
    test("should create new product", async () => {
      const result = await apiCall('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(testProduct)
      });

      expect(result.status).toBe(201);
      expect(result.data).toHaveProperty('message');
      expect(result.data).toHaveProperty('data');
      expect(result.data.data).toHaveProperty('id');
      expect(result.data.data.sku).toBe(testProduct.sku);
      expect(result.data.data.name).toBe(testProduct.name);

      // Simpan ID untuk test selanjutnya
      createdProductId = result.data.data.id;
    });

    test("should fail to create product with duplicate SKU", async () => {
      const result = await apiCall('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(testProduct)
      });

      expect(result.status).toBe(409);
      expect(result.data).toHaveProperty('error');
      expect(result.data.error).toContain('SKU already exists');
    });

    test("should fail to create product without required fields", async () => {
      const incompleteProduct = { name: 'Incomplete Product' };
      const result = await apiCall('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(incompleteProduct)
      });

      expect(result.status).toBe(400);
      expect(result.data).toHaveProperty('error');
    });
  });

  describe("GET /api/admin/products/stats", () => {
    test("should get product statistics", async () => {
      const result = await apiCall('/api/admin/products/stats');

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('productsByStatus');
      expect(result.data).toHaveProperty('summary');
      expect(result.data).toHaveProperty('priceStats');
      expect(result.data).toHaveProperty('stockStats');
    });
  });

  describe("GET /api/admin/products/:id", () => {
    test("should get product by ID", async () => {
      if (!createdProductId) {
        throw new Error('No created product ID available');
      }

      const result = await apiCall(`/api/admin/products/${createdProductId}`);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(result.data.data.id).toBe(createdProductId);
      expect(result.data.data.sku).toBe(testProduct.sku);
    });

    test("should return 404 for non-existent product", async () => {
      const result = await apiCall('/api/admin/products/99999');

      expect(result.status).toBe(404);
      expect(result.data).toHaveProperty('error');
      expect(result.data.error).toContain('Product not found');
    });

    test("should return 400 for invalid product ID", async () => {
      const result = await apiCall('/api/admin/products/invalid');

      expect(result.status).toBe(400);
      expect(result.data).toHaveProperty('error');
      expect(result.data.error).toContain('Invalid product ID');
    });
  });

  describe("PUT /api/admin/products/:id", () => {
    test("should update product", async () => {
      if (!createdProductId) {
        throw new Error('No created product ID available');
      }

      const updateData = {
        name: 'Test Product Bun - Updated',
        sellingPrice: '150000',
        stockQuantity: 20
      };

      const result = await apiCall(`/api/admin/products/${createdProductId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('message');
      expect(result.data).toHaveProperty('data');
      expect(result.data.data.name).toBe(updateData.name);
      expect(result.data.data.sellingPrice).toBe(updateData.sellingPrice);
      expect(result.data.data.stockQuantity).toBe(updateData.stockQuantity);
    });

    test("should return 404 for updating non-existent product", async () => {
      const result = await apiCall('/api/admin/products/99999', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Name' })
      });

      expect(result.status).toBe(404);
      expect(result.data).toHaveProperty('error');
    });
  });

  describe("POST /api/admin/products/bulk", () => {
    test("should bulk update status", async () => {
      if (!createdProductId) {
        throw new Error('No created product ID available');
      }

      const result = await apiCall('/api/admin/products/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: 'updateStatus',
          productIds: [createdProductId],
          status: 'inactive'
        })
      });

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('message');
      expect(result.data).toHaveProperty('updatedProducts');
      expect(result.data.updatedProducts).toHaveLength(1);
      expect(result.data.updatedProducts[0].status).toBe('inactive');
    });

    test("should bulk update featured status", async () => {
      if (!createdProductId) {
        throw new Error('No created product ID available');
      }

      const result = await apiCall('/api/admin/products/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: 'updateFeatured',
          productIds: [createdProductId],
          featured: true
        })
      });

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('message');
      expect(result.data.updatedProducts[0].featured).toBe(true);
    });

    test("should fail with invalid action", async () => {
      const result = await apiCall('/api/admin/products/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: 'invalidAction',
          productIds: [1, 2, 3]
        })
      });

      expect(result.status).toBe(400);
      expect(result.data).toHaveProperty('error');
      expect(result.data.error).toContain('Invalid action');
    });

    test("should fail without productIds", async () => {
      const result = await apiCall('/api/admin/products/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: 'delete'
        })
      });

      expect(result.status).toBe(400);
      expect(result.data).toHaveProperty('error');
    });
  });

  describe("DELETE /api/admin/products/:id", () => {
    test("should delete product", async () => {
      if (!createdProductId) {
        throw new Error('No created product ID available');
      }

      const result = await apiCall(`/api/admin/products/${createdProductId}`, {
        method: 'DELETE'
      });

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('message');
      expect(result.data.message).toContain('deleted successfully');

      // Reset ID karena sudah dihapus
      createdProductId = null;
    });

    test("should return 404 for deleting non-existent product", async () => {
      const result = await apiCall('/api/admin/products/99999', {
        method: 'DELETE'
      });

      expect(result.status).toBe(404);
      expect(result.data).toHaveProperty('error');
    });
  });
});
