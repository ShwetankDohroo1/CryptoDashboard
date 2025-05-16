'use client';
import { useState } from "react";
import { filterData } from "@/lib/filterData";
import { useRegisterUser } from "@/hooks/useRegisterUser";
import Navbar from "@/components/Navbar/Navbar";
import Skeleton from "@/components/ui/Skeleton";
const CryptoDisplay = dynamic(() => import('@/components/CryptoDisplay'), { ssr: false });
import { useAllCoins } from "@/lib/api/coinApi";
import dynamic from "next/dynamic";

const Home = ()=>{
  const [view, setView] = useState<"list" | "grid">("list");
  const [displayCount, setCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<"all" | "best" | "worst">("all");

  useRegisterUser();

  const { data, isLoading, isError, error } = useAllCoins();

  const showMore = () => setCount(prev => prev + 20);

  const filteredData = filterData(data || [], searchQuery, filter);
  const displayedData = filteredData.slice(0, displayCount);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-2">{[...Array(5)].map((_, idx) => <Skeleton key={idx} className="h-12 w-full" />)}</div>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  return (
    <div className="min-h-screen bg-[#28282B]">
      <Navbar />
      <div className="w-10/12 mx-auto px-4 py-8">
        <CryptoDisplay view={view} data={displayedData} showMore={showMore} canShowMore={displayCount < (filteredData?.length || 0)} searchQuery={searchQuery} onSearchQuery={setSearchQuery} currentFilter={filter} onFilterChange={setFilter} onViewChange={setView}/>
      </div>
    </div>
  );
}
export default Home;
