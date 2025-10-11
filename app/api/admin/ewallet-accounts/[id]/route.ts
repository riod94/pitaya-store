import { NextRequest } from "next/server";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { db, ewalletAccounts } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";

// GET - Get single e-wallet account by ID
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

    const [account] = await db.select().from(ewalletAccounts).where(eq(ewalletAccounts.id, id));

    if (!account) {
      return createErrorResponse("E-wallet account not found", 404);
    }

    return createApiResponse(account);
  } catch (error) {
    console.error("Error fetching e-wallet account", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PUT - Update e-wallet account
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

    // Check if account exists
    const [existingAccount] = await db.select().from(ewalletAccounts).where(eq(ewalletAccounts.id, id));
    if (!existingAccount) {
      return createErrorResponse("E-wallet account not found", 404);
    }

    const updateData: any = {};
    if (payload.provider !== undefined) updateData.provider = payload.provider;
    if (payload.accountNumber !== undefined) updateData.accountNumber = payload.accountNumber;
    if (payload.accountHolderName !== undefined) updateData.accountHolderName = payload.accountHolderName;
    if (payload.logo !== undefined) updateData.logo = payload.logo;
    if (payload.qrCode !== undefined) updateData.qrCode = payload.qrCode;
    if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
    if (payload.sortOrder !== undefined) updateData.sortOrder = payload.sortOrder;

    const [updatedAccount] = await db
      .update(ewalletAccounts)
      .set(updateData)
      .where(eq(ewalletAccounts.id, id))
      .returning();

    return createApiResponse(updatedAccount);
  } catch (error) {
    console.error("Error updating e-wallet account", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE - Delete e-wallet account
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

    // Check if account exists
    const [existingAccount] = await db.select().from(ewalletAccounts).where(eq(ewalletAccounts.id, id));
    if (!existingAccount) {
      return createErrorResponse("E-wallet account not found", 404);
    }

    await db.delete(ewalletAccounts).where(eq(ewalletAccounts.id, id));

    return createApiResponse({ message: "E-wallet account deleted successfully" });
  } catch (error) {
    console.error("Error deleting e-wallet account", error);
    return createErrorResponse("Internal server error", 500);
  }
}
