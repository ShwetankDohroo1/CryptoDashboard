'use client';

import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar/Navbar";
import Skeleton from "@/components/ui/Skeleton";
import { getCoinPrices, getUserTransactions } from "@/service/transaction/transaction-service";
import TransactionTable from "@/components/Transactions/table";
import StatCard from "@/components/Transactions/stat-card";
import { convert } from "@/components/Transactions/currency-util";
import { Transactions } from "@/types/Transaction";

const Transaction = ()=>{
    const [fingerprintId, setFingerprintId] = useState('');
    const [prices, setPrices] = useState<Record<string, number>>({});

    const { data: transactions, isLoading } = useQuery<Transactions[]>({
        queryKey: ['transactions', fingerprintId],
        queryFn: () => getUserTransactions(fingerprintId),
        enabled: !!fingerprintId,
    });

    useEffect(() => {
        const id = localStorage.getItem('fingerprintId');
        if (id) setFingerprintId(id);
    }, []);

    //creating a set of all the transactions with coindId
    useEffect(() => {
        if (!transactions || !transactions.length) 
            return;
        const ids = [...new Set(transactions.map(tx => tx.coinId))];
        getCoinPrices(ids).then(setPrices);
    }, [transactions]);

    const totalCoins = useMemo(() => transactions?.reduce((sum, tx) => sum + tx.quantity, 0) || 0, [transactions]);
    const totalSpent = useMemo(() => transactions?.reduce((sum, tx) => sum + tx.totalamount, 0) || 0, [transactions]);

    if (!fingerprintId || isLoading) {
        return (
            <div className="w-8/12 mx-auto p-6 space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-20 w-full" />
                <div className="space-y-2">{[...Array(5)].map((_, idx) => <Skeleton key={idx} className="h-12 w-full" />)}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <Navbar />
            <div className="w-8/12 mx-auto p-6">
                <h1 className="text-4xl font-bold text-gray-200 mb-6 text-center">Your Transactions</h1>
                {!transactions?.length ? (
                    <p className="text-gray-300">No transactions found.</p>
                ) : (
                    <>
                        <div className="flex w-full justify-around bg-white/80 backdrop-blur-3xl p-6 rounded-lg shadow-lg mb-6">
                            <StatCard label="Total Coins Owned" value={totalCoins.toString()} />
                            <StatCard label="Total Amount Spent" value={convert(totalSpent)} />
                        </div>
                        <TransactionTable transactions={transactions} prices={prices} />
                    </>
                )}
            </div>
        </div>
    );
}
export default Transaction;