import { NextRequest, NextResponse } from "next/server";
import { OpenDB } from "@/lib/db";

//this func is to fetch users transaction that are saved in user_coin table, post because we are sending id in json
export async function POST(req:NextRequest) {
    try{
        const {fingerprintId} = await req.json();

        if(!fingerprintId){
            NextResponse.json({error:"User is not Registered"},{status:400});
        }

        const db = await OpenDB();
        const userCoins = await db.get(
            `SELECT coins FROM user_coin WHERE user_id = ?`,
            [fingerprintId]
          );
      
          const history = userCoins ? JSON.parse(userCoins.coins) : [];
          await db.close();
          return NextResponse.json(history);      
    }
    catch(err){
        console.error("Transaction fetch error:", err);
        NextResponse.json({error:"Internal Server error"},{status:500})
    }
}