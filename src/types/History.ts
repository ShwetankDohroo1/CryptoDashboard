export interface HistoryData{
    priceUsd: string,
    time:number,
    date:string,
}
export interface CryptoHistoryResponse{
    data: HistoryData[],
}