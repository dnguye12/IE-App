import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

interface HomePlansProps {
    username: string;
    user: User | null
}

const HomePlans = ({ username, user }: HomePlansProps) => {
    if (!user) {
        return (
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="home-label">Your Plans</h2>
                    <Button size={"sm"} variant={"green"} disabled>Generate</Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-20 bg-neutral-200" />
                    <Skeleton className="h-20 bg-neutral-200" />
                    <Skeleton className="h-20 bg-neutral-200" />
                    <Skeleton className="h-20 bg-neutral-200" />
                </div>
            </section>
        )
    }

    const handleDelete = async (username: string, planname: string) => {
        try {
            const res = await fetch("/api/delete-plan", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    planname
                })
            })
            if (res.ok) {
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="home-label">Your Plans</h2>
                <Button size={"sm"} variant={"green"} asChild>
                    <Link href={"/home/generate-plan"}>Generate</Link>
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {
                    user && user.plans?.length > 0
                    &&
                    (
                        <>
                            {user.plans.map((plan, idx) => (
                                <div key={`plan-${idx}`} className={cn(
                                    "rounded-2xl w-full p-4 gap-x-4 hover:scale-105 transition-transform cursor-pointer hover:shadow-md min-h-20",
                                    idx % 2 === 0 ? "bg-accent" : "bg-green"
                                )} >
                                    <div className="flex items-start justify-between mb-2">
                                        <Link href={`/home/plan/${plan}`} className="flex flex-col justify-between">
                                            <h5 className="text-white font-semibold text-xl">{plan}</h5>
                                            <p className="text-neutral-100 text-sm font-light">Click to view details</p>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size={"icon-sm"} variant={"outline"} className="hover:bg-neutral-200"><TrashIcon /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="hover:text-white">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(username, plan)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </div>

                                </div>
                            ))}
                        </>
                    )
                }
                <Link href={"/home/generate-plan"} className="rounded-2xl w-full p-4 gap-x-4 hover:scale-105 transition-transform cursor-pointer hover:shadow-md min-h-20 bg-white flex justify-center items-center border-2 border-dashed">
                    <PlusIcon className="size-8 min-w-8 text-black" />
                </Link>
            </div>
        </section>
    );
}

export default HomePlans;