import { NextRequest } from "next/server";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { db, bankAccounts } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";

// GET - Get single bank account by ID
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

    const [account] = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id));

    if (!account) {
      return createErrorResponse("Bank account not found", 404);
    }

    return createApiResponse(account);
  } catch (error) {
    console.error("Error fetching bank account", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PUT - Update bank account
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
    const [existingAccount] = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id));
    if (!existingAccount) {
      return createErrorResponse("Bank account not found", 404);
    }

    const updateData: any = {};
    if (payload.bankName !== undefined) updateData.bankName = payload.bankName;
    if (payload.accountNumber !== undefined) updateData.accountNumber = payload.accountNumber;
    if (payload.accountHolderName !== undefined) updateData.accountHolderName = payload.accountHolderName;
    if (payload.branch !== undefined) updateData.branch = payload.branch;
    if (payload.swiftCode !== undefined) updateData.swiftCode = payload.swiftCode;
    if (payload.logo !== undefined) updateData.logo = payload.logo;
    if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
    if (payload.sortOrder !== undefined) updateData.sortOrder = payload.sortOrder;

    const [updatedAccount] = await db
      .update(bankAccounts)
      .set(updateData)
      .where(eq(bankAccounts.id, id))
      .returning();

    return createApiResponse(updatedAccount);
  } catch (error) {
    console.error("Error updating bank account", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE - Delete bank account
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
    const [existingAccount] = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id));
    if (!existingAccount) {
      return createErrorResponse("Bank account not found", 404);
    }

    await db.delete(bankAccounts).where(eq(bankAccounts.id, id));

    return createApiResponse({ message: "Bank account deleted successfully" });
  } catch (error) {
    console.error("Error deleting bank account", error);
    return createErrorResponse("Internal server error", 500);
  }
}
