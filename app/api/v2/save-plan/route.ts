/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { plans } from "@/db/schemas/plans";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { username, planname, dr, result } = body

    try {
        const [res] = await db.insert(plans).values({
            username,
            planname,
            dr,
            result
        }).returning()

        return NextResponse.json(res)
    } catch (error: any) {
        const cause = error.cause as any;
        if (cause?.code === "23505") {
            return NextResponse.json({message:"Duplicate entry"}, { status: 409 });
        }

        return NextResponse.json({message: 'Internal Server Error'}, { status: 500 })
    }
}