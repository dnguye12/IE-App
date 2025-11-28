import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { username, password, sign } = body
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/create-account`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                sign
            }),
        })

        const data2 = await data.json()

        return NextResponse.json(data2)
    } catch (error) {
        console.log(error)
    }
}