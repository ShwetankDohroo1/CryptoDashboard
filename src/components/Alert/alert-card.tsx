import { FC } from "react";
import { CoinAlert } from "@/types/coinAlert";
import { Crypto } from "@/types/Crypto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatNumber";

interface AlertCardProps {
    coin: Crypto;
    alert: CoinAlert;
    onRemove: () => void;
}

const AlertCard: FC<AlertCardProps> = ({ coin, alert, onRemove }) => (
    <Card className="bg-gray-100 border-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold text-gray-700">{coin.name}</CardTitle>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-900/20" onClick={onRemove}>
                Remove
            </Button>
        </CardHeader>
        <CardContent>
            <div className="text-sm text-gray-600">Current Price: ${formatNumber(coin.priceUsd)}</div>
            <div className="text-sm text-gray-600">Alert: {alert.condition} ${formatNumber(alert.value)}</div>
            <div className="text-sm text-gray-600">Status: {alert.isActive ? "Active" : "Inactive"}</div>
            {alert.lastNotified && (
                <div className="text-sm text-gray-600">Last Notified: {new Date(alert.lastNotified).toLocaleString()}</div>
            )}
        </CardContent>
    </Card>
);

export default AlertCard;
