import { OpenDB } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

//func to get alerts of fingerprintid user
export async function GET(req: NextRequest) {
    try {
        const visitorId = req.nextUrl.searchParams.get('visitorId');
        if (!visitorId) {
            return NextResponse.json({ success: false, error: 'Missing visitorId' }, { status: 400 });
        }

        const db = await OpenDB();
        const user = await db.get(`SELECT coinAlerts FROM users WHERE id = ?`, [visitorId]);
        await db.close();

        if (!user?.coinAlerts) {
            return NextResponse.json({ success: true, alerts: {} });
        }

        const alerts = JSON.parse(user.coinAlerts);
        return NextResponse.json({ success: true, alerts });
    } 
    catch (err) {
        console.error("Error fetching alerts:", err);
        return NextResponse.json({ success: false, error: 'Failed to fetch alerts' }, { status: 500 });
    }
}

//func to delete any alert of a user
export async function DELETE(req: NextRequest) {
    try {
        const visitorId = req.nextUrl.searchParams.get('visitorId');
        const coinId = req.nextUrl.searchParams.get('coinId');

        if (!visitorId || !coinId) {
            return NextResponse.json({ success: false, error: 'Missing visitorId or coinId' }, { status: 400 });
        }

        const db = await OpenDB();
        const user = await db.get(`SELECT coinAlerts FROM users WHERE id = ?`, [visitorId]);

        if (!user?.coinAlerts) {
            await db.close();
            return NextResponse.json({ success: false, error: 'No alerts found' }, { status: 404 });
        }

        const alerts = JSON.parse(user.coinAlerts);
        delete alerts[coinId];

        await db.run(`UPDATE users SET coinAlerts = ? WHERE id = ?`, [JSON.stringify(alerts), visitorId]);
        await db.close();

        return NextResponse.json({ success: true });
    } 
    catch (err) {
        console.error("Error deleting alert:", err);
        return NextResponse.json({ success: false, error: 'Failed to delete alert' }, { status: 500 });
    }
}
