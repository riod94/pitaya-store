import { auth } from "@/auth";
import { NextRequest } from "next/server";

export async function validateAdminAccess() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      isValid: false,
      error: "Unauthorized - No session found",
      status: 401
    };
  }

  const userRole = session.user.role;
  
  if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
    return {
      isValid: false,
      error: "Forbidden - Admin access required",
      status: 403
    };
  }

  return {
    isValid: true,
    user: session.user,
    role: userRole
  };
}

export function createApiResponse(data: any, status: number = 200) {
  return Response.json(data, { status });
}

export function createErrorResponse(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}
