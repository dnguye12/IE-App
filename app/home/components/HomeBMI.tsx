import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/types";
import { DrumstickIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BMI_MIN = 10;
const BMI_MAX = 40;

const BMI_SEGMENTS = [
    { label: "Severely underweight", from: 10, to: 16, color: "bg-blue-500" },
    { label: "Underweight", from: 16, to: 19, color: "bg-sky-400" },
    { label: "Normal", from: 19, to: 25, color: "bg-green-500" },
    { label: "Overweight", from: 25, to: 30, color: "bg-yellow-400" },
    { label: "Obese I", from: 30, to: 35, color: "bg-orange-400" },
    { label: "Obese II+", from: 35, to: 40, color: "bg-red-500" },
];

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max)
}

const getPercentage = (value: number) => {
    return ((value - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100;
};

interface HomeBMIProps {
    user: User | null
}

const HomeBMI = ({ user }: HomeBMIProps) => {
    if (!user) {
        return (
            <Skeleton className="w-full h-24 rounded-2xl bg-neutral-200" />
        )
    }

    if (!user.personinfo || user.personinfo.weight === "" || user.personinfo.height === "") {
        return (
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="home-label">BMI</h2>
                    <Button size={"sm"} variant={"green"} asChild><Link href={"/home/account-setup"}>Edit</Link></Button>
                </div>
                <div className="bg-white rounded-2xl p-4 border mb-4 flex flex-col justify-center items-center gap-4">
                    <Image
                        src="/rating/neutral.svg"
                        width={64}
                        height={64}
                        alt=""
                    />
                    <p className="text-sm font-semibold text-black text-center">You have not set your data yet!</p>
                    <Button className="font-semibold h-14 w-full rounded-full mx-auto text-lg" asChild>
                        <Link href={"/home/account-setup"}>Set Up Now!</Link>
                    </Button>
                </div>
            </section>
        )
    }

    const weight = parseFloat(user.personinfo.weight)
    const height = parseFloat(user.personinfo.height)
    const age = parseFloat(user.personinfo.age)
    const bmi = Math.round(weight / Math.pow(height * 0.01, 2))
    const clampedBMI = clamp(bmi, BMI_MIN, BMI_MAX);
    const percentage = ((clampedBMI - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100;
    let tdee
    if(user.personinfo.gender === "Male") {
        tdee = Math.floor((10 * weight) + (6.25 * height) - (5 * age) + 5);
    }else if(user.personinfo.gender === "Female") {
        tdee = Math.floor((10 * weight) + (6.25 * height) - (5 * age) - 161);
    }else {
        tdee = "-- Kcal"
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="home-label">BMI</h2>
                <Button size={"sm"} variant={"green"} asChild><Link href={"/home/account-setup"}>Edit</Link></Button>
            </div>
            <div className="bg-white text-black rounded-2xl p-4 border mb-4 flex flex-col justify-between gap-y-16">
                <DrumstickIcon className="min-w-8 size-8" />
                <div>
                    <p className="font-semibold text-xl"><span className="text-2xl">{tdee}</span> Kcal</p>
                    <p className="text-muted-foreground text-sm font-light">Recommended Daily Calories (TDEE)</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border">
                <div className="flex items-center justify-between text-black mb-6">
                    <p className="font-semibold text-3xl">{bmi}</p>
                    <div className="inline-flex items-center gap-x-2">
                        {
                            19 <= bmi && bmi < 25
                                ?
                                (
                                    <>
                                        <Image
                                            src="/rating/1.svg"
                                            width={32}
                                            height={32}
                                            alt=""
                                        />
                                        <span className=" font-light text-sm">Healthy weight</span>
                                    </>
                                )
                                :
                                (16 <= bmi && bmi < 19) || (25 <= bmi && bmi < 30)
                                    ?
                                    (
                                        <>
                                            <Image
                                                src="/rating/2.svg"
                                                width={32}
                                                height={32}
                                                alt=""
                                            />
                                            <span className=" font-light text-sm">{bmi < 19 ? "Underweight" : "Overweight"}</span>
                                        </>
                                    )
                                    :
                                    (10 <= bmi && bmi < 16) || (30 <= bmi && bmi < 35)
                                        ?
                                        (
                                            <>
                                                <Image
                                                    src="/rating/3.svg"
                                                    width={32}
                                                    height={32}
                                                    alt=""
                                                />
                                                <span className=" font-light text-sm">{bmi < 16 ? "Severely underweight" : "Obese I"}</span>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <Image
                                                    src="/rating/4.svg"
                                                    width={32}
                                                    height={32}
                                                    alt=""
                                                />
                                                <span className=" font-light text-sm">Obese II</span>
                                            </>
                                        )
                        }

                    </div>
                </div>
                <div className="relative">
                    <div className="flex h-3 overflow-hidden gap-0.5">
                        {BMI_SEGMENTS.map((seg, index) => {
                            const width = (seg.to - seg.from) / (BMI_MAX - BMI_MIN);
                            return (
                                <div
                                    key={index}
                                    className={`${seg.color} rounded-sm`}
                                    style={{ flex: width }}
                                    title={`${seg.label} (${seg.from} – ${seg.to})`}
                                />
                            );
                        })}
                    </div>
                    <div
                        className="pointer-events-none absolute -top-2 flex flex-col items-center"
                        style={{ left: `${percentage}%`, transform: "translateX(-50%)" }}
                    >
                        <div
                            className="border-x-[6px] border-t-8 border-x-transparent border-t-black"
                            style={{ width: 0, height: 0 }}
                        />
                    </div>
                    <div className="mt-1 h-4 relative text-xs text-muted-foreground">
                        {BMI_SEGMENTS.map((seg, index) => {
                            const startPercent = getPercentage(seg.from);
                            return (
                                <div
                                    key={index}
                                    className="absolute -translate-x-1/2 ps-3"
                                    style={{ left: `${startPercent}%` }}
                                >
                                    {seg.from}
                                </div>
                            );
                        })}

                        <div
                            className="absolute -translate-x-1/2 pr-3"
                            style={{ left: "100%" }}
                        >
                            {BMI_MAX}
                        </div>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground font-light">Weight</p>
                    <p className="text-lg font-semibold text-black">{weight} kg</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground font-light">Height</p>
                    <p className="text-lg font-semibold text-black">{height} cm</p>
                </div>
            </div>

        </section>
    );
}

export default HomeBMI;