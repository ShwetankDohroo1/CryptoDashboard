import { OpenDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

//func to add new coin under specific list and checking if coin is already in list or not
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const listId = (await context.params).id;
    const { coinId } = await req.json();

    if (!listId || !coinId) {
        return NextResponse.json({ success: false, error: "Missing listId or coinId" }, { status: 400 });
    }

    const db = await OpenDB();

    const countRow = await db.get(`SELECT COUNT(*) as count FROM list_items WHERE list_id = ?`, [listId]);
    const limitRow = await db.get(`SELECT "limit" FROM user_list WHERE id = ?`, [listId]);

    if (limitRow?.limit && countRow.count >= limitRow.limit) {
        await db.close();
        return NextResponse.json({ success: false, error: "List limit reached" }, { status: 403 });
    }

    const existing = await db.get(`SELECT id FROM list_items WHERE list_id = ? AND coin_id = ?`, [listId, coinId]);
    if (existing) {
        await db.close();
        return NextResponse.json({ success: false, error: "Coin already in list" }, { status: 409 });
    }

    await db.run(`INSERT INTO list_items(id, list_id, coin_id) VALUES (?, ?, ?)`, [uuid(), listId, coinId]);
    await db.close();

    return NextResponse.json({ success: true });
}
