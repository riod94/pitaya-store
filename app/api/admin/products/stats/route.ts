import { NextRequest } from "next/server";
import { db } from "@/drizzle/db/schema";
import { products, categories } from "@/drizzle/db/schema";
import { eq, sql, count, sum, avg } from "drizzle-orm";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";

// GET: Mengambil statistik products
export async function GET(request: NextRequest) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    // Total products by status
    const productsByStatus = await db
      .select({
        status: products.status,
        count: count(products.id)
      })
      .from(products)
      .groupBy(products.status);

    // Low stock products (stock <= minStockLevel)
    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        stockQuantity: products.stockQuantity,
        minStockLevel: products.minStockLevel
      })
      .from(products)
      .where(sql`${products.stockQuantity} <= ${products.minStockLevel}`)
      .orderBy(products.stockQuantity);

    // Products by category
    const productsByCategory = await db
      .select({
        categoryId: products.categoryId,
        categoryName: categories.name,
        count: count(products.id),
        avgPrice: avg(products.sellingPrice)
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .groupBy(products.categoryId, categories.name);

    // Recently added products (last 30 days)
    const recentProducts = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        status: products.status,
        createdAt: products.createdAt
      })
      .from(products)
      .where(sql`${products.createdAt} >= NOW() - INTERVAL '30 days'`)
      .orderBy(sql`${products.createdAt} DESC`)
      .limit(10);

    // Featured products count
    const featuredProductsCount = await db
      .select({ count: count(products.id) })
      .from(products)
      .where(eq(products.featured, true));

    // Price statistics
    const priceStats = await db
      .select({
        minPrice: sql<number>`min(${products.sellingPrice})`,
        maxPrice: sql<number>`max(${products.sellingPrice})`,
        avgPrice: sql<number>`avg(${products.sellingPrice})`,
        totalValue: sum(sql`${products.sellingPrice} * ${products.stockQuantity}`)
      })
      .from(products)
      .where(eq(products.status, 'active'));

    // Stock statistics
    const stockStats = await db
      .select({
        totalStock: sum(products.stockQuantity),
        avgStock: avg(products.stockQuantity),
        totalProducts: count(products.id),
        outOfStock: count(sql`case when ${products.stockQuantity} = 0 then 1 end`)
      })
      .from(products)
      .where(eq(products.status, 'active'));

    return createApiResponse({
      productsByStatus: productsByStatus.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {} as Record<string, number>),
      lowStockProducts: lowStockProducts,
      lowStockCount: lowStockProducts.length,
      productsByCategory: productsByCategory,
      recentProducts: recentProducts,
      featuredProductsCount: featuredProductsCount[0]?.count || 0,
      priceStats: priceStats[0] || {},
      stockStats: stockStats[0] || {},
      summary: {
        totalProducts: stockStats[0]?.totalProducts || 0,
        activeProducts: productsByStatus.find(item => item.status === 'active')?.count || 0,
        inactiveProducts: productsByStatus.find(item => item.status === 'inactive')?.count || 0,
        discontinuedProducts: productsByStatus.find(item => item.status === 'discontinued')?.count || 0,
        outOfStockProducts: stockStats[0]?.outOfStock || 0,
        lowStockProducts: lowStockProducts.length,
        featuredProducts: featuredProductsCount[0]?.count || 0
      }
    });

  } catch (error) {
    console.error('Error fetching product statistics:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
