import "next-auth/jwt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/drizzle/db";
import { users, accounts, sessions, verificationTokens } from "@/drizzle/db/schema";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./services/session";
import { object, string } from "zod"

export const signInSchema = object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
})

export const authOptions = {
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    session: { strategy: "jwt" as const },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const { email, password } = await signInSchema.parseAsync(credentials)

                if (!email || !password) {
                    throw new Error("Email and password are required");
                }

                const user = await getUserByEmail(email);
                if (!user) throw new Error("Email not found");
                if (!user.password || typeof user.password !== "string") {
                    throw new Error("Invalid user");
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) throw new Error("Incorrect password");

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.profilePictureUrl,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: any }) {
            if (user) {
                token.accessToken = user.accessToken || undefined;
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user = {
                ...(session.user || {}),
                id: token.id as string,
                role: token.role as string,
            };
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: { id: string; name?: string; email?: string; role?: string; avatar?: string };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        id?: string;
        role?: string;
    }
}