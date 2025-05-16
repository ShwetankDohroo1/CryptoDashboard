import { useState } from "react";
import { Button } from "@/components/ui/button";
import { List } from "@/types/List";
import toast from "react-hot-toast";

type Props = {
    coinId: string;
    userLists: List[];
    onListCreated: () => void;
};

const AddToListDropdown = ({ coinId, userLists, onListCreated }: Props)=>{
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleAddToList = async (id: string, listName: string) => {
        const res = await fetch(`/api/lists/${id}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coinId }),
        });
        const result = await res.json();

        if (result.success) {
            toast.success(`Added to ${listName}`);
        } 
        else {
            toast.error(result.error || "Failed to add");
        }

        setDropdownOpen(false);
    };

    return (
        <div className="relative">
            <Button variant="ghost" className="relative z-10"
                onClick={() => setDropdownOpen(prev => !prev)} >
                +
            </Button>

            {dropdownOpen && (
                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-20 w-48 bg-white rounded shadow-lg overflow-hidden flex flex-col gap-2">
                    {userLists
                        .filter(list => !list.limit || list.coinsCount < list.limit)
                        .map(list => (
                            <Button key={list.id} className="w-full justify-start bg-gray-700 hover:bg-gray-400 hover:text-black"
                                onClick={() => handleAddToList(list.id, list.name)} >
                                {list.name}
                            </Button>
                        ))}
                    <Button className="w-full justify-start hover:bg-gray-400 hover:text-black"
                        onClick={() => {
                            onListCreated();
                            setDropdownOpen(false); }} >
                        ➕ Create New List
                    </Button>
                </div>
            )}
        </div>
    );
}
export default AddToListDropdown;