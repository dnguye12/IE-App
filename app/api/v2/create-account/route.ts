import { db } from "@/db"
import { users } from "@/db/schemas/users"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { username, password, sign } = body

    try {
        const existingUser = await db.select().from(users).where(eq(users.username, username))

        if (existingUser.length > 0) {
            return NextResponse.json(
                { code: 0, message: "repeat username" },
                { status: 400 }
            )
        } else {
            const [savedUser] = await db.insert(users).values({
                username,
                password,
                sign,
            }).returning()

            return NextResponse.json({ ...savedUser, code: 4 })
        }
    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}