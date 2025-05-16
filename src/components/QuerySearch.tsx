'use client';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Props } from "@/types/SearchProp";

//filtering function
const QuerySearch = ({searchQuery, onSearchQuery, currentFilter, onFilterChange} : Props)=>{
    return(
        <div className="flex flex-wrap items-center gap-4 mb-4 w-full max-w-4xl justify-center">
            <Input placeholder="Search Coin by name or symbol.." className="mb-2 text-white" value={searchQuery} onChange={(e) => onSearchQuery(e.target.value.toLowerCase())}/>
            <Button onClick={() => onFilterChange("all")} variant={currentFilter == "all" ? 'default' : 'outline'}>
                All
            </Button>
            <Button onClick={() => onFilterChange("best")} variant={currentFilter == "best" ? 'default' : 'outline'}>
                Best
            </Button>
            <Button onClick={() => onFilterChange("worst")} variant={currentFilter == "worst" ? 'default' : 'outline'}>
                Worst   
            </Button>
        </div>
    );
}
export default QuerySearch;