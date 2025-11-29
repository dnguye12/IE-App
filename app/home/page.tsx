import HomeHeader from "./components/HomeHeader";
import HomeBody from "./components/HomeBody";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const Page = async () => {
    const username = await getCurrentUser()

    if (!username) {
        redirect("/login")
    }

    return (
        <div className="flex flex-col min-h-screen overflow-hidden max-w-md md:max-w-5xl mx-auto">
            <HomeHeader />
            <HomeBody username={username} />
        </div>
    );
}

export default Page;