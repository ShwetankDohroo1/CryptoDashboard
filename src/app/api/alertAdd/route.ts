import { OpenDB } from "../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

//post func to add alert
export async function POST(req: NextRequest) {
    try {
        const { userId, coinSymbol, condition, value } = await req.json();

        if (!userId || !coinSymbol || !condition || value === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!["<=", ">=", "=="].includes(condition)) {
            return NextResponse.json({ error: 'Invalid condition' }, { status: 400 });
        }

        const db = await OpenDB();

        const user = await db.get(`SELECT coinAlerts FROM users WHERE id = ?`, [userId]);
        const alerts = user?.coinAlerts ? JSON.parse(user.coinAlerts) : {};

        alerts[coinSymbol] = {
            condition,
            value,
            isActive: true,
            lastNotified: null
        };

        await db.run(`UPDATE users SET coinAlerts = ? WHERE id = ?`, [JSON.stringify(alerts), userId]);
        await db.close();

        return NextResponse.json({ success: true, message: `Alert set for ${coinSymbol}` });
    } 
    catch (err) {
        console.error("Error adding alert:", err);
        return NextResponse.json({ error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
    }
}
