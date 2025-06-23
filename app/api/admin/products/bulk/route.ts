import { NextRequest } from "next/server";
import { db } from "@/drizzle/db/schema";
import { products } from "@/drizzle/db/schema";
import { eq, inArray } from "drizzle-orm";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";

// POST: Bulk operations untuk products
export async function POST(request: NextRequest) {
  try {
    // Validasi admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error!, authResult.status!);
    }

    const body = await request.json();
    const { action, productIds } = body;

    if (!action || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return createErrorResponse('Action and productIds are required', 400);
    }

    // Validate productIds are numbers
    const validProductIds = productIds.filter(id => !isNaN(parseInt(id))).map(id => parseInt(id));
    if (validProductIds.length === 0) {
      return createErrorResponse('No valid product IDs provided', 400);
    }

    switch (action) {
      case 'delete':
        return await bulkDelete(validProductIds);
      
      case 'updateStatus':
        const { status } = body;
        if (!status || !['active', 'inactive', 'discontinued'].includes(status)) {
          return createErrorResponse('Valid status is required for status update', 400);
        }
        return await bulkUpdateStatus(validProductIds, status);
      
      case 'updateFeatured':
        const { featured } = body;
        if (featured === undefined) {
          return createErrorResponse('Featured value is required', 400);
        }
        return await bulkUpdateFeatured(validProductIds, Boolean(featured));
      
      case 'updateStock':
        const { stockQuantity } = body;
        if (stockQuantity === undefined || isNaN(parseInt(stockQuantity))) {
          return createErrorResponse('Valid stock quantity is required', 400);
        }
        return await bulkUpdateStock(validProductIds, parseInt(stockQuantity));
      
      default:
        return createErrorResponse('Invalid action. Supported actions: delete, updateStatus, updateFeatured, updateStock', 400);
    }

  } catch (error) {
    console.error('Error in bulk operation:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

async function bulkDelete(productIds: number[]) {
  try {
    // Check which products exist
    const existingProducts = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(inArray(products.id, productIds));

    if (existingProducts.length === 0) {
      return createErrorResponse('No products found with provided IDs', 404);
    }

    // Delete products
    const deletedProducts = await db
      .delete(products)
      .where(inArray(products.id, existingProducts.map(p => p.id)))
      .returning({ id: products.id, name: products.name });

    return createApiResponse({
      message: `Successfully deleted ${deletedProducts.length} product(s)`,
      deletedProducts: deletedProducts,
      notFound: productIds.length - deletedProducts.length
    });

  } catch (error) {
    console.error('Error in bulk delete:', error);
    throw error;
  }
}

async function bulkUpdateStatus(productIds: number[], status: string) {
  try {
    // Check which products exist
    const existingProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.id, productIds));

    if (existingProducts.length === 0) {
      return createErrorResponse('No products found with provided IDs', 404);
    }

    // Update status
    const updatedProducts = await db
      .update(products)
      .set({ 
        status: status as any,
        updatedAt: new Date()
      })
      .where(inArray(products.id, existingProducts.map(p => p.id)))
      .returning({ id: products.id, name: products.name, status: products.status });

    return createApiResponse({
      message: `Successfully updated status to "${status}" for ${updatedProducts.length} product(s)`,
      updatedProducts: updatedProducts,
      notFound: productIds.length - updatedProducts.length
    });

  } catch (error) {
    console.error('Error in bulk status update:', error);
    throw error;
  }
}

async function bulkUpdateFeatured(productIds: number[], featured: boolean) {
  try {
    // Check which products exist
    const existingProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.id, productIds));

    if (existingProducts.length === 0) {
      return createErrorResponse('No products found with provided IDs', 404);
    }

    // Update featured status
    const updatedProducts = await db
      .update(products)
      .set({ 
        featured: featured,
        updatedAt: new Date()
      })
      .where(inArray(products.id, existingProducts.map(p => p.id)))
      .returning({ id: products.id, name: products.name, featured: products.featured });

    return createApiResponse({
      message: `Successfully updated featured status to "${featured}" for ${updatedProducts.length} product(s)`,
      updatedProducts: updatedProducts,
      notFound: productIds.length - updatedProducts.length
    });

  } catch (error) {
    console.error('Error in bulk featured update:', error);
    throw error;
  }
}

async function bulkUpdateStock(productIds: number[], stockQuantity: number) {
  try {
    // Check which products exist
    const existingProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.id, productIds));

    if (existingProducts.length === 0) {
      return createErrorResponse('No products found with provided IDs', 404);
    }

    // Update stock quantity
    const updatedProducts = await db
      .update(products)
      .set({ 
        stockQuantity: stockQuantity,
        updatedAt: new Date()
      })
      .where(inArray(products.id, existingProducts.map(p => p.id)))
      .returning({ id: products.id, name: products.name, stockQuantity: products.stockQuantity });

    return createApiResponse({
      message: `Successfully updated stock quantity to ${stockQuantity} for ${updatedProducts.length} product(s)`,
      updatedProducts: updatedProducts,
      notFound: productIds.length - updatedProducts.length
    });

  } catch (error) {
    console.error('Error in bulk stock update:', error);
    throw error;
  }
}
