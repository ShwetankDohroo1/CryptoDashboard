import axios from "axios";
import { Crypto } from "@/types/Crypto";

//api that fetches all the data regarding specified crypto
export const fetchSingleCrypto = async(coinId: string) : Promise<Crypto> => {
    if (typeof window === 'undefined') {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        const resp = await axios.get(`${baseUrl}/api/coins/${coinId}`);
        if (!resp.data) {
            throw new Error("Failed to fetch coin data");
        }
        return resp.data;
    } 
    else {
        const resp = await axios.get(`/api/coins/${coinId}`);
        if (!resp.data) {
            throw new Error("Failed to fetch coin data");
        }
        return resp.data;
    }
}