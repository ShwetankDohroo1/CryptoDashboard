import { Crypto } from "@/types/Crypto";

export const getCoins = async (): Promise<Record<string, Crypto>> => {
    const res = await fetch("/api/coins");
    const data = await res.json();
    if (!data.coins) return {};

    return data.coins.reduce((acc: Record<string, Crypto>, coin: Crypto) => {
        acc[coin.id] = coin;
        return acc;
    }, {});
};
