import { FC } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import CoinListTable from "@/components/CoinListTable";
import { UserList } from "@/types/Crypto";

interface ListCardProps {
    list: UserList;
    isOpen: boolean;
    onToggle: () => void;
}

const ListCard: FC<ListCardProps> = ({ list, isOpen, onToggle }) => (
    <div className="mb-5 rounded-lg bg-gray-300 p-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
            <h3 className="text-gray-700 text-xl font-semibold">
                {list.name} <span className="text-sm text-gray-600">({list.coins?.length ?? 0})</span>
            </h3>
            {isOpen ? (
                <ChevronUpIcon className="h-5 w-5 text-white" />
            ) : (
                <ChevronDownIcon className="h-5 w-5 text-white" />
            )}
        </div>
        {isOpen && (
            <div className="mt-4">
                <CoinListTable data={list.coins} loading={false} onRemove={() => { }} />
            </div>
        )}
    </div>
);

export default ListCard;
