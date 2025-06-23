import { db } from "@/drizzle/db";
import { users } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ status: 'warning', message: "Full Name, email, and password is required" }, { status: 400 });
        }
        if (typeof name !== "string" || name.length < 3) {
            return NextResponse.json({ status: 'warning', message: "Full Name min 3 characters" }, { status: 400 });
        }

        // Cek email sudah terdaftar
        const existing = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
        if (existing) {
            return NextResponse.json({ status: 'warning', message: "Email is already register" }, { status: 400 });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert user baru
        const inserted = await db.insert(users).values({
            name,
            email,
            password: password_hash,
        }).returning();
        const user = inserted?.[0];
        if (!user) {
            return NextResponse.json({ status: 'error', message: "Failed to register user" }, { status: 500 });
        }
        // Jangan return password
        const { password: _, ...safeUser } = user;
        return NextResponse.json({ user: safeUser }, { status: 201 });
    } catch (err) {
        console.error("Register error", err);
        return NextResponse.json({ status: 'error', message: "Something went wrong" }, { status: 500 });
    }
}