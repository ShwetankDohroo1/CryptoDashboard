
//func that updates db when user buys a crypto
export const PostBuy= async({username, email, coinId, quantity, totalamount, buyPrice, fingerprintId}:{username:string, email:string, coinId: string, quantity: number, totalamount:number, buyPrice:number, fingerprintId:string})=>{
    try{
        const resp = await fetch('/api/trade',{
            method: 'POST',
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({ username, email, coinId, quantity, totalamount, buyPrice, fingerprintId }),
        });
        const data = await resp.json();
        return data;
    }
    catch(err){
        console.error("Error saving purchase data:", err);
        return { success: false, message: "Failed to process the purchase" };
    }
}