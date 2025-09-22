import { NextRequest } from "next/server";
import { db } from "@/drizzle/db/schema";
import { productVariants } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";

// POST: Create a new product variant
export async function POST(request: NextRequest) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const body = await request.json();

    // Validasi required fields
    const requiredFields = ['productId', 'sku', 'name'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return createErrorResponse(`Field ${field} is required`, 400);
      }
    }

    // Check if SKU already exists
    const existingSku = await db
      .select({ id: productVariants.id })
      .from(productVariants)
      .where(eq(productVariants.sku, body.sku))
      .limit(1);

    if (existingSku.length > 0) {
      return createErrorResponse('Variant SKU already exists', 409);
    }

    // Create new variant
    const newVariant = await db.insert(productVariants).values({
      productId: body.productId,
      sku: body.sku,
      name: body.name,
      attributes: body.attributes || {},
      costPrice: body.costPrice || null,
      hpp: body.hpp || null,
      sellingPrice: body.sellingPrice || null,
      stockQuantity: body.stockQuantity || 0,
      weight: body.weight || null,
      images: body.images || [],
      thumbnailUrl: body.thumbnailUrl || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return createApiResponse({
      message: 'Product variant created successfully',
      data: newVariant[0]
    }, 201);

  } catch (error) {
    console.error('Error creating product variant:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
