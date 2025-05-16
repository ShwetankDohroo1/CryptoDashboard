import { User } from "@/types/User";

export const fetchUser = async (id: string): Promise<User> => {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
};

export const updateUser = async (user: User, username: string, email: string): Promise<User> => {
    const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, avatarUrl: user.avatarUrl }),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
};

export const uploadAvatar = async (userId: string, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/users/${userId}/avatar`, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Failed to upload avatar");
    return res.json();
};

export const logoutUser = async (id: string): Promise<void> => {
    const res = await fetch(`/api/users/${id}/logout`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to logout");
};
