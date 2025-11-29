import Image from "next/image";
import Logo from "./components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden p-8 md:px-0 max-w-md mx-auto">
      <header className="flex justify-center">
        <Logo />
      </header>

      <h1 className="text-2xl font-semibold text-center my-4">Welcome to the ultimate <br /> <span className="text-secondary">food plan maker</span>!</h1>
      <p className="text-muted-foreground text-base text-center">We help you to build a healthier food diet. <br />For everyone, anywhere</p>
      <div className="flex-1  flex items-center">
        <div className="bg-white rounded-full aspect-square flex items-center justify-center">
          <Image
            src={"https://i.ibb.co/F4HHLYTB/Chat-GPT-Image-Nov-27-2025-03-13-56-PM.png"}
            width={1024}
            height={1024}
            alt=""
            className="w-4/5"
          />
        </div>
      </div>
      <Button size={"lg"} className="font-semibold h-14 w-44 mx-auto text-lg" asChild>
        <Link href="/login">Login <ArrowRightIcon /></Link>
        </Button>
      <div className="flex gap-1 mt-8 justify-center items-center text-sm">
        <p>Don&apos;t have an account?</p>
        <Link href={"/signup"} className=" inline-flex text-accent underline">Sign up</Link>
      </div>
    </div>
  );
}
