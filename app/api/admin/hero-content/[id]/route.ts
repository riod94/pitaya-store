import { NextRequest } from "next/server";
import { db, heroContent } from "@/drizzle/db/schema";
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

    const [content] = await db
      .select()
      .from(heroContent)
      .where(eq(heroContent.id, id))
      .limit(1);

    if (!content) {
      return createErrorResponse("Hero content not found", 404);
    }

    return createApiResponse(content);
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PUT - Update hero content
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
    const { title, subtitle, imageUrl, imageId, buttonText, buttonUrl, oldImageId } = body;

    if (!title || !subtitle) {
      return createErrorResponse("Title and subtitle are required", 400);
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

    // Update content
    const [updated] = await db
      .update(heroContent)
      .set({
        title,
        subtitle,
        imageUrl,
        imageId,
        buttonText,
        buttonUrl,
        updatedAt: new Date(),
      })
      .where(eq(heroContent.id, id))
      .returning();

    if (!updated) {
      return createErrorResponse("Hero content not found", 404);
    }

    return createApiResponse(updated);
  } catch (error) {
    console.error("Error updating hero content:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE - Delete hero content
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

    // Get content to delete image from ImageKit
    const [content] = await db
      .select()
      .from(heroContent)
      .where(eq(heroContent.id, id));

    if (!content) {
      return createErrorResponse("Hero content not found", 404);
    }

    // Delete image from ImageKit
    if (content.imageId) {
      try {
        await deleteImageKitFile(content.imageId);
      } catch (error) {
        console.error("Error deleting image from ImageKit:", error);
        // Continue even if delete fails
      }
    }

    // Delete content from database
    await db.delete(heroContent).where(eq(heroContent.id, id));

    return createApiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting hero content:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
