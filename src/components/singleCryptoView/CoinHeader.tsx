import { motion } from "framer-motion";

type Prop = {
    symbol: string;
    name: string;
    priceUsd: number;
    per24hr: number;
}
//this is page for displaying single crypto data and this is specificaly to display crypto NAME, current price
const CoinHeader = ({ symbol, name, priceUsd, per24hr }: Prop)=>{
    const isPositive = per24hr >= 0;

    const currency = typeof window !== 'undefined' && localStorage.getItem('currency') === 'INR' ? 'INR' : 'USD';
    const rate = 85;

    const convert = (value: number) => {
        return currency === 'INR' ? `₹${(value * rate)}` : `$${(value)}`;
    };
    
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{symbol.slice(0, 2)}</span>
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white">{name}
                        <span className="text-gray-400 ml-2">({symbol.toUpperCase()})</span>
                    </h1>
                    <div className={`flex items-center space-x-2 mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        <span className="text-2xl font-bold">{convert(priceUsd)}</span>
                        <span className="text-lg">({per24hr.toFixed(2)}%)</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
export default CoinHeader;