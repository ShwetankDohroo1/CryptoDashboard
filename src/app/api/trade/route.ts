import { OpenDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Transactions } from "@/types/Transaction";
//endpoint handling users coins addition or updation that he bought, saving in user_coin
export async function POST(req: NextRequest) {
    try {
        const { username, email, coinId, quantity, totalamount, buyPrice, fingerprintId } = await req.json();

        if (!coinId || !quantity || !totalamount || buyPrice == undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await OpenDB();
        const user = await db.get(`SELECT * FROM users WHERE id = ?`, [fingerprintId]);

        if (!user) {
            return NextResponse.json({ error: 'User not registered' }, { status: 400 });
        }

        //if user is buying coin for first time, he is giving username and email also so we need to save them in users table and mark it as completed
        if ((!user.username && username) || (!user.email && email)) {
            const updatedUsername = user.username || username || '';
            const updatedEmail = user.email || email || '';
            const isComplete = updatedUsername && updatedEmail ? 1 : 0;

            await db.run(
                `UPDATE users SET username = ?, email = ?, isComplete = ? WHERE id = ?`,
                [updatedUsername, updatedEmail, isComplete, fingerprintId]
            );
        }

        const userCoins = await db.get(`SELECT * FROM user_coin WHERE user_id = ?`, [fingerprintId]);
        let updatedCoins;

        const now = new Date().toISOString();
        //under this we are checking if user had bought that coin in past or not, if yes we are updating that coins data according to current data
        if (userCoins) {
            updatedCoins = JSON.parse(userCoins.coins);
            const index = updatedCoins.findIndex((c: Transactions) => c.coinId === coinId);

            if (index !== -1) {

                //update existing coin calculate new totals and average buy price
                const existing = updatedCoins[index];
                const newTotalQty = existing.quantity + quantity;
                const newTotalAmt = existing.totalamount + totalamount;
                const avgPrice = newTotalAmt / newTotalQty;
                updatedCoins[index] = { ...existing, quantity: newTotalQty, totalamount: newTotalAmt, buyPrice: avgPrice, timestamp: now };
            }
            else {
                const buyPrice = totalamount / quantity;
                updatedCoins.push({ coinId, quantity, totalamount, buyPrice, timestamp: now });
            }

            await db.run(
                `UPDATE user_coin SET coins = ? WHERE user_id = ?`,
                [JSON.stringify(updatedCoins), fingerprintId]
            );
        }
        else {
            const timestamp = new Date().toISOString();
            updatedCoins = [{ coinId, quantity, totalamount, buyPrice, timestamp }];
            await db.run(
                `INSERT INTO user_coin (user_id, coins) VALUES (?, ?)`,
                [fingerprintId, JSON.stringify(updatedCoins)]
            );
        }

        await db.close();
        return NextResponse.json({ success: true, message: 'Transaction complete and data saved' });

    }
    catch (err) {
        console.error("Error processing transaction:", err);
        return NextResponse.json(
            { error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
