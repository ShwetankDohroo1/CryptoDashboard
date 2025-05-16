// /app/api/lists/route.ts
import { OpenDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

//this func fetches all the lists user have created and then left joins them with list_items table to count the number of coins under specific list
export async function GET(req: NextRequest) {
    const visitorId = req.nextUrl.searchParams.get("visitorId");
    if (!visitorId) {
        return NextResponse.json({ success: false, error: "Missing visitorId" }, { status: 400 });
    }

    const db = await OpenDB();
    const lists = await db.all(`
        SELECT ul.id, ul.name, ul."limit", COUNT(li.id) as coinsCount
        FROM user_list ul
        LEFT JOIN list_items li ON li.list_id = ul.id
        WHERE ul.user_id = ?
        GROUP BY ul.id
    `, [visitorId]);
    await db.close();

    return NextResponse.json({ success: true, lists });
}

//this function is to create list
export async function POST(req: NextRequest) {
    const { userId, name, limit } = await req.json();

    if (!userId || !name) {
        return NextResponse.json({ success: false, error: "Missing userId or name" }, { status: 400 });
    }

    const db = await OpenDB();
    const id = uuid();

    await db.run(
        `INSERT INTO user_list (id, user_id, name, "limit") VALUES (?, ?, ?, ?)`,
        [id, userId, name, limit ?? null]
    );

    await db.close();

    return NextResponse.json({
        success: true,
        list: { id, user_id: userId, name, limit },
    });
}
