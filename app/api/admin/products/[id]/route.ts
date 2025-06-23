import { NextRequest } from "next/server";
import { db } from "@/drizzle/db/schema";
import { products, categories, units } from "@/drizzle/db/schema";
import { eq, and } from "drizzle-orm";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";

// GET: Mengambil detail product berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return createErrorResponse('Invalid product ID', 400);
    }

    // Query product dengan join ke categories dan units
    const result = await db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        costPrice: products.costPrice,
        hpp: products.hpp,
        sellingPrice: products.sellingPrice,
        weight: products.weight,
        dimensions: products.dimensions,
        stockQuantity: products.stockQuantity,
        minStockLevel: products.minStockLevel,
        maxStockLevel: products.maxStockLevel,
        images: products.images,
        thumbnailUrl: products.thumbnailUrl,
        status: products.status,
        isTrackingStock: products.isTrackingStock,
        allowBackorder: products.allowBackorder,
        featured: products.featured,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        metaKeywords: products.metaKeywords,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug
        },
        unit: {
          id: units.id,
          name: units.name,
          symbol: units.symbol
        }
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(units, eq(products.unitId, units.id))
      .where(eq(products.id, productId))
      .limit(1);

    if (result.length === 0) {
      return createErrorResponse('Product not found', 404);
    }

    return createApiResponse({
      data: result[0]
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// PUT: Update product berdasarkan ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return createErrorResponse('Invalid product ID', 400);
    }

    const body = await request.json();

    // Check if product exists
    const existingProduct = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return createErrorResponse('Product not found', 404);
    }

    // Validasi required fields jika ada
    if (body.sku !== undefined && !body.sku) {
      return createErrorResponse('SKU cannot be empty', 400);
    }
    if (body.name !== undefined && !body.name) {
      return createErrorResponse('Name cannot be empty', 400);
    }
    if (body.slug !== undefined && !body.slug) {
      return createErrorResponse('Slug cannot be empty', 400);
    }

    // Check if SKU already exists (excluding current product)
    if (body.sku) {
      const existingSku = await db
        .select({ id: products.id })
        .from(products)
        .where(and(
          eq(products.sku, body.sku),
          eq(products.id, productId)
        ))
        .limit(1);

      if (existingSku.length === 0) {
        const skuExists = await db
          .select({ id: products.id })
          .from(products)
          .where(eq(products.sku, body.sku))
          .limit(1);

        if (skuExists.length > 0) {
          return createErrorResponse('SKU already exists', 409);
        }
      }
    }

    // Check if slug already exists (excluding current product)
    if (body.slug) {
      const existingSlug = await db
        .select({ id: products.id })
        .from(products)
        .where(and(
          eq(products.slug, body.slug),
          eq(products.id, productId)
        ))
        .limit(1);

      if (existingSlug.length === 0) {
        const slugExists = await db
          .select({ id: products.id })
          .from(products)
          .where(eq(products.slug, body.slug))
          .limit(1);

        if (slugExists.length > 0) {
          return createErrorResponse('Slug already exists', 409);
        }
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    // Only update fields that are provided
    const allowedFields = [
      'sku', 'name', 'slug', 'description', 'shortDescription', 'categoryId', 'unitId',
      'costPrice', 'hpp', 'sellingPrice', 'weight', 'dimensions', 'stockQuantity',
      'minStockLevel', 'maxStockLevel', 'images', 'thumbnailUrl', 'status',
      'isTrackingStock', 'allowBackorder', 'featured', 'metaTitle', 'metaDescription', 'metaKeywords'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Update product
    const updatedProduct = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();

    return createApiResponse({
      message: 'Product updated successfully',
      data: updatedProduct[0]
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// DELETE: Hapus product berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return createErrorResponse('Invalid product ID', 400);
    }

    // Check if product exists
    const existingProduct = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return createErrorResponse('Product not found', 404);
    }

    // TODO: Check if product is used in orders (if you want to prevent deletion)
    // This is optional - you might want to implement soft delete instead

    // Delete product
    await db
      .delete(products)
      .where(eq(products.id, productId));

    return createApiResponse({
      message: `Product "${existingProduct[0].name}" deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
