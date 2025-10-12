import { NextRequest } from "next/server";
import { db, testimonials } from "@/drizzle/db/schema";
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

    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1);

    if (!testimonial) {
      return createErrorResponse("Testimonial not found", 404);
    }

    return createApiResponse(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PUT - Update testimonial
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
    const { name, role, company, content, imageUrl, imageId, rating, oldImageId } = body;

    if (!name || !content) {
      return createErrorResponse("Name and content are required", 400);
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

    // Update testimonial
    const [updated] = await db
      .update(testimonials)
      .set({
        name,
        role,
        company,
        content,
        imageUrl,
        imageId,
        rating,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, id))
      .returning();

    if (!updated) {
      return createErrorResponse("Testimonial not found", 404);
    }

    return createApiResponse(updated);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE - Delete testimonial
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

    // Get testimonial to delete image from ImageKit
    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id));

    if (!testimonial) {
      return createErrorResponse("Testimonial not found", 404);
    }

    // Delete image from ImageKit
    if (testimonial.imageId) {
      try {
        await deleteImageKitFile(testimonial.imageId);
      } catch (error) {
        console.error("Error deleting image from ImageKit:", error);
        // Continue even if delete fails
      }
    }

    // Delete testimonial from database
    await db.delete(testimonials).where(eq(testimonials.id, id));

    return createApiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
