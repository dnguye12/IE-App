import { db } from "@/db"
import { plans } from "@/db/schemas/plans"
import { users } from "@/db/schemas/users"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url)
        const username = searchParams.get("username")

        if(!username) {
            return new NextResponse("Username not found", {status: 400})
        }

        const [user] = await db.select().from(users).where(eq(users.username, username))

        if(!user) {
            return new NextResponse("User not found", {status: 404})
        }

        const plan = await db.select().from(plans).where(eq(plans.username, username))

        return NextResponse.json({plans: plan, personinfo: user})
    }catch(error) {
        console.log(error)
        return new NextResponse("Internal server error", {status: 500})
    }
}