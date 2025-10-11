import { NextRequest } from "next/server";
import { validateAdminAccess, createApiResponse, createErrorResponse } from "@/lib/auth-admin";
import { db, bankAccounts } from "@/drizzle/db/schema";
import { eq, asc } from "drizzle-orm";

// GET - List all bank accounts
export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return createErrorResponse(authResult.error || "Unauthorized", authResult.status || 401);
    }

    const accounts = await db.select().from(bankAccounts).orderBy(asc(bankAccounts.sortOrder));
    
    return createApiResponse(accounts);
  } catch (error) {
    console.error("Error fetching bank accounts", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST - Create new bank account
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

    if (!payload.bankName || !payload.accountNumber || !payload.accountHolderName) {
      return createErrorResponse("Bank name, account number, and account holder name are required", 400);
    }

    const [newAccount] = await db.insert(bankAccounts).values({
      bankName: payload.bankName,
      accountNumber: payload.accountNumber,
      accountHolderName: payload.accountHolderName,
      branch: payload.branch || null,
      swiftCode: payload.swiftCode || null,
      logo: payload.logo || null,
      isActive: payload.isActive ?? true,
      sortOrder: payload.sortOrder ?? 0,
    }).returning();

    return createApiResponse(newAccount, 201);
  } catch (error) {
    console.error("Error creating bank account", error);
    return createErrorResponse("Internal server error", 500);
  }
}
