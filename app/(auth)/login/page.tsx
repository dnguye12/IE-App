import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/LoginForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const Page = async () => {
  const username = await getCurrentUser()

  if(username) {
    redirect("/home")
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden max-w-md mx-auto">
      <div className="relative z-0 h-40">
        <div className=" w-[960px] h-[960px] bg-green rounded-full absolute -top-8 p-8 md:-top-80 left-1/2 -translate-1/2 z-0"></div>
        <Image
          src={"/logo.svg"}
          width={80}
          height={80}
          alt="logo"
          className="z-10 absolute left-1/2 -translate-x-1/2 top-12"
        />
      </div>
      <div className="flex-1 p-8 md:px-0 relative z-10 flex flex-col">
        <h1 className="text-center font-semibold text-3xl mb-10">Sign In</h1>
        <LoginForm />
        <p className="text-center text-sm my-10">Don&apos;t have an account? <Link href={"/signup"} className="text-accent">Sign up</Link></p>
      </div>
    </div>
  );
}

export default Page;