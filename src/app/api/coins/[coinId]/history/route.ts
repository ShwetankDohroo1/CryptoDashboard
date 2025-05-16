import { NextResponse } from "next/server";
import axios from "axios";

//this route is for fetching coins history so that i can represent a graph using this.
export async function GET( request: Request, context: { params: Promise<{ coinId: string }> }) {
    try {
        const {params} = await Promise.resolve(context);
        const coinId = (await params).coinId;
        if (!coinId) {
            return NextResponse.json({ error: "Coin ID is required" }, { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const interval = searchParams.get('interval') || 'm1';
        
        const apiKey = process.env.CRYPTO_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const response = await axios.get(`https://rest.coincap.io/v3/assets/${coinId}/history?interval=${interval}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        
        return NextResponse.json({ data: response.data.data });
    } 
    catch (err) {
        console.error("Failed to fetch coin history:", err);
        return NextResponse.json({ error: "Failed to fetch coin history" }, { status: 500 });
    }
} 