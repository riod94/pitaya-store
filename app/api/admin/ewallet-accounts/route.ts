import { NextRequest } from "next/server";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { db, ewalletAccounts } from "@/drizzle/db/schema";
import { eq, asc } from "drizzle-orm";

// GET - List all e-wallet accounts
export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const accounts = await db.select().from(ewalletAccounts).orderBy(asc(ewalletAccounts.sortOrder));
    
    return createApiResponse(accounts);
  } catch (error) {
    console.error("Error fetching e-wallet accounts", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST - Create new e-wallet account
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

    if (!payload.provider || !payload.accountNumber || !payload.accountHolderName) {
      return createErrorResponse("Provider, account number, and account holder name are required", 400);
    }

    const [newAccount] = await db.insert(ewalletAccounts).values({
      provider: payload.provider,
      accountNumber: payload.accountNumber,
      accountHolderName: payload.accountHolderName,
      logo: payload.logo || null,
      qrCode: payload.qrCode || null,
      isActive: payload.isActive ?? true,
      sortOrder: payload.sortOrder ?? 0,
    }).returning();

    return createApiResponse(newAccount, 201);
  } catch (error) {
    console.error("Error creating e-wallet account", error);
    return createErrorResponse("Internal server error", 500);
  }
}
