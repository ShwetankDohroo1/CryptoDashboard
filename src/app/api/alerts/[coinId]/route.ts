import { NextRequest, NextResponse } from 'next/server';
import { OpenDB } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { coinId: string } }) {
    const coinId = params.coinId;
    const visitorId = req.nextUrl.searchParams.get('visitorId');
    if (!visitorId) {
        return NextResponse.json(
            { success: false, error: 'Missing visitorId' },
            { status: 400 }
        );
    }

    const updates = await req.json() as Partial<{ isActive: boolean; lastNotified: number | null }>;

    const db = await OpenDB();
    const row = await db.get(
        `SELECT coinAlerts FROM users WHERE id = ?`,
        [visitorId]
    );
    if (!row?.coinAlerts) {
        await db.close();
        return NextResponse.json(
            { success: false, error: 'No alerts found for user' },
            { status: 404 }
        );
    }

    const alerts = JSON.parse(row.coinAlerts) as Record<string, any>;
    if (!alerts[coinId]) {
        await db.close();
        return NextResponse.json(
            { success: false, error: `No alert for coin ${coinId}` },
            { status: 404 }
        );
    }

    // apply only the fields you send
    alerts[coinId] = { ...alerts[coinId], ...updates };

    await db.run(
        `UPDATE users SET coinAlerts = ? WHERE id = ?`,
        [JSON.stringify(alerts), visitorId]
    );
    await db.close();

    return NextResponse.json({ success: true, alert: alerts[coinId] });
}
