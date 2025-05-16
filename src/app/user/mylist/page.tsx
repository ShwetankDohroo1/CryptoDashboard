"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { getUserLists } from "@/service/mylist/list-service";
import ListCard from "@/components/MyList/listcard";
import ListCardSkeleton from "@/components/MyList/skeleton";
import { UserList } from "@/types/Crypto";

//THIS IS THE PAGE THAT SHOWS USER CREATED LIST AND ALSO ITEMS UNDER EVERY LIST HE CREATED
const MyList = ()=>{
    const [lists, setLists] = useState<UserList[]>([]);
    const [openListId, setOpenListId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    //to get lists of user
    useEffect(() => {
        const loadLists = async () => {
            const result = await getUserLists();
            setLists(result);
            setLoading(false);
        };
        loadLists();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="max-w-6xl w-8/12 mx-auto p-6">
                <h2 className="text-3xl font-bold text-gray-200 mb-6">Your Lists</h2>

                {loading ? (
                    <>
                        {[...Array(2)].map((_, index) => (
                            <ListCardSkeleton key={index} />
                        ))}
                    </>
                ) : lists.length === 0 ? (
                    <p className="text-gray-400">No lists found.</p>
                ) : (
                    lists.map((list) => (
                        <ListCard
                            key={list.id}
                            list={list}
                            isOpen={openListId === list.id}
                            onToggle={() => setOpenListId(openListId === list.id ? null : list.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
export default MyList;
