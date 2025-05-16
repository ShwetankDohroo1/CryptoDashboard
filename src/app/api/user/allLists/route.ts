import { fetchSingleCrypto } from "@/lib/api/getSingleAPI";
import { OpenDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface UserList {
    id: string;
    name: string;
  }
  
//func to fetch all the list user have and coins data also that specific list have
export async function GET(req: NextRequest) {
    const visitorId = req.nextUrl.searchParams.get("visitorId");
    if (!visitorId) {
        return NextResponse.json({ success: false, error: "Missing visitorId" }, { status: 400 });
    }

    const db = await OpenDB();

    const lists = await db.all(`SELECT id, name FROM user_list WHERE user_id = ?`, [visitorId]);

    const fullLists = await Promise.all(

        //traverse in list and then get data of coin
        lists.map(async (list: UserList) => {
            const coinIds = await db.all(`SELECT coin_id FROM list_items WHERE list_id = ?`, [list.id]);

            const coins = await Promise.all(
                coinIds.map(async ({ coin_id }) => {
                    try {
                        const res = await fetchSingleCrypto(coin_id);
                        if (!res) {
                            console.warn(`Failed to fetch ${coin_id}:`);
                            return null;
                        }
                        return res;
                    }
                    catch (err) {
                        console.error(`Error fetching ${coin_id}:`, err);
                        return null;
                    }
                })
            );

            return { ...list, coins: coins.filter(Boolean) };
        })
    );

    await db.close();

    return new NextResponse(
        JSON.stringify({ success: true, lists: fullLists }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        }
    );
}
