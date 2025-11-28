import { getCurrentUser } from "@/lib/session";
import HomeHeader from "../components/HomeHeader";
import { redirect } from "next/navigation";
import AccountForm from "./components/AccountForm";

const Page = async () => {
    const username = await getCurrentUser()

    if (!username) {
        redirect("/login")
    }
    return (
        <div className="flex flex-col min-h-screen overflow-hidden max-w-md mx-auto">
            <HomeHeader />
            <AccountForm username={username}/>
        </div>
    );
}

export default Page;