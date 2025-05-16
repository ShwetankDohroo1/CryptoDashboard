import { useState, useMemo, useCallback, useEffect } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Crypto } from "@/types/Crypto";
import ListColumn from "./ListColumn";
import ListTableBody from "./ListTableBody";
import toast from "react-hot-toast";
import { List } from "@/types/List";
import AlertDialog from "../DialogBoxs/alertDialogBox";
import AddToListDropdown from "../DialogBoxs/addToListDialogBox";
import { checkAndTriggerAlerts } from "@/lib/checkAlert";
import { CoinAlert } from "@/types/coinAlert";
import CreateListDialog from "../DialogBoxs/CreateListBox";

//This is the main component of List Table, where we defines functionality of columms or etc.
type Props = {
    data: Crypto[];
};

const ListTable = ({ data }: Props)=>{
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);
    const [activeCoinId, setActiveCoinId] = useState<string | null>(null);
    const [userLists, setUserLists] = useState<List[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertCoin, setAlertCoin] = useState<Crypto | null>(null);
    const [coinAlerts, setCoinAlerts] = useState<Record<string, CoinAlert>>({});
    const [cryptoList, setCryptoList] = useState<Crypto[]>(data);

    useEffect(() => {
        //get users alerts
        const loadAlerts = async () => {
            const visitorId = localStorage.getItem("fingerprintId");
            if (!visitorId) return;

            const res = await fetch(`/api/alerts?visitorId=${visitorId}`);
            const data = await res.json();

            if (data.success && data.alerts) {
                setCoinAlerts(data.alerts);
            }
        };

        loadAlerts();
    }, []);

    //adding to alerts
    useEffect(() => {
        if (Object.keys(coinAlerts).length > 0) {
            checkAndTriggerAlerts(data, coinAlerts);
        }
    }, [data, coinAlerts]);

    useEffect(() => {
        const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
        const favMap = Object.fromEntries(favs);
        const updated = data.map(c => ({ ...c, isFavorite: !!favMap[c.id] }));
        setCryptoList(updated);
    }, [data]);

    useEffect(() => {
        //get users lists
        const loadLists = async () => {
            const visitorId = localStorage.getItem("fingerprintId");
            if (!visitorId) return;
            try {
                const res = await fetch(`/api/lists?visitorId=${visitorId}`);
                const text = await res.text();
                if (!text) return;

                const data = JSON.parse(text);
                if (data.success) setUserLists(data.lists);
            } catch (err) {
                console.error("Failed to load user lists:", err);
            }
        };
        loadLists();
    }, []);

    //marking fav a coin
    const markFav = useCallback((id: string) => {
        setCryptoList(prev => {
            const updated = prev.map((item) =>
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            );
            const favs = updated
                .filter((item) => item.isFavorite)
                .map((item) => [item.id, true]);

            localStorage.setItem("favorites", JSON.stringify(favs));
            return updated;
        });
    }, []);

    //sorting the list according to the favs, favs at top
    const sortedData = useMemo(() => {
        return [...cryptoList].sort((a, b) => {
            if (a.isFavorite === b.isFavorite) return 0;
            return a.isFavorite ? -1 : 1;
        });
    }, [cryptoList]);

    //adding coin to list
    const addToListComponent = useCallback((coinId: string) => (
        <AddToListDropdown coinId={coinId} userLists={userLists}
            onListCreated={() => {
                setDialogOpen(true);
                setActiveCoinId(coinId);
            }} />
    ), [userLists]);

    //adding coin to alert
    const addAlert = useCallback((coinId: string) => {
        const coin = data.find(c => c.id === coinId);
        if (!coin) {
            toast.error("Coin not found");
            return;
        }
        setAlertCoin(coin);
        setAlertDialogOpen(true);
    }, [data]);

    //table connection
    const table = useReactTable({
        data: sortedData,
        columns: ListColumn(markFav, addToListComponent, addAlert),
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <ListTableBody table={table} />
            <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen} coin={alertCoin} />
            <CreateListDialog open={dialogOpen} onOpenChange={setDialogOpen} onListCreated={(lists) => setUserLists(lists)} activeCoinId={activeCoinId ?? undefined} />
        </>
    );
}
export default ListTable;