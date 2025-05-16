import axios from "axios";
import { Crypto } from "@/types/Crypto";

//api to get all the coins
export const fetchCrypto = async (): Promise<Crypto[]> => {
    const resp = await axios.get("/api/coins");
    if (!resp.data.coins) {
        throw new Error("Invalid response format from API");
    }
    return resp.data.coins;
};
