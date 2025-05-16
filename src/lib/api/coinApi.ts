import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Crypto } from '@/types/Crypto';
import { CryptoHistoryResponse } from '@/types/History';

//API endpoints
const COINS_ENDPOINT = '/api/coins';
const COIN_ENDPOINT = (coinId: string) => `/api/coins/${coinId}`;
const COIN_HISTORY_ENDPOINT = (coinId: string, interval: string) => `/api/coins/${coinId}/history?interval=${interval}`;

//query keys
export const queryKeys = {
    allCoins: ['crypto'] as const,
    singleCoin: (coinId: string) => ['crypto', coinId] as const,
    coinHistory: (coinId: string, interval: string) => ['coin-history', coinId, interval] as const,
};

//fetch functions
const fetchAllCoins = async (): Promise<Crypto[]> => {
    console.log('[FETCH] fetchAllCoins called');
    const response = await axios.get(COINS_ENDPOINT);
    if (!response.data.coins) {
        throw new Error('Invalid response format from API');
    }
    return response.data.coins;
};

const fetchSingleCoin = async (coinId: string): Promise<Crypto> => {
    console.log(`[FETCH] fetchSingleCoin called with coinId: ${coinId}`);
    const response = await axios.get(COIN_ENDPOINT(coinId));
    if (!response.data) {
        throw new Error('Failed to fetch coin data');
    }
    return response.data;
};

const fetchCoinHistory = async (coinId: string, interval: string): Promise<CryptoHistoryResponse> => {
    console.log(`[FETCH] fetchCoinHistory called with coinId: ${coinId}, interval: ${interval}`);
    const response = await axios.get(COIN_HISTORY_ENDPOINT(coinId, interval));
    if (!response.data) {
        throw new Error('Failed to fetch coin history');
    }
    return response.data;
};

//react-query hooks
export const useAllCoins = () => {
    console.log('[HOOK] useAllCoins hook initialized');
    return useQuery({
        queryKey: queryKeys.allCoins,
        queryFn: fetchAllCoins,
        staleTime: 5000000,
        refetchInterval: 5000000,
        refetchOnWindowFocus: false,
    });
};

export const useSingleCoin = (coinId: string) => {
    console.log(`[HOOK] useSingleCoin hook initialized with coinId: ${coinId}`);
    return useQuery({
        queryKey: queryKeys.singleCoin(coinId),
        queryFn: () => fetchSingleCoin(coinId),
        enabled: !!coinId,
        staleTime: 5000000,
        refetchInterval: 5000000,
        refetchOnWindowFocus: false,
    });
};

export const useCoinHistory = (coinId: string, interval: string) => {
    console.log(`[HOOK] useCoinHistory hook initialized with coinId: ${coinId}, interval: ${interval}`);
    return useQuery({
        queryKey: queryKeys.coinHistory(coinId, interval),
        queryFn: () => fetchCoinHistory(coinId, interval),
        enabled: !!coinId,
        staleTime: 5000000,
        refetchInterval: 5000000,
        refetchOnWindowFocus: false,
    });
};

//prefetch functions
export const prefetchCoin = async (queryClient: ReturnType<typeof useQueryClient>, coinId: string) => {
    console.log(`[PREFETCH] prefetchCoin called with coinId: ${coinId}`);
    await queryClient.prefetchQuery({
        queryKey: queryKeys.singleCoin(coinId),
        queryFn: () => fetchSingleCoin(coinId),
    });
};

export const prefetchCoinHistory = async (
    queryClient: ReturnType<typeof useQueryClient>,
    coinId: string,
    interval: string) => {
    console.log(`[PREFETCH] prefetchCoinHistory called with coinId: ${coinId}, interval: ${interval}`);
    await queryClient.prefetchQuery({
        queryKey: queryKeys.coinHistory(coinId, interval),
        queryFn: () => fetchCoinHistory(coinId, interval),
    });
};
