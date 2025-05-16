"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useCoinHistory } from "@/lib/api/coinApi";
import { HistoryData } from "@/types/History";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem,} from "@/components/ui/select";

interface CryptoChartProps {
    coinId: string;
}

export function Chart({ coinId }: CryptoChartProps) {
    const [interval, setInterval] = useState("m1");
    const { data, isLoading, isError, error } = useCoinHistory(coinId, interval);

    if (isLoading) return <p>Loading chart...</p>;
    if (isError) return <p>Error fetching data: {(error as Error).message}</p>;

    const chartData = data?.data ?? [];
    if (chartData.length === 0) {
        return <p>No data available for the selected interval.</p>;
    }

    const formattedData = chartData.map((entry: HistoryData) => ({
        date: new Date(entry.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        }),
        price: parseFloat(entry.priceUsd),
    }));

    return (
        <div className="mt-10 bg-muted p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-muted-foreground capitalize">
                    {coinId} Price History Graph
                </h2>
                <Select value={interval} onValueChange={setInterval}>
                    <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Interval" />
                    </SelectTrigger>
                    <SelectContent>
                        {["m1", "m5", "m15", "m30", "h1", "h2", "h6", "h12", "d1"].map((intv) => (
                            <SelectItem key={intv} value={intv}>
                                {intv.toUpperCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={formattedData}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} width={50} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#ccc" }} labelStyle={{ fontSize: 12 }} itemStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--chart-1))" fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
