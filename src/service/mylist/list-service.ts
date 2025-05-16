import { UserList } from "@/types/Crypto";

export const getUserLists = async (): Promise<UserList[]> => {
    const visitorId = localStorage.getItem("fingerprintId");
    if (!visitorId) return [];

    const res = await fetch(`/api/user/allLists?visitorId=${visitorId}`);
    const data = await res.json();
    return data.success ? data.lists : [];
};
