import { CoinAlert } from "@/types/coinAlert";
import axios from "axios";

export const getAlerts = async (): Promise<Record<string, CoinAlert>> => {
    const visitorId = localStorage.getItem("fingerprintId");
    if (!visitorId) return {};

    const res = await fetch(`/api/alerts?visitorId=${visitorId}`);
    const data = await res.json();
    return data.success ? data.alerts : {};
};

export const deleteAlert = async (coinId: string): Promise<{ success: boolean; error?: string }> => {
    const visitorId = localStorage.getItem("fingerprintId");
    if (!visitorId) return { success: false, error: "No visitorId" };

    const res = await fetch(`/api/alerts?visitorId=${visitorId}&coinId=${coinId}`, {
        method: "DELETE",
    });
    return await res.json();
};

export async function updateAlert(coinId: string, updates: Partial<CoinAlert>) {
    const visitorId = localStorage.getItem("fingerprintId");
    if (!visitorId) return { success: false, error: "No visitorId" };
    try {
        const res = await axios.put(
            `/api/alerts/${coinId}?visitorId=${visitorId}`,
            updates
        );
        return res.data as { success: boolean };
    } catch (err) {
        console.error("PUT failed:", err);
        return { success: false, error: "Failed to update alert" };
    }
}

