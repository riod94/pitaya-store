import { NextRequest } from "next/server";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { db, shippingZones } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";

// GET - List all shipping zones
export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const zones = await db.select().from(shippingZones);
    
    return createApiResponse(zones.map(zone => ({
      id: zone.id,
      name: zone.name,
      description: zone.description,
      area: Array.isArray(zone.area) ? zone.area : [],
      isActive: zone.isActive,
    })));
  } catch (error) {
    console.error("Error fetching shipping zones", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST - Create new shipping zone
export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    let payload: any;
    try {
      payload = await request.json();
    } catch (error) {
      return createErrorResponse("Invalid JSON payload", 400);
    }

    if (!payload.name || !payload.area || !Array.isArray(payload.area)) {
      return createErrorResponse("Name and area (array) are required", 400);
    }

    const [newZone] = await db.insert(shippingZones).values({
      name: payload.name,
      description: payload.description || null,
      area: payload.area,
      isActive: payload.isActive ?? true,
    }).returning();

    return createApiResponse(newZone, 201);
  } catch (error) {
    console.error("Error creating shipping zone", error);
    return createErrorResponse("Internal server error", 500);
  }
}
