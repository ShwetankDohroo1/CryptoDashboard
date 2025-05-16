import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import { Crypto } from '@/types/Crypto';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Skeleton from '@/components/ui/Skeleton';
import { formatNumber } from '@/lib/formatNumber';

type Props = {
    data: Crypto[];
    loading: boolean;
    onRemove: (id: string) => void;
};
//LIST DATA
//This is where we use React table and columndef to display data in the list to the user and using flexRender to render data to header and cell 
const currency = typeof window !== 'undefined' && localStorage.getItem('currency') === 'INR' ? 'INR' : 'USD';
const rate = 85;

const convert = (value: number) => {
    return currency === 'INR' ? `₹${formatNumber(value * rate)}` : `$${formatNumber(value)}`;
};

const CoinListTable = ({ data, loading, onRemove }: Props)=>{
    const columns: ColumnDef<Crypto>[] = [
        { accessorKey: 'name', header: 'Coin', cell: ({ row }) => <span className="uppercase font-semibold">{row.original.name}</span> },
        { accessorKey: 'symbol', header: 'Symbol', cell: ({ row }) => <span className="uppercase">{row.original.symbol}</span> },
        { accessorKey: 'priceUsd', header: 'Price (USD)', cell: ({ row }) => <span>{convert(row.original.priceUsd)}</span> },
        { accessorKey: 'market_cap', header: 'Market Cap', cell: ({ row }) => <span>{convert(row.original.market_cap)}</span> },
        { accessorKey: 'volume24Hr', header: 'Volume 24h', cell: ({ row }) => <span>{convert(row.original.volume24Hr)}</span> },
        { accessorKey: 'supply', header: 'Supply', cell: ({ row }) => <span>{formatNumber(row.original.supply)}</span> },
        { accessorKey: 'vwap24hr', header: 'VWAP 24hr', cell: ({ row }) => <span>{convert(row.original.vwap24hr)}</span> },
        {
            accessorKey: 'changePercent24Hr', header: '% Change 24h', cell: ({ row }) => {
                const val = row.original.per24hr;
                const color = val >= 0 ? 'text-green-600' : 'text-red-500';
                return <span className={color}>{val.toFixed(2)}%</span>;
            }
        },
        { header: 'Remove', cell: ({ row }) => <Button variant="ghost" className='w-full' onClick={() => onRemove(row.original.id)}>❌</Button> },
    ];

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

    if (loading) {
        return (
            <div className="overflow-x-auto rounded-lg shadow bg-white">
                <table className="min-w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>{[...Array(6)].map((_, i) => <th key={i} className="px-6 py-3"><Skeleton className="h-4 w-24" /></th>)}</tr>
                    </thead>
                    <tbody>{[...Array(6)].map((_, r) => (
                        <tr key={r}>{[...Array(6)].map((_, c) => <td key={c} className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>)}</tr>
                    ))}</tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map(group => (
                        <tr key={group.id}>
                            {group.headers.map((header, idx) => (
                                <th key={header.id} className={`px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase ${idx === 0 ? 'w-48' : 'w-32'}`}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row, index) => (
                        <motion.tr key={row.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                            {row.getVisibleCells().map((cell, idx) => (
                                <td key={cell.id} className={`px-4 py-4 whitespace-nowrap text-sm text-gray-800 ${idx === 0 ? 'w-48 truncate' : 'w-32 truncate'}`}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default CoinListTable;