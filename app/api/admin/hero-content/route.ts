import { NextRequest } from "next/server";
import { db, heroContent } from "@/drizzle/db/schema";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { desc, eq } from "drizzle-orm";

// GET - Get all hero content
export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const content = await db
      .select()
      .from(heroContent)
      .where(eq(heroContent.isActive, true))
      .orderBy(desc(heroContent.sortOrder), desc(heroContent.createdAt));

    return createApiResponse(content);
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST - Create new hero content
export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const body = await request.json();
    const { title, subtitle, imageUrl, imageId, buttonText, buttonUrl } = body;

    if (!title || !subtitle) {
      return createErrorResponse("Title and subtitle are required", 400);
    }

    // Get max sort order
    const maxSort = await db
      .select({ sortOrder: heroContent.sortOrder })
      .from(heroContent)
      .orderBy(desc(heroContent.sortOrder))
      .limit(1);

    const nextSortOrder = (maxSort[0]?.sortOrder || 0) + 1;

    const [newContent] = await db
      .insert(heroContent)
      .values({
        title,
        subtitle,
        imageUrl,
        imageId,
        buttonText,
        buttonUrl,
        isActive: true,
        sortOrder: nextSortOrder,
      })
      .returning();

    return createApiResponse(newContent, 201);
  } catch (error) {
    console.error("Error creating hero content:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
