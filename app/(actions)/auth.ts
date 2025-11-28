"use server"

import { cookies } from "next/headers";

const SESSION_COOKIE = "session_user_id";

export async function login(username: string) {
    (await cookies()).set({
        name: SESSION_COOKIE,
        value: username,
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    })

    return {
        ok: true as const,
        username
    }
}

export async function logout() {
    (await cookies()).set({
        name: SESSION_COOKIE,
        value: "",
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 0,
    })

    return { ok: true as const }
}