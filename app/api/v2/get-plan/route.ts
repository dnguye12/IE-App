import { db } from "@/db";
import { plans } from "@/db/schemas/plans";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")
    const planname = searchParams.get("planname")

    if (!username || !planname) {
        return new NextResponse("Username not found", { status: 400 })
    }

    try {
        const [res] = await db.select().from(plans).where(
            and(
                eq(plans.username, username),
                eq(plans.planname, planname)
            )
        )

        return NextResponse.json(res)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}