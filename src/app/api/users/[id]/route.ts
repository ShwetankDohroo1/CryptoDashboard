import { OpenDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }>  }) {
    const { params } = await Promise.resolve(context);
    const {id}=await params;
    const db = await OpenDB();
    const user = await db.get('SELECT * FROM users WHERE id = ?', id);

    if (!user)
        return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user);
}


export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { params } = await Promise.resolve(context);
    const {id}=await params;
    const db = await OpenDB();
    const userId = id;
    const { username, email, avatarUrl } = await req.json();
    const isComplete = username.trim() !== '' && email.trim() !== '' ? 1 : 0;

    try {
        await db.run(
            `UPDATE users SET username = ?, email = ?, avatarUrl = ?, isComplete = ? WHERE id = ?`,
            [username, email, avatarUrl || '',isComplete, userId]
        );

        const updatedUser = await db.get(`SELECT * FROM users WHERE id = ?`, [userId]);
        return NextResponse.json(updatedUser);
    }
    catch (err) {
        console.error("Error updating user:", err);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
    finally {
        await db.close();
    }
}