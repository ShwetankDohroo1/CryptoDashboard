import { useEffect, useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAllCoins } from '@/lib/api/coinApi';

//
export const useUserCoinList = () => {
    const [listCoins, setListCoins] = useState<string[]>([]);
    const [visitorId, setVisitorId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: allCoins = [], isLoading: isCoinsLoading } = useAllCoins();

    useEffect(() => {
        const id = localStorage.getItem('fingerprintId');
        if (id) setVisitorId(id);
    }, []);

    const { data: listCoinData, isLoading: isListLoading } = useQuery({
        queryKey: ['listCoin', visitorId],
        queryFn: async () => {
            const res = await fetch(`/api/user/listCoin?visitorId=${visitorId}`);
            const data = await res.json();
            return data.listCoin || [];
        },
        enabled: !!visitorId
    });

    useEffect(() => {
        if (listCoinData) {
            setListCoins(listCoinData);
        }
    }, [listCoinData]);

    //coins the user has saved
    const displayedCoins = useMemo(
        () => allCoins.filter(c => listCoins.includes(c.id)),
        [allCoins, listCoins]
    );

    //all other coins
    const nonListCoins = useMemo(
        () => allCoins.filter(c => !listCoins.includes(c.id)),
        [allCoins, listCoins]
    );

    //adding coins to tanstack
    const addCoinMutation = useMutation({
        mutationFn: async (coinId: string) => {
            return fetch('/api/user/listCoin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitorId, coinId }),
            });
        },
        onSuccess: () => {
            if (visitorId) {
                queryClient.invalidateQueries({ queryKey: ['listCoin', visitorId] });
            }
        }
    });

    //removing coins from tanstack
    const removeCoinMutation = useMutation({
        mutationFn: async (coinId: string) => {
            return fetch('/api/user/listCoin', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitorId, coinId }),
            });
        },
        onSuccess: () => {
            if (visitorId) {
                queryClient.invalidateQueries({ queryKey: ['listCoin', visitorId] });
            }
        }
    });

    const addCoin = (coinId: string) => {
        if (coinId) {
            addCoinMutation.mutate(coinId);
        }
    };

    const removeCoin = (coinId: string) => {
        removeCoinMutation.mutate(coinId);
    };

    return { loading: isCoinsLoading || isListLoading, displayedCoins, nonListCoins, addCoin, removeCoin };
};
