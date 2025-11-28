"use client"

import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const weight = [
    { weight: 63, month: "January" },
    { weight: 59, month: "August" },
    { weight: 60, month: "November" }
]

const chartConfig = {
    weight: {
        label: "Weight",
        color: "#9BB168"
    }
} satisfies ChartConfig

const HomeBMIChart = () => {
    return (
        <Card className="shadow-none rounded-2xl">
            <div className="flex items-center justify-between px-4">
                <div>
                    <p className="text-sm font-light text-muted-foreground">Current</p>
                    <p className="font-semibold text-xl">60 kg</p>
                </div>
                <div>
                    <p className="text-sm font-light text-muted-foreground">Heaviest <span className="font-semibold text-black">62.5</span></p>
                    <p className="text-sm font-light text-muted-foreground">Lightest <span className="font-semibold text-black">59</span></p>
                </div>
            </div>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={weight}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={"month"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={3}
                            width={20}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="weight"
                            type="natural"
                            stroke="#9BB168"
                            strokeWidth={2}
                            dot={{
                                fill: "#9BB168",
                            }}
                            activeDot={{
                                r: 3,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default HomeBMIChart;