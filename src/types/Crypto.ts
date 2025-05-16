//each crypto type must be below
export interface Crypto {
    id: string,
    rank:number,
    name: string,
    symbol: string,
    priceUsd: number,
    supply: number,
    market_cap: number,
    volume24Hr: number,
    per24hr: number,
    vwap24hr: number,
    isFavorite: boolean,
}
export interface UserList {
    id: string;
    name: string;
    coins: Crypto[];
  }
  