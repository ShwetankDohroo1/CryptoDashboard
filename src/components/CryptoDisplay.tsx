import ListTable from "@/components/ListView/ListTable";
import CryptoGrid from "@/components/GridView/gridViewBody";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Crypto } from "@/types/Crypto";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

//LIST OR GRID VIEW
type Props = {
    view: "list" | "grid";
    data: Crypto[];
    showMore: () => void;
    canShowMore: boolean;
    searchQuery: string;
    onSearchQuery: (query: string) => void;
    currentFilter: "all" | "best" | "worst";
    onFilterChange: (filter: "all" | "best" | "worst") => void;
    onViewChange: (view: "list" | "grid") => void;
};

//this is func to display user all cryptos in list view or grid view and also using search and filter also here
const CryptoDisplay = ({ view, data, showMore, canShowMore, searchQuery, onSearchQuery, currentFilter, onFilterChange, onViewChange }: Props)=>{
    return (
        <>
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-7xl mx-auto px-4">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input type="text" value={searchQuery} onChange={(e) => onSearchQuery(e.target.value)} placeholder="Search cryptocurrencies..." className="pl-10 border-gray-200 text-gray-300 placeholder-gray-500 w-full"/>
                    </div>
                    <div className="flex items-center gap-4">
                        <Select value={currentFilter} onValueChange={(value) => onFilterChange(value as "all" | "best" | "worst")}>
                            <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-900">
                                <SelectValue placeholder="Select filter" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                                <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All</SelectItem>
                                <SelectItem value="best" className="text-gray-900 hover:bg-gray-100">Best Performers</SelectItem>
                                <SelectItem value="worst" className="text-gray-900 hover:bg-gray-100">Worst Performers</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => onViewChange(view === "list" ? "grid" : "list")} className="bg-white text-gray-900 border-gray-200 hover:bg-gray-100" >
                            {view === "list" ? "Grid View" : "List View"}
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === "list" ? (
                    <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.1 }}>
                        <h1 className="text-3xl font-bold text-white mb-6">List View</h1>
                        <ListTable data={data} />
                    </motion.div>
                ) : (
                    <motion.div key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.map((crypto) => (
                            <Link key={crypto.id} href={`/coin/${crypto.id}`} passHref>
                                <CryptoGrid crypto={crypto} />
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {canShowMore && (
                <div className="flex justify-center mt-8">
                    <Button variant="ghost" onClick={showMore} className="bg-gray-400">
                        Show More
                    </Button>
                </div>
            )}
        </>
    );
}
export default CryptoDisplay;