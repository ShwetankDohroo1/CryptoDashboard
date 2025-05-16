'use client';
import { useParams } from "next/navigation";
import { useState } from "react";
import { Chart } from "@/components/ui/Chart";
import CoinHeader from "@/components/singleCryptoView/CoinHeader";
import CoinStats from "@/components/singleCryptoView/CoinStats";
import Navbar from "@/components/Navbar/Navbar";
import Skeleton from "@/components/ui/Skeleton";
import { useSingleCoin } from "@/lib/api/coinApi";
import BuyCoinDialog from "@/components/DialogBoxs/buyCoinDialog";

//THIS IS A DASHBOARD TO DISPLAY CRYPTOS DATA THAT USER SELECTED FROM LIST OR GRID.
const CryptoDashboard = ()=>{
    const { coinId } = useParams();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: coin, isLoading, isError } = useSingleCoin(coinId as string);
    
    if (!coinId || isLoading) {
        return (
            <div className="min-h-screen w-full bg-[#28282B]">
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                    </div>
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !coin) {
        return <div className="text-red-500 text-center mt-10">Current Can&apos;t Get the details of Crypto you requested.</div>;
    }

    return (
        <div className="flex flex-col">
            <Navbar />
            <div className="min-h-screen w-full bg-[#28282B]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <CoinHeader {...coin} />
                    <CoinStats coin={coin} />
                    <BuyCoinDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} coinId={coinId as string} coinName={coin.name} coinSymbol={coin.symbol} coinPrice={coin.priceUsd}/>
                    <div className="mt-8 bg-[#1a1a1a] rounded-xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Price Chart</h2>
                        <Chart coinId={coinId as string} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CryptoDashboard;