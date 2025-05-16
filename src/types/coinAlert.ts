export interface CoinAlert {
    condition: "<=" | ">=" | "==";
    value: number;
    isActive: boolean;
    lastNotified: string | null;
}