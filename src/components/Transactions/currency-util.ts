import { formatNumber } from "@/lib/formatNumber";

export const currency = typeof window !== 'undefined' && localStorage.getItem('currency') === 'INR' ? 'INR' : 'USD';
const rate = 85;

export const convert = (value: number = 0) => {
    return currency === 'INR' ? `₹${formatNumber(value * rate)}` : `$${formatNumber(value)}`;
};
