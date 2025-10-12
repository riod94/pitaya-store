import { NextRequest } from "next/server";
import { db, banners } from "@/drizzle/db/schema";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { desc, eq } from "drizzle-orm";

// GET - Get all banners
export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const bannerList = await db
      .select()
      .from(banners)
      .where(eq(banners.isActive, true))
      .orderBy(desc(banners.sortOrder), desc(banners.createdAt));

    return createApiResponse(bannerList);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST - Create new banner
export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const body = await request.json();
    const { title, description, imageUrl, imageId, buttonText, buttonUrl, startDate, endDate } = body;

    if (!title || !imageUrl) {
      return createErrorResponse("Title and image are required", 400);
    }

    // Get max sort order
    const maxSort = await db
      .select({ sortOrder: banners.sortOrder })
      .from(banners)
      .orderBy(desc(banners.sortOrder))
      .limit(1);

    const nextSortOrder = (maxSort[0]?.sortOrder || 0) + 1;

    const [newBanner] = await db
      .insert(banners)
      .values({
        title,
        description,
        imageUrl,
        imageId,
        buttonText,
        buttonUrl,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
        sortOrder: nextSortOrder,
      })
      .returning();

    return createApiResponse(newBanner, 201);
  } catch (error) {
    console.error("Error creating banner:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
