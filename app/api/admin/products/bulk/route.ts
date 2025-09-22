import { NextRequest } from "next/server";
import { db } from "@/drizzle/db/schema";
import { products } from "@/drizzle/db/schema";
import { inArray, eq } from "drizzle-orm";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";

// POST: Bulk delete or bulk update stock
export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const body = await request.json();

    const { action, productIds, stockUpdate } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return createErrorResponse("No product IDs provided", 400);
    }

    if (action === "delete") {
      // Bulk delete products
      await db.delete(products).where(inArray(products.id, productIds));
      return createApiResponse({ message: `Deleted ${productIds.length} products` });
    } else if (action === "updateStock") {
      if (typeof stockUpdate !== "number") {
        return createErrorResponse("Invalid stock update value", 400);
      }
      // Bulk update stockQuantity for products
      for (const id of productIds) {
        await db.update(products).set({ stockQuantity: stockUpdate }).where(eq(products.id, id));
      }
      return createApiResponse({ message: `Updated stock for ${productIds.length} products` });
    } else {
      return createErrorResponse("Invalid action", 400);
    }
  } catch (error) {
    console.error("Error in bulk product operation:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST: Import products (CSV or JSON)
export async function PUT(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const body = await request.json();

    const { products: importProducts } = body;

    if (!Array.isArray(importProducts) || importProducts.length === 0) {
      return createErrorResponse("No products to import", 400);
    }

    // TODO: Validate and insert products and variants
    // For simplicity, insert products one by one
    const insertedProducts = [];
    for (const prod of importProducts) {
      // Basic validation
      if (!prod.sku || !prod.name || !prod.slug) {
        continue; // skip invalid
      }
      // Check SKU and slug uniqueness can be added here

      const inserted = await db.insert(products).values({
        sku: prod.sku,
        name: prod.name,
        slug: prod.slug,
        description: prod.description || null,
        shortDescription: prod.shortDescription || null,
        categoryId: prod.categoryId || null,
        unitId: prod.unitId || null,
        costPrice: prod.costPrice || 0,
        hpp: prod.hpp || 0,
        sellingPrice: prod.sellingPrice || 0,
        weight: prod.weight || null,
        dimensions: prod.dimensions || null,
        stockQuantity: prod.stockQuantity || 0,
        minStockLevel: prod.minStockLevel || 0,
        maxStockLevel: prod.maxStockLevel || null,
        images: prod.images || [],
        thumbnailUrl: prod.thumbnailUrl || null,
        status: prod.status || "active",
        isTrackingStock: prod.isTrackingStock !== undefined ? prod.isTrackingStock : true,
        allowBackorder: prod.allowBackorder !== undefined ? prod.allowBackorder : false,
        featured: prod.featured !== undefined ? prod.featured : false,
        metaTitle: prod.metaTitle || null,
        metaDescription: prod.metaDescription || null,
        metaKeywords: prod.metaKeywords || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      insertedProducts.push(inserted[0]);
    }

    return createApiResponse({
      message: `Imported ${insertedProducts.length} products`,
      data: insertedProducts,
    });
  } catch (error) {
    console.error("Error importing products:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
