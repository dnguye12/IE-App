"use client"

import { logout } from "@/app/(actions)/auth";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

const LogoutButton = () => {
    const handleLogout = async () => {
        const res = await logout()
        if (res?.ok) {
            redirect("/login")
        }
    }

    return (
        <Button onClick={handleLogout} variant={"destructive"}>Logout</Button>
    );
}

export default LogoutButton;