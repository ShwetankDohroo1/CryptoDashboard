'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import Navbar from '@/components/Navbar/Navbar';
import Skeleton from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import ProfileSettings from '@/components/Profile/ProfileSetting';
import ProfileStats from '@/components/Profile/ProfileStats';
import ProfileDetails from '@/components/Profile/ProfileDetails';

import { User } from '@/types/User';
import { Transactions } from '@/types/Transaction';
import { fetchTransactionData } from '@/lib/api/getTransaction';
import { fetchUser, updateUser, uploadAvatar, logoutUser } from '@/service/profile/user-service';

const Profile = ()=>{
    const [user, setUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

    const router = useRouter();
    const [fingerprintId, setFingerprintId] = useState('');

    //get user details and set them in state
    useEffect(() => {
        const id = localStorage.getItem('fingerprintId');
        if (!id) return;

        setFingerprintId(id);
        fetchUser(id)
            .then(userData => {
                setUser(userData);
                setUsername(userData.username);
                setEmail(userData.email);
            })
            .catch(() => toast.error('Failed to fetch user data'));
    }, []);

    //to get currency from localstorage
    useEffect(() => {
        const saved = localStorage.getItem('currency');
        if (saved === 'INR' || saved === 'USD') setCurrency(saved);
    }, []);

    //to save currency in localstorage
    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    const { data: transactions } = useQuery<Transactions[]>({
        queryKey: ['transactions', fingerprintId],
        queryFn: () => fetchTransactionData(fingerprintId),
        enabled: !!fingerprintId,
    });

    const totalCoins = transactions?.reduce((sum, tx) => sum + tx.quantity, 0) || 0;
    const totalSpent = transactions?.reduce((sum, tx) => sum + tx.totalamount, 0) || 0;

    const handleUpdate = async () => {
        if (!user) return;
        try {
            const updated = await updateUser(user, username, email);
            setUser(updated);
            setEditMode(false);
            toast.success('Profile updated');
        } 
        catch {
            toast.error('Failed to update profile');
        }
    };

    const handleAvatarChange = async (file: File) => {
        if (!user) return;
        try {
            const updated = await uploadAvatar(user.id, file);
            setUser(updated);
            toast.success('Avatar updated');
        } 
        catch {
            toast.error('Failed to upload avatar');
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser(fingerprintId);
            toast.success('Logged out');
            router.push('/');
        } 
        catch {
            toast.error('Failed to logout');
        }
    };

    if (!user) {
        return (
            <div className="max-w-6xl mx-auto p-6 space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-20 w-full" />
                {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#1a1a1a]">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
                <div className="bg-gray-200 p-6 rounded-xl shadow-lg space-y-8 border border-gray-700">
                    <ProfileHeader username={user.username} avatarUrl={user.avatarUrl} onAvatarChange={handleAvatarChange} />
                    <ProfileSettings setEditMode={setEditMode} currency={currency} setCurrency={setCurrency} />
                    <ProfileStats totalCoins={totalCoins} totalSpent={totalSpent} />
                    <ProfileDetails username={username} email={email} editMode={editMode} setUsername={setUsername} setEmail={setEmail} />
                    {editMode ? (
                        <div className="flex gap-3">
                            <Button onClick={handleUpdate}>Save</Button>
                            <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
                        </div>
                    ) : (
                        <div className="flex w-full justify-between">
                            <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded">
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Profile;