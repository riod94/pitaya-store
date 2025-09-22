import { NextRequest } from "next/server";
import { db } from "@/drizzle/db/schema";
import { productVariants } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";

// DELETE: Delete all variants for a specific product
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

    // Delete all variants for the product
    await db
      .delete(productVariants)
      .where(eq(productVariants.productId, productId));

    return createApiResponse({
      message: 'Product variants deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product variants:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// GET: Get all variants for a specific product
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

    // Get all variants for the product
    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId));

    return createApiResponse({
      data: variants
    });

  } catch (error) {
    console.error('Error fetching product variants:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
