import axios from "axios";
import { CryptoHistoryResponse } from "@/types/History";

//api to get history of the specific coin
export const fetchCoinHistory = async (coinId: string, interval: string): Promise<CryptoHistoryResponse> => {
    const resp = await axios.get(`/api/coins/${coinId}/history?interval=${interval}`);
    if (!resp.data) {
        throw new Error("Failed to fetch coin history");
    }
    return resp.data;
}