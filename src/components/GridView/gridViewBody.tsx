import { Crypto } from "@/types/Crypto";
import { formatNumber } from "@/lib/formatNumber";
import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

//this func is to display the crypto in grid view
const CryptoGrid = ({ crypto }: { crypto: Crypto })=>{
    const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

    useEffect(() => {
        const saved = localStorage.getItem('currency');
        if (saved === 'INR') setCurrency('INR');
    }, []);

    const rate = 85;
    const convert = (value: number) => {
        return currency === 'INR' ? `₹${formatNumber(value * rate)}` : `$${formatNumber(value)}`;
    };

    //const to change the colorc of cryptos
    const isNegative = crypto.per24hr < 0;

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className={`relative border rounded-xl p-6 shadow-lg transition-all duration-300 bg-white hover:shadow-xl ${isNegative ? 'hover:bg-red-100' : 'hover:bg-green-100'}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-800 font-semibold">{crypto.rank}</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-gray-800">{crypto.name}</h3>
                        <p className="text-sm text-gray-500">{crypto.symbol}</p>
                    </div>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${isNegative ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                    {isNegative ? (
                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                    ) : (
                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                    )}
                    <span className={`font-semibold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                        {Math.abs(crypto.per24hr).toFixed(2)}%
                    </span>
                </div>
            </div>
            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Current Price</p>
                <p className="text-2xl font-bold text-gray-800">{convert(crypto.priceUsd)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                    <p className="font-semibold text-gray-800">{convert(crypto.market_cap)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-500 mb-1">Volume (24h)</p>
                    <p className="font-semibold text-gray-800">{convert(crypto.volume24Hr)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-500 mb-1">Supply</p>
                    <p className="font-semibold text-gray-800">{formatNumber(crypto.supply)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                    <p className="text-sm text-gray-500 mb-1">VWAP (24h)</p>
                    <p className="font-semibold text-gray-800">{convert(crypto.vwap24hr)}</p>
                </div>
            </div>
        </motion.div>
    );
}
export default CryptoGrid;
