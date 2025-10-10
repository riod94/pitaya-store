import { NextRequest } from "next/server";
import { db } from "@/drizzle/db/schema";
import { productVariants } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";

// PUT: Update a specific product variant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const productId = parseInt(params.id);
    const variantId = parseInt(params.variantId);

    if (isNaN(productId) || isNaN(variantId)) {
      return createErrorResponse('Invalid product ID or variant ID', 400);
    }

    const body = await request.json();

    // Validasi required fields
    const requiredFields = ['sku', 'name'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return createErrorResponse(`Field ${field} is required`, 400);
      }
    }

    // Check if variant exists and belongs to the product
    const existingVariant = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.id, variantId))
      .limit(1);

    if (existingVariant.length === 0) {
      return createErrorResponse('Variant not found', 404);
    }

    if (existingVariant[0].productId !== productId) {
      return createErrorResponse('Variant does not belong to this product', 400);
    }

    // Check if SKU already exists for another variant
    if (body.sku !== existingVariant[0].sku) {
      const existingSku = await db
        .select({ id: productVariants.id })
        .from(productVariants)
        .where(eq(productVariants.sku, body.sku))
        .limit(1);

      if (existingSku.length > 0) {
        return createErrorResponse('Variant SKU already exists', 409);
      }
    }

    // Update variant
    const updatedVariant = await db
      .update(productVariants)
      .set({
        sku: body.sku,
        name: body.name,
        attributes: body.attributes || existingVariant[0].attributes,
        costPrice: body.costPrice || existingVariant[0].costPrice,
        hpp: body.hpp || existingVariant[0].hpp,
        sellingPrice: body.sellingPrice || existingVariant[0].sellingPrice,
        stockQuantity: body.stockQuantity ?? existingVariant[0].stockQuantity,
        weight: body.weight || existingVariant[0].weight,
        images: body.images || existingVariant[0].images,
        thumbnailUrl: body.thumbnailUrl || existingVariant[0].thumbnailUrl,
        isActive: body.isActive !== undefined ? body.isActive : existingVariant[0].isActive,
        updatedAt: new Date()
      })
      .where(eq(productVariants.id, variantId))
      .returning();

    return createApiResponse({
      message: 'Product variant updated successfully',
      data: updatedVariant[0]
    });

  } catch (error) {
    console.error('Error updating product variant:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// DELETE: Delete a specific product variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const productId = parseInt(params.id);
    const variantId = parseInt(params.variantId);

    if (isNaN(productId) || isNaN(variantId)) {
      return createErrorResponse('Invalid product ID or variant ID', 400);
    }

    // Check if variant exists and belongs to the product
    const existingVariant = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.id, variantId))
      .limit(1);

    if (existingVariant.length === 0) {
      return createErrorResponse('Variant not found', 404);
    }

    if (existingVariant[0].productId !== productId) {
      return createErrorResponse('Variant does not belong to this product', 400);
    }

    // Delete variant
    await db
      .delete(productVariants)
      .where(eq(productVariants.id, variantId));

    return createApiResponse({
      message: 'Product variant deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product variant:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
