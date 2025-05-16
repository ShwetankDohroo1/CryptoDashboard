import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request, context: { params: Promise<{ coinId: string }> }) {
    try {
        const {params} = await Promise.resolve(context);
        const coinId = (await params).coinId;
        if (!coinId) {
            return NextResponse.json({ error: "Coin ID is required" }, { status: 400 });
        }

        const apiKey = process.env.CRYPTO_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const response = await axios.get(`https://rest.coincap.io/v3/assets/${coinId}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        
        const item = response.data.data;
        const coin = {
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
        };
        
        return NextResponse.json(coin);
    } 
    catch (err) {
        console.error("Failed to fetch coin:", err);
        return NextResponse.json({ error: "Failed to fetch coin" }, { status: 500 });
    }
} 