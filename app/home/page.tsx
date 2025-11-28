import HomeHeader from "./components/HomeHeader";
import HomeBMI from "./components/HomeBMI";
import { Button } from "@/components/ui/button";
import HomePlans from "./components/HomePlans";


const Page = () => {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden max-w-md mx-auto">
            <HomeHeader />
            <div className="flex-1 flex flex-col p-8 gap-12">
                <section>
                    <h2 className="home-label mb-4">Generate New Plan</h2>
                    <Button variant={"green"} size={"lg"} className="font-semibold h-14 w-full rounded-full mx-auto text-lg">Generate</Button>
                </section>
                <HomePlans />
                <HomeBMI />
            </div>
        </div>
    );
}

export default Page;