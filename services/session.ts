import { db } from "@/drizzle/db";
import { users } from "@/drizzle/db/schema";
import { eq, and } from "drizzle-orm";

export async function getUserFromDb(email: string, pwHash: string) {
    const result = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.password, pwHash)))
        .limit(1);

    if (result.length === 0) return null;
    const user = result[0];
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (result.length === 0) return null;
  return result[0];
}