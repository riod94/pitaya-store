import { NextRequest } from "next/server";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { db, shippingZones } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";

// GET - Get single shipping zone by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse("Invalid ID", 400);
    }

    const [zone] = await db.select().from(shippingZones).where(eq(shippingZones.id, id));

    if (!zone) {
      return createErrorResponse("Shipping zone not found", 404);
    }

    return createApiResponse({
      id: zone.id,
      name: zone.name,
      description: zone.description,
      area: Array.isArray(zone.area) ? zone.area : [],
      isActive: zone.isActive,
    });
  } catch (error) {
    console.error("Error fetching shipping zone", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PUT - Update shipping zone
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse("Invalid ID", 400);
    }

    let payload: any;
    try {
      payload = await request.json();
    } catch (error) {
      return createErrorResponse("Invalid JSON payload", 400);
    }

    // Check if zone exists
    const [existingZone] = await db.select().from(shippingZones).where(eq(shippingZones.id, id));
    if (!existingZone) {
      return createErrorResponse("Shipping zone not found", 404);
    }

    const updateData: any = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.area !== undefined && Array.isArray(payload.area)) updateData.area = payload.area;
    if (payload.isActive !== undefined) updateData.isActive = payload.isActive;

    const [updatedZone] = await db
      .update(shippingZones)
      .set(updateData)
      .where(eq(shippingZones.id, id))
      .returning();

    return createApiResponse(updatedZone);
  } catch (error) {
    console.error("Error updating shipping zone", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE - Delete shipping zone
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse("Invalid ID", 400);
    }

    // Check if zone exists
    const [existingZone] = await db.select().from(shippingZones).where(eq(shippingZones.id, id));
    if (!existingZone) {
      return createErrorResponse("Shipping zone not found", 404);
    }

    await db.delete(shippingZones).where(eq(shippingZones.id, id));

    return createApiResponse({ message: "Shipping zone deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipping zone", error);
    return createErrorResponse("Internal server error", 500);
  }
}
