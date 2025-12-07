import { db } from "@/db";
import { plans } from "@/db/schemas/plans";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json()
    const { planId } = body
    try {
        await db.delete(plans).where(
            and(
                eq(plans.id, planId)
            )
        )
         return new NextResponse("Delete successfully", { status: 203 })
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}