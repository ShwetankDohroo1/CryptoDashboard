import { ColumnDef } from "@tanstack/react-table";
import { Crypto } from "@/types/Crypto";
import { formatNumber } from "@/lib/formatNumber";
import Link from "next/link";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { JSX } from "react";

//this function defines what every column will have and how will they function
const ListColumn = (toggleFavorite: (id: string) => void, addToListComponent: (coinId: string) => JSX.Element, addAlert: (id: string) => void): ColumnDef<Crypto>[] => {

    const currency = typeof window !== 'undefined' && localStorage.getItem('currency') === 'INR' ? 'INR' : 'USD';
    const rate = 85;

    const convert = (value: number) => {
        return currency === 'INR' ? `₹${formatNumber(value * rate)}` : `$${formatNumber(value)}`;
    };


    return [
        {
            header: "Favorite",
            cell: ({ row }) => (
                <button onClick={() => toggleFavorite(row.original.id)}>
                    {row.original.isFavorite ? '★' : '☆'}
                </button>
            ),
        },
        {
            accessorKey: "name",
            header: "Coins",
            cell: ({ row }) => {
                const { name, symbol, id } = row.original;
                return (
                    <Link href={`/coin/${id}`} className="block">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">{symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{name}</div>
                                <div className="text-sm text-gray-500">{symbol}</div>
                            </div>
                        </div>
                    </Link>
                );
            },
        },
        {
            accessorKey: "priceUsd",
            header: "Price",
            cell: ({ row }) => {
                const { id } = row.original;
                return (
                    <Link href={`/coin/${id}`} className="block">
                        <div className="text-gray-900 font-medium">
                            {convert(row.original.priceUsd)}
                        </div>
                    </Link>
                );
            }
        },
        {
            accessorKey: "supply",
            header: "Supply",
            cell: ({ row }) => {
                const { id } = row.original;
                return (
                    <Link href={`/coin/${id}`} className="block">
                        <div className="text-gray-700 text-lg">
                            {formatNumber(row.original.supply)}
                        </div>
                    </Link>
                );
            }
        },
        {
            accessorKey: "market_cap",
            header: "Market Cap",
            cell: ({ row }) => {
                const { id } = row.original;
                return (
                    <Link href={`/coin/${id}`} className="block">
                        <div className="text-gray-900">
                            {convert(row.original.market_cap)}
                        </div>
                    </Link>
                );
            }
        },
        {
            accessorKey: "volume24Hr",
            header: "Volume (24h)",
            cell: ({ row }) => {
                const { id } = row.original;
                return (
                    <Link href={`/coin/${id}`} className="block">
                        <div className="text-gray-900">
                            {convert(row.original.volume24Hr)}
                        </div>
                    </Link>
                );
            }
        },
        {
            accessorKey: "per24hr",
            header: "24h Change",
            cell: ({ row }) => {
                const { id, per24hr } = row.original;
                const isPositive = per24hr >= 0;
                return (
                    <Link href={`/coin/${id}`} className="block">
                        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-500'
                            }`}>
                            {isPositive ? (
                                <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                                <ArrowDownIcon className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                                {Math.abs(per24hr).toFixed(2)}%
                            </span>
                        </div>
                    </Link>
                );
            }
        },
        {
            header: "Add to List",
            cell: ({ row }) => (
                addToListComponent(row.original.id)
            ),
        },
        {
            header: "Add Alert",
            cell: ({ row }) => (
                <Button variant="outline" size="sm" onClick={() => addAlert(row.original.id)}>
                    Alert
                </Button>
            ),
        }
    ]
};
export default ListColumn;