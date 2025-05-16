import { OpenDB } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

//this route handles user marking fav any coin saving them in users table only
export async function GET(req: NextRequest) {
    try {
        const visitorId = req.nextUrl.searchParams.get("visitorId");
        if (!visitorId) {
            return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
        }

        const db = await OpenDB();
        const user = await db.get(`SELECT listCoin FROM users WHERE id = ?`, [visitorId]);
        await db.close();

        const list = user?.listCoin ? JSON.parse(user.listCoin) : [];

        return NextResponse.json({ listCoin: list });
    }
    catch (err) {
        console.error("Error getting listCoin:", err);
        NextResponse.json({ err: "Failed to fetch user's MyList" }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
    try {
        const { visitorId, coinId } = await req.json();
        if (!visitorId || !coinId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const db = await OpenDB();
        const user = await db.get(`SELECT listCoin FROM users WHERE id = ?`, [visitorId]);

        let list = [];
        if (user?.listCoin) {
            list = JSON.parse(user.listCoin);
        }

        if (!list.includes(coinId)) {
            list.push(coinId);
            await db.run(`UPDATE users SET listCoin = ? WHERE id = ?`, [JSON.stringify(list), visitorId]);
        }

        await db.close();
        return NextResponse.json({ success: true });
    }
    catch (err) {
        console.error("Error updating listCoin:", err);
        return NextResponse.json({ err: 'Internal Server Error' }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest) {
    try {
        const { visitorId, coinId } = await req.json();
        if (!visitorId || !coinId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const db = await OpenDB();
        const user = await db.get(`SELECT listCoin FROM users WHERE id = ?`, [visitorId]);

        let list = [];
        if (user?.listCoin) {
            list = JSON.parse(user.listCoin);
        }

        list = list.filter((id: string) => id !== coinId);
        await db.run(`UPDATE users SET listCoin = ? WHERE id = ?`, [JSON.stringify(list), visitorId]);

        await db.close();
        return NextResponse.json({ success: true });
    }
    catch (err) {
        console.error("Error removing coin from listCoin:", err);
        return NextResponse.json({ err: 'Internal Server Error' }, { status: 500 });
    }
}
