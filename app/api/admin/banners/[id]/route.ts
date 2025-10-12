import { NextRequest } from "next/server";
import { db, banners } from "@/drizzle/db/schema";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { eq } from "drizzle-orm";
import { deleteImageKitFile } from "@/lib/imagekit";

// GET by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse("Invalid ID", 400);
    }

    const [banner] = await db
      .select()
      .from(banners)
      .where(eq(banners.id, id))
      .limit(1);

    if (!banner) {
      return createErrorResponse("Banner not found", 404);
    }

    return createApiResponse(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PUT - Update banner
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse("Invalid ID", 400);
    }

    const body = await request.json();
    const { title, description, imageUrl, imageId, buttonText, buttonUrl, startDate, endDate, oldImageId } = body;

    if (!title || !imageUrl) {
      return createErrorResponse("Title and image are required", 400);
    }

    // Delete old image from ImageKit if new image is uploaded
    if (oldImageId && oldImageId !== imageId) {
      try {
        await deleteImageKitFile(oldImageId);
      } catch (error) {
        console.error("Error deleting old image from ImageKit:", error);
        // Continue even if delete fails
      }
    }

    // Update banner
    const [updated] = await db
      .update(banners)
      .set({
        title,
        description,
        imageUrl,
        imageId,
        buttonText,
        buttonUrl,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(banners.id, id))
      .returning();

    if (!updated) {
      return createErrorResponse("Banner not found", 404);
    }

    return createApiResponse(updated);
  } catch (error) {
    console.error("Error updating banner:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE - Delete banner
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse("Invalid ID", 400);
    }

    // Get banner to delete image from ImageKit
    const [banner] = await db
      .select()
      .from(banners)
      .where(eq(banners.id, id));

    if (!banner) {
      return createErrorResponse("Banner not found", 404);
    }

    // Delete image from ImageKit
    if (banner.imageId) {
      try {
        await deleteImageKitFile(banner.imageId);
      } catch (error) {
        console.error("Error deleting image from ImageKit:", error);
        // Continue even if delete fails
      }
    }

    // Delete banner from database
    await db.delete(banners).where(eq(banners.id, id));

    return createApiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
