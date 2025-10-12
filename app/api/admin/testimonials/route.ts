import { NextRequest } from "next/server";
import { db, testimonials } from "@/drizzle/db/schema";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { desc, eq } from "drizzle-orm";

// GET - Get all testimonials
export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const testimonialList = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(desc(testimonials.sortOrder), desc(testimonials.createdAt));

    return createApiResponse(testimonialList);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const body = await request.json();
    const { name, role, company, content, imageUrl, imageId, rating } = body;

    if (!name || !content) {
      return createErrorResponse("Name and content are required", 400);
    }

    // Get max sort order
    const maxSort = await db
      .select({ sortOrder: testimonials.sortOrder })
      .from(testimonials)
      .orderBy(desc(testimonials.sortOrder))
      .limit(1);

    const nextSortOrder = (maxSort[0]?.sortOrder || 0) + 1;

    const [newTestimonial] = await db
      .insert(testimonials)
      .values({
        name,
        role,
        company,
        content,
        imageUrl,
        imageId,
        rating: rating || 5,
        isActive: true,
        sortOrder: nextSortOrder,
      })
      .returning();

    return createApiResponse(newTestimonial, 201);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
