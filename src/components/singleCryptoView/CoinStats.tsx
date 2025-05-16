import { StatCard } from "@/components/ui/StatPropCard";
import { formatNumber } from "@/lib/formatNumber";
import { motion } from "framer-motion";
type Props = {
    coin: {
        market_cap: number;
        volume24Hr: number;
        supply: number;
        vwap24hr: number;
        per24hr: number;
    }
};

//grid like structure to display more data about the crypto
const CoinStats = ({ coin }: Props) => {
    const currency = typeof window !== 'undefined' && localStorage.getItem('currency') === 'INR' ? 'INR' : 'USD';
    const rate = 85;

    const convert = (value: number) => {
        return currency === 'INR' ? `₹${formatNumber(value * rate)}` : `$${formatNumber(value)}`;
    };
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Market Cap" value={convert(coin.market_cap)} />
            <StatCard title="24hr Volume" value={convert(coin.volume24Hr)} />
            <StatCard title="Supply" value={formatNumber(coin.supply)} />
            <StatCard title="VWAP (24hr)" value={convert(coin.vwap24hr)} />
            <StatCard title="Change (24hr)" value={`${coin.per24hr.toFixed(2)}%`} />
        </motion.div>
    );
}
export default CoinStats;