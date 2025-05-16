import { Crypto } from "@/types/Crypto";
export type FilterType = "all" | "best" | "worst"

//filter logic
export function filterData(cryptos: Crypto[], searchQuery: string, filter: FilterType): Crypto[] {
    
    return cryptos.filter(crypto => crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => {
            if (filter === "best") {
                return b.per24hr - a.per24hr
            }
            if (filter === "worst") {
                return a.per24hr - b.per24hr;
            }
            return 0;
        });
}