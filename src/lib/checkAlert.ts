import { Crypto } from "@/types/Crypto";
import { CoinAlert } from "@/types/coinAlert";
import toast from "react-hot-toast";

//made this func for checking alerts but failed to do this
type AlertMap = Record<string, CoinAlert>;

export function checkAndTriggerAlerts(liveData: Crypto[], alerts: AlertMap) {
    const triggered: string[] = [];
    // if (!liveData.length || !Object.keys(alerts).length)
    //     return;

    liveData.forEach((coin) => {
        const alert = alerts[coin.id];
        if (!alert || !alert.isActive) return;

        const shouldNotify =
            (alert.condition === ">=" && coin.priceUsd >= alert.value) ||
            (alert.condition === "<=" && coin.priceUsd <= alert.value) ||
            (alert.condition === "==" && coin.priceUsd === alert.value);

        if (shouldNotify) {
            const message = `🔔 ${coin.name} is ${coin.priceUsd} (triggered ${alert.condition} ${alert.value})`;
            toast.success(message);
            triggered.push(coin.id);
        }
    });
    return triggered;
}
