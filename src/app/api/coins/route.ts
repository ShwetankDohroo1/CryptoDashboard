// /src/app/api/coins/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { CoinApiResponseItem } from "@/types/CoinApiResponseItem";
//this func is for optimising the api calls, if the lastfethtime - current time is less than cache duration, we wont refetch
let cachedData: Crypto[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000;

export async function GET() {
    try {
        const now = Date.now();
        if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
            return NextResponse.json({ coins: cachedData });
        }

        const apiKey = process.env.CRYPTO_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const response = await axios.get(`https://rest.coincap.io/v3/assets?limit=100`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        const coins = response.data.data.map((item: CoinApiResponseItem) => ({
            id: item.id,
            rank: item.rank,
            name: item.name,
            symbol: item.symbol,
            priceUsd: parseFloat(item.priceUsd),
            supply: parseFloat(item.supply),
            market_cap: parseFloat(item.marketCapUsd),
            volume24Hr: parseFloat(item.volumeUsd24Hr),
            per24hr: parseFloat(item.changePercent24Hr),
            vwap24hr: parseFloat(item.vwap24Hr),
            isFavorite: false,
        }));
        cachedData = coins;
        lastFetchTime = now;

        return NextResponse.json({ coins });
    }
    catch (err: unknown) {
        console.error("Failed to fetch coins:", err);
        if (cachedData) {
            return NextResponse.json({
                coins: cachedData,
                warning: "Using cached data due to API rate limit"
            });
        }
        if (axios.isAxiosError(err) && err.response?.status === 403) {
            return NextResponse.json({
                error: "API rate limit reached. Please try again in a few minutes.",
                status: 429
            }, { status: 429 });
        }
        return NextResponse.json({ error: "Failed to fetch coins" }, { status: 500 });
    }

}
