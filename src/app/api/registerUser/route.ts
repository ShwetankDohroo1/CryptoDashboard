import { OpenDB } from "../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

//endpoint to register new user to the db and creating new tables for him
export async function POST(req: NextRequest) {
    try {
        const { visitorId } = await req.json();
        if (!visitorId) {
            return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });
        }

        console.log('Attempting to register user with ID:', visitorId);
        const db = await OpenDB();

        //user table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT,
                email TEXT,
                avatarUrl TEXT,
                listCoin TEXT,
                coinAlerts TEXT,
                isComplete INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        //users list table that will have all the lists he created
        await db.exec(`
            CREATE TABLE IF NOT EXISTS user_list (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                "limit" INTEGER, -- NULL = unlimited
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        //users list items, containing all the items under every list
        await db.exec(`
            CREATE TABLE IF NOT EXISTS list_items (
                id TEXT PRIMARY KEY,
                list_id TEXT NOT NULL,
                coin_id TEXT NOT NULL,
                added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (list_id) REFERENCES user_list(id)
            )
        `);

        //users coins that he bought are saved here
        await db.exec(`
            CREATE TABLE IF NOT EXISTS user_coin (
                user_id TEXT PRIMARY KEY,
                coins JSON,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        //check if user exists
        const userExists = await db.get(`SELECT * FROM users WHERE id = ?`, [visitorId]);

        if (!userExists) {
            await db.run(
                `INSERT INTO users(id, username, email, coinAlerts, isComplete) VALUES(?, ?, ?, ?, ?)`,
                [visitorId, '', '', JSON.stringify({}), 0]
            );
            console.log(`New User Created: ${visitorId}`);
            await db.close();
            return NextResponse.json({ success: true, message: 'New user registered successfully', userId: visitorId, isNewUser: true });
        }
        console.log(`Existing user found: ${visitorId}`);
        await db.close();
        return NextResponse.json({ success: true, message: 'User already exists', userId: visitorId, isNewUser: false });
    }
    catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json({ error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
    }
}