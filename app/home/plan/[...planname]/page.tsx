import { getCurrentUser } from "@/lib/session";
import HomeHeader from "../../components/HomeHeader";
import { redirect } from "next/navigation";

const Page = async ({params}: {params: Promise<{planname: string}>}) => {
    const username = await getCurrentUser()
    const {planname} = await params

    if (!username) {
        redirect("/login")
    }
    return (
        <div className="flex flex-col min-h-screen overflow-hidden max-w-md mx-auto">
            <HomeHeader />
        </div>
    );
}

export default Page;