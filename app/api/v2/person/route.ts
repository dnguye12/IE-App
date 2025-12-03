import { db } from "@/db";
import { users } from "@/db/schemas/users";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    const body = await req.json()
    const { username, age, gender, weight, height } = body

    try {
        const [user] = await db.update(users).set({
            age,
            gender,
            weight,
            height
        }).where(eq(users.username, username)).returning()

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}