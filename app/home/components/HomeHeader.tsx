import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

const HomeHeader = async() => {
    const username = await getCurrentUser()

    return (
        <section className="bg-primary p-8 rounded-b-4xl ">
            <div className="flex justify-between items-center mb-6 w-full">
                <Image
                    src={"/logo.svg"}
                    width={32}
                    height={32}
                    alt=""
                />
               <LogoutButton />
            </div>
            <div className="flex items-center gap-4">
                <Avatar className="size-16">
                    <AvatarImage src="/rating/1.svg" />
                    <AvatarFallback>{username}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-white">
                    <h5 className="text-2xl font-semibold truncate">Hello {username}</h5>
                    <div className="flex items-center gap-x-4 text-sm font-light text-white/80">
                        How are you today?
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeHeader;