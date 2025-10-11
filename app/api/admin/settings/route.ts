import { NextRequest } from "next/server";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { SettingsService } from "@/services/settings";

const service = new SettingsService();

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const data = await service.getSettings();
    return createApiResponse(data);
  } catch (error) {
    console.error("Error fetching settings", error);
    return createErrorResponse("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest) {
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

    if (!payload || typeof payload !== "object") {
      return createErrorResponse("Invalid request body", 400);
    }

    await service.updateSettings({
      storeSettings: payload.storeSettings,
      siteSettings: payload.siteSettings,
      shippingProviders: payload.shippingProviders,
      paymentMethods: payload.paymentMethods
    });

    return createApiResponse({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings", error);
    return createErrorResponse("Internal server error", 500);
  }
}
