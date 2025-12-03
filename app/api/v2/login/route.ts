import { db } from "@/db";
import { users } from "@/db/schemas/users";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { username, password } = body

    try {
        const checkUsername = await db.select().from(users).where(eq(users.username, username))

        if (checkUsername.length === 0) {
            return NextResponse.json(
                { code: 0, message: "user not existed, please create new one" },
                { status: 404 }
            )
        }

        for (let i = 0; i < checkUsername.length; i++) {
            const helper = checkUsername[i]

            if (helper.password === password) {
                return NextResponse.json({ ...helper, code: 1 })
            }
        }
        return NextResponse.json(
            { code: 0, message: "wrong password" },
            { status: 400 }
        )
    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}