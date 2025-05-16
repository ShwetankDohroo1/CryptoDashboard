import { OpenDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

//this is endpoint to logout a user, removing everything expect his fingerprintId
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { params } = await Promise.resolve(context);
    const { id } = await params;
    const db = await OpenDB();

    try {
        await db.run(`
            UPDATE users SET username = NULL,
            email = NULL,
            avatarUrl = NULL,
            listCoin = NULL,
            isComplete = 0
            WHERE id = ?`, [id]);
        await db.run(`DELETE FROM user_coin WHERE user_id = ?`, [id]);
        return NextResponse.json({ success: true });
    }
    catch (err) {
        console.error('Logout error:', err);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
    finally {
        await db.close();
    }
}