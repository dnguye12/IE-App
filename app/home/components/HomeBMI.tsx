import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import HomeBMIChart from "./HomeBMIChart";

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

const HomeBMI = () => {
    const clampedBMI = clamp(22, BMI_MIN, BMI_MAX);
    const percentage = ((clampedBMI - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100;

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="home-label">BMI</h2>
                <Button size={"sm"} variant={"green"}>Edit</Button>
            </div>
            <div className="bg-white rounded-2xl p-4 border mb-4">
                <div className="flex items-center justify-between text-black mb-6">
                    <p className="font-semibold text-3xl">22</p>
                    <div className="inline-flex items-center gap-x-2">
                        <Image
                            src="/rating/1.svg"
                            width={32}
                            height={32}
                            alt=""
                        />
                        <span className=" font-light text-sm">Healthy weight</span>
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
                <Separator className="my-4"/>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground font-light">Height</p>
                    <p className="text-lg font-semibold text-black">165 cm</p>
                </div>
            </div>

            <HomeBMIChart />
        </section>
    );
}

export default HomeBMI;