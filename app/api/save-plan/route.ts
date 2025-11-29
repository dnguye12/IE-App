import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { username, planname, request, result } = body

    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/save-plan`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                planname,
                dr: request,
                result
            })
        })

        const data2 = await data.json()

        return NextResponse.json(data2)
    } catch (error) {
        console.log(error)
    }
}