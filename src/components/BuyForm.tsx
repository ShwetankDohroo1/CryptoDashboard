import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Skeleton from './ui/Skeleton';
import { formatNumber } from '@/lib/formatNumber';

type BuyFormProps = {
    coinId: string;
    priceUsd: number;
    symbol: string;
    setIsDialogOpen: (open: boolean) => void;
};

type FormData = {
    username: string;
    email: string;
    quantity: number;
}

//This is the dialog box that allows user to buy specific crypto, If user is buying or the first time, he has to give input username and email also
const BuyForm = ({ coinId, priceUsd, symbol, setIsDialogOpen }: BuyFormProps)=>{
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>();
    const [total, setTotal] = useState<number>(0);
    const [userExists, setUserExists] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const currency = typeof window !== 'undefined' && localStorage.getItem('currency') === 'INR' ? 'INR' : 'USD';
    const rate = 85;

    const convert = (value: number) => {
        return currency === 'INR' ? `₹${formatNumber(value * rate)}` : `$${formatNumber(value)}`;
    };

    const fingerprintIdRef = useRef<string | null>(null);
    
    //checking if user exists or not
    useEffect(() => {
        const fid = localStorage.getItem('fingerprintId');
        fingerprintIdRef.current = fid;

        if (fid) {
            fetch(`/api/users/${fid}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data?.username && data?.email) {
                        setUserExists(true);
                    }
                })
                .finally(() => setIsLoading(false));
        }
        else {
            setIsLoading(false);
        }
    }, []);

    //this is to watch quantity and give user amount the has to pay
    const watchedQuantity = watch("quantity");
    useEffect(() => {
        const qty = Number(watchedQuantity);
        if (!isNaN(qty) && qty > 0) {
            setTotal(qty * priceUsd);
        }
        else {
            setTotal(0);
        }
    }, [watchedQuantity, priceUsd]);


    const onSubmit = async (data: FormData) => {
        const fingerprintId = fingerprintIdRef.current;
        if (!fingerprintId) {
            toast.error('User not registered. Please refresh the page.');
            return;
        }
        const totalamount = Number(data.quantity) * priceUsd;
        const buyPrice = priceUsd;
        setTotal(totalamount);
        console.log("Payload:", { ...data, coinId, totalamount, buyPrice, fingerprintId });

        const resp = await fetch('/api/trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, coinId, totalamount, buyPrice, fingerprintId }),
        });
        const result = await resp.json();
        if (resp.ok) {
            toast.success('Purchase successful!');
            reset();
            setIsDialogOpen(false);
        }
        else {
            toast.error(result.error || 'Transaction failed');
        }
    }

    if (isLoading) {
        return (
            <div className="mb-6 bg-[#1a1a1a] p-6 rounded-lg space-y-4 animate-pulse">
                <Skeleton className="h-6 w-32 mb-4" />

                <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full rounded-md bg-green-700" />
            </div>
        );
    }
    return (
        <div className="mb-6 bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-2xl text-white mb-4">Buy {symbol.toUpperCase()}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {!isLoading && !userExists && (
                    <>
                        <div>
                            <Label htmlFor="username" className="text-white">Username</Label>
                            <Input id="username" type="text" className='text-white m-2' {...register("username", { required: true })} />
                            {errors.username && <p className="text-red-400 text-sm mt-1">Username is required</p>}
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input id="email" type="email" className='text-white m-2' {...register("email", { required: true })} />
                            {errors.email && <p className="text-red-400 text-sm mt-1">Email is required</p>}
                        </div>
                    </>
                )}

                <div>
                    <Label htmlFor="quantity" className="text-white">Quantity</Label>
                    <Input id="quantity" type="number" step="0.01" className="text-white m-2" {...register("quantity", { required: true, min: 0.01, valueAsNumber: true })} />
                    {errors.quantity && <p className="text-red-400 text-sm mt-1">Enter a valid quantity</p>}
                </div>

                <p className="text-white">Total: <span className="font-semibold">{convert(total)}</span></p>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Confirm Purchase
                </Button>
            </form>
        </div>
    );
}
export default BuyForm;