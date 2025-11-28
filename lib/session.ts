import { cookies } from "next/headers";

const SESSION_COOKIE = "session_user_id";

export const getCurrentUser = async() => {
    const username = (await cookies()).get(SESSION_COOKIE)

    if(!username?.value) {
        return null
    }

    return username.value
}