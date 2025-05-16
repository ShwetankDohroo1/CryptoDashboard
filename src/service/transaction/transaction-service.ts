import { Transactions } from "@/types/Transaction";
import { fetchTransactionData } from "@/lib/api/getTransaction";
import { fetchSingleCrypto } from "@/lib/api/getSingleAPI";

export const getUserTransactions = async (fingerprintId: string): Promise<Transactions[]> => {
    return fetchTransactionData(fingerprintId);
};

export const getCoinPrices = async (coinIds: string[]): Promise<Record<string, number>> => {
    const priceMap: Record<string, number> = {};
    await Promise.all(
        coinIds.map(async id => {
            try {
                const data = await fetchSingleCrypto(id);
                priceMap[id] = data.priceUsd;
            } 
            catch {
                priceMap[id] = 0;
            }
        })
    );
    return priceMap;
};
