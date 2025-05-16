import { Crypto } from "@/types/Crypto";
import { flexRender, Table } from "@tanstack/react-table";
import { motion } from "framer-motion";

type Props = {
    table: Table<Crypto>;
};

const ListTableBody = ({ table }: Props)=>{
    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}  className="px-6 py-4 text-left text-md font-medium text-gray-500 uppercase tracking-wider" >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row, index) => {
                            const isNegative = row.original.per24hr < 0;
                            return (
                                <motion.tr key={row.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 24, delay: index * 0.03 }}                                className={`group transition-all duration-200 hover:bg-gray-50 ${ isNegative ? 'hover:bg-red-100' : 'hover:bg-green-100' }`} >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}  className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 group-hover:bg-opacity-50">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default ListTableBody;