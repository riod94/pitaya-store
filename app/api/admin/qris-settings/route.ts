import { NextRequest } from "next/server";
import { db, qrisSettings } from "@/drizzle/db/schema";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { desc, eq } from "drizzle-orm";
import { deleteImageKitFile } from "@/lib/imagekit";

// GET - Get QRIS settings (only one active setting)
export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const settings = await db
      .select()
      .from(qrisSettings)
      .where(eq(qrisSettings.isActive, true))
      .orderBy(desc(qrisSettings.createdAt))
      .limit(1);

    return createApiResponse(settings[0] || null);
  } catch (error) {
    console.error("Error fetching QRIS settings:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST - Create or update QRIS settings
export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const body = await request.json();
    const { merchantName, qrCodeImage, qrCodeImageId } = body;

    if (!merchantName || !qrCodeImage) {
      return createErrorResponse("Merchant name and QR code image are required", 400);
    }

    // Deactivate all existing settings
    await db
      .update(qrisSettings)
      .set({ isActive: false, updatedAt: new Date() });

    // Create new setting
    const [newSetting] = await db
      .insert(qrisSettings)
      .values({
        merchantName,
        qrCodeImage,
        qrCodeImageId,
        isActive: true,
      })
      .returning();

    return createApiResponse(newSetting, 201);
  } catch (error) {
    console.error("Error creating QRIS settings:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PUT - Update QRIS settings
export async function PUT(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const body = await request.json();
    const { id, merchantName, qrCodeImage, qrCodeImageId, oldImageId } = body;

    if (!id || !merchantName || !qrCodeImage) {
      return createErrorResponse("ID, merchant name, and QR code image are required", 400);
    }

    // Delete old image from ImageKit if new image is uploaded
    if (oldImageId && oldImageId !== qrCodeImageId) {
      try {
        await deleteImageKitFile(oldImageId);
      } catch (error) {
        console.error("Error deleting old image from ImageKit:", error);
        // Continue even if delete fails
      }
    }

    // Update setting
    const [updated] = await db
      .update(qrisSettings)
      .set({
        merchantName,
        qrCodeImage,
        qrCodeImageId,
        updatedAt: new Date(),
      })
      .where(eq(qrisSettings.id, id))
      .returning();

    if (!updated) {
      return createErrorResponse("QRIS setting not found", 404);
    }

    return createApiResponse(updated);
  } catch (error) {
    console.error("Error updating QRIS settings:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE - Delete QRIS settings
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return createErrorResponse("ID is required", 400);
    }

    // Get setting to delete image from ImageKit
    const [setting] = await db
      .select()
      .from(qrisSettings)
      .where(eq(qrisSettings.id, parseInt(id)));

    if (!setting) {
      return createErrorResponse("QRIS setting not found", 404);
    }

    // Delete image from ImageKit
    if (setting.qrCodeImageId) {
      try {
        await deleteImageKitFile(setting.qrCodeImageId);
      } catch (error) {
        console.error("Error deleting image from ImageKit:", error);
        // Continue even if delete fails
      }
    }

    // Delete setting from database
    await db.delete(qrisSettings).where(eq(qrisSettings.id, parseInt(id)));

    return createApiResponse({ success: true });
  } catch (error) {
    console.error("Error deleting QRIS settings:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
