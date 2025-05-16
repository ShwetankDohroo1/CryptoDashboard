import { formatNumber } from "@/lib/formatNumber";

//Function to display users total coins and total money he had spend
const ProfileStats = ({ totalCoins, totalSpent }: { totalCoins: number, totalSpent: number })=>{
    const currency = typeof window !== 'undefined' && localStorage.getItem('currency') === 'INR' ? 'INR' : 'USD';
    const rate = 85;

    const convert = (value: number) => {
        return currency === 'INR' ? `₹${formatNumber(value * rate)}` : `$${formatNumber(value)}`;
    };
    return (
        <div className="gap-4 bg-gray-300 p-2 m-2 rounded flex justify-around">
            <div>
                <p className="text-gray-500 text-sm">Total Coins</p>
                <p className="text-xl font-bold">{totalCoins}</p>
            </div>
            <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-xl font-bold">{convert(totalSpent)}</p>
            </div>
        </div>
    );
}
export default ProfileStats;