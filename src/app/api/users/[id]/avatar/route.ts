
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { OpenDB } from '@/lib/db';


//this endpoint handles the adding and changing of avatar of user from profile and saving in local
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { params } = await Promise.resolve(context);
    const { id } = await params;
    //get and validate uploaded file
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${randomUUID()}.${file.name.split('.').pop()}`;
    //saving
    const uploadDir = join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);
    //update user in db
    const avatarUrl = `/uploads/${filename}`;
    const db = await OpenDB();
    try {
        await db.run(`UPDATE users SET avatarUrl = ? WHERE id = ?`, [avatarUrl, id]);
        const updatedUser = await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
        return NextResponse.json(updatedUser);
    }
    catch (err) {
        console.error('Error saving avatar:', err);
        return NextResponse.json({ error: 'Failed to save avatar' }, { status: 500 });
    }
    finally {
        await db.close();
    }

}