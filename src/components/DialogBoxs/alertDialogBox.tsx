import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Crypto } from "@/types/Crypto";

type AlertDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    coin: Crypto | null;
};

const AlertDialog = ({ open, onOpenChange, coin }: AlertDialogProps)=>{
    const [alertCondition, setAlertCondition] = useState("<=");
    const [alertValue, setAlertValue] = useState("");

    const handleSubmit = async () => {
        const visitorId = localStorage.getItem("fingerprintId");
        if (!visitorId || !coin) return;

        const parsedValue = parseFloat(alertValue);
        if (isNaN(parsedValue)) {
            toast.error("Invalid price input");
            return;
        }

        const res = await fetch("/api/alertAdd", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: visitorId,
                coinSymbol: coin.id,
                condition: alertCondition,
                value: parsedValue
            }),
        });

        const result = await res.json();
        if (result.success) {
            toast.success(`Alert set for ${coin.name}`);
            onOpenChange(false);
            setAlertValue("");
        } 
        else {
            toast.error(result.error || "Failed to set alert");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Set Price Alert</DialogTitle>
                </DialogHeader>
                {coin && (
                    <div className="grid gap-4 py-4">
                        <div className="text-sm text-gray-600">
                            Coin: <strong>{coin.name}</strong><br />
                            Current Price: <strong>${Number(coin.priceUsd).toFixed(2)}</strong>
                        </div>
                        <select className="border rounded p-2" value={alertCondition} onChange={(e) => setAlertCondition(e.target.value)} >
                            <option value="<=">Less than or equal to</option>
                            <option value=">=">Greater than or equal to</option>
                            <option value="==">Equal to</option>
                        </select>
                        <Input type="number" placeholder="Target Price" className="placeholder:text-gray-400" value={alertValue} onChange={(e) => setAlertValue(e.target.value)} />
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default AlertDialog;