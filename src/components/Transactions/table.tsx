import { motion } from "framer-motion";
import { Transactions } from "@/types/Transaction";
import { convert } from "./currency-util";
import Cell from "./table-cell";
import Header from "./table-header";

const TransactionTable = ({ transactions, prices }: { transactions: Transactions[]; prices: Record<string, number> })=>{
    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-[#edeeff] text-semibold">
                <thead className="bg-[#edeeff] text-gray-500 text-lg">
                    <tr>
                        <Header>Coin</Header>
                        <Header align="right">Qty</Header>
                        <Header align="right">Buy Price</Header>
                        <Header align="right">Total Spent</Header>
                        <Header align="right">Current Price</Header>
                        <Header align="right">P/L</Header>
                        <Header align="right">Purchased On</Header>
                    </tr>
                </thead>
                <motion.tbody layout initial="hidden" animate="visible">
                    {transactions.map((tx, idx) => {
                        const current = prices[tx.coinId] ?? 0;
                        const pnl = tx.buyPrice ? (current - tx.buyPrice) * tx.quantity : 0;
                        const gain = current > tx.buyPrice;
                        return (
                            <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className={`text-md transition ${gain ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'}`} >
                                <Cell>{tx.coinId.toUpperCase()}</Cell>
                                <Cell align="right">{tx.quantity}</Cell>
                                <Cell align="right">{convert(tx.buyPrice)}</Cell>
                                <Cell align="right">{convert(tx.totalamount)}</Cell>
                                <Cell align="right">{convert(current)}</Cell>
                                <Cell align="right" className={gain ? 'text-green-500' : 'text-red-500'}>
                                    {tx.buyPrice ? convert(pnl) : 'N/A'}
                                </Cell>
                                <Cell align="right">{tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'N/A'}</Cell>
                            </motion.tr>
                        );
                    })}
                </motion.tbody>
            </table>
        </div>
    );
}
export default TransactionTable;