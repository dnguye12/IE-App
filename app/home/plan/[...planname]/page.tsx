import { getCurrentUser } from "@/lib/session";
import HomeHeader from "../../components/HomeHeader";
import { redirect } from "next/navigation";
import EditForm from "./components/EditForm";

const Page = async ({params}: {params: Promise<{planname: string}>}) => {
    const username = await getCurrentUser()
    let {planname} = await params
    planname = planname[0]

    if (!username) {
        redirect("/login")
    }

    return (
        <div className="flex flex-col min-h-screen overflow-hidden max-w-md mx-auto">
            <HomeHeader />
            <EditForm planname={planname} username={username}/>
        </div>
    );
}

export default Page;