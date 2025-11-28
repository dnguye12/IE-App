import { Button } from "@/components/ui/button";
import Image from "next/image";

const HomePlans = () => {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="home-label">Your Plans</h2>
                <Button size={"sm"} variant={"green"}>Generate</Button>
            </div>
            <div className="flex flex-col gap-2">
                <div className="rounded-2xl w-full p-4 bg-accent flex items-center gap-x-4">
                    <Image 
                        src="https://placehold.co/64x64.png"
                        width={64}
                        height={64}
                        alt=""
                        className="rounded-full"
                    />
                    <div>
                        <h5 className="text-white font-semibold text-xl">Meat Plan</h5>
                        <p className="text-neutral-100 text-sm font-light">Chicken, Rice, Pea, Lobster, ...</p>
                    </div>
                </div>
                <div className="rounded-2xl w-full p-4 bg-green flex items-center gap-x-4">
                    <Image 
                        src="https://placehold.co/64x64.png"
                        width={64}
                        height={64}
                        alt=""
                        className="rounded-full"
                    />
                    <div>
                        <h5 className="text-white font-semibold text-xl">Vegetarian</h5>
                        <p className="text-neutral-100 text-sm font-light">Tofu, Rice, Pea, Mushroom, ...</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomePlans;