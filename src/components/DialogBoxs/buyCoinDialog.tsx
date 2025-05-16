import { FC } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import BuyForm from "@/components/BuyForm";

interface BuyCoinDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    coinId: string;
    coinName: string;
    coinSymbol: string;
    coinPrice: number;
}

const BuyCoinDialog: FC<BuyCoinDialogProps> = ({ isOpen, onOpenChange, coinId, coinName, coinSymbol, coinPrice }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg font-semibold rounded-lg">
                Buy {coinSymbol.toUpperCase()}
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a]">
            <DialogHeader>
                <DialogTitle className="text-white">Buy {coinName}</DialogTitle>
            </DialogHeader>
            <DialogClose asChild>
                <Button className="absolute top-4 right-4 text-white hover:text-red-400 transition" aria-label="Close">
                    <X className="h-5 w-5" />
                </Button>
            </DialogClose>
            <BuyForm coinId={coinId} priceUsd={coinPrice} symbol={coinSymbol} setIsDialogOpen={onOpenChange} />
        </DialogContent>
    </Dialog>
);

export default BuyCoinDialog;
