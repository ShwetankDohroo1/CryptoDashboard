"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import AlertCard from "@/components/Alert/alert-card";
import toast from "react-hot-toast";
import { CoinAlert } from "@/types/coinAlert";
import { Crypto } from "@/types/Crypto";
import { getAlerts, deleteAlert, updateAlert } from "@/service/alert/alert-service";
import { getCoins } from "@/service/alert/coin-service";
import { checkAndTriggerAlerts } from "@/lib/checkAlert";
import AlertSkeletons from "@/components/Alert/alert-skeleton";

const AlertsPage = () => {
    const [alerts, setAlerts] = useState<Record<string, CoinAlert>>({});
    const [coins, setCoins] = useState<Record<string, Crypto>>({});
    const [loading, setLoading] = useState(true);
    const [isChecked, setIsChecked] = useState(false);

    //useEffect to fetch alerts and coins.
    useEffect(() => {
        const init = async () => {
            const [fetchedAlerts, fetchedCoins] = await Promise.all([getAlerts(), getCoins()]);
            setAlerts(fetchedAlerts);
            setCoins(fetchedCoins);
            setLoading(false);
        };
        init();
    }, []);

    //useEffect to check and alert the conditions of user
    useEffect(() => {
        const checkAlerts = async () => {
            const triggered = checkAndTriggerAlerts(Object.values(coins), alerts);
            if (triggered.length) {
                const updatedAlerts = { ...alerts };

                for (const coinId of triggered) {
                    const result = await updateAlert(coinId, { isActive: false });
                    if (result.success) {
                        updatedAlerts[coinId].isActive = false;
                    } 
                    else {
                        toast.error(`Could not deactivate alert for ${coinId}`);
                    }
                }
                setAlerts(updatedAlerts);
            }
            setIsChecked(true);
        };

        if (!isChecked && Object.keys(alerts).length && Object.keys(coins).length) {
            checkAlerts();
        }
    }, [alerts, coins, isChecked]);


    //to delete alert
    const handleDeleteAlert = async (coinId: string) => {
        const res = await deleteAlert(coinId);
        if (res.success) {
            const updated = { ...alerts };
            delete updated[coinId];
            setAlerts(updated);
            toast.success("Alert removed");
        }
        else {
            toast.error(res.error || "Failed to remove alert");
        }
    };

    const alertEntries = Object.entries(alerts);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="max-w-6xl w-8/12 mx-auto p-6">
                <h2 className="text-3xl font-bold text-gray-200 mb-6">Your Alerts</h2>
                {loading ? (
                    <AlertSkeletons />
                ) : alertEntries.length === 0 ? (
                    <p className="text-gray-400">No alerts set. Add alerts from the coin list.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {alertEntries.map(([coinId, alert]) => {
                            const coin = coins[coinId];
                            if (!coin) return null;
                            return (
                                <AlertCard key={coinId} coin={coin} alert={alert} onRemove={() => handleDeleteAlert(coinId)} />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsPage;
