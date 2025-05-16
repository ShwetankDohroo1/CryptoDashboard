'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { List } from "@/types/List";
import { useState } from "react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onListCreated: (lists: List[]) => void;
    activeCoinId?: string;
};

const CreateListDialog = ({ open, onOpenChange, onListCreated }: Props)=>{
    const [newListName, setNewListName] = useState('');
    const [newListLimit, setNewListLimit] = useState('');

    const handleCreate = async () => {
        const visitorId = localStorage.getItem("fingerprintId");
        if (!visitorId || !newListName.trim()) return;

        const res = await fetch("/api/lists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: visitorId,
                name: newListName.trim(),
                limit: newListLimit ? parseInt(newListLimit) : null,
            }),
        });

        const data = await res.json();
        if (data.success) {
            toast.success("List created");

            const refreshRes = await fetch(`/api/lists?visitorId=${visitorId}`);
            const refreshedData = await refreshRes.json();
            if (refreshedData.success) {
                onListCreated(refreshedData.lists);
            }

            onOpenChange(false);
            setNewListName('');
            setNewListLimit('');
        } else {
            toast.error(data.error || "Failed to create list");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New List</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input placeholder="List Name" className="placeholder:text-gray-400"
                        value={newListName} onChange={(e) => setNewListName(e.target.value)} />
                    <Input type="number" placeholder="Limit (optional)" min={5}
                        className="placeholder:text-gray-400"
                        value={newListLimit} onChange={(e) => setNewListLimit(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CreateListDialog;