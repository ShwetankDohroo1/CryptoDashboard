import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
interface Props {
    setEditMode: (v: boolean) => void;
    currency: 'USD' | 'INR';
    setCurrency: (v: 'USD' | 'INR') => void;
}

//profile setting contains Currency changing and edit button to edit username and email
const ProfileSettings = ({ setEditMode, currency, setCurrency }: Props)=>{
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    //this is to close the dropdown if user clicks outside the div area
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex justify-end relative" ref={dropdownRef}>
            <Button type="button" onClick={() => setOpen(prev => !prev)} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700" >
                Settings ⚙️
            </Button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                        type="button"
                        onClick={() => { setEditMode(true); setOpen(false); }} className="w-full text-left px-4 py-2 text-sm transition hover:bg-gray-300" >
                        Edit Profile
                    </button>
                    <button
                        type="button"
                        onClick={() => { setCurrency(currency === 'USD' ? 'INR' : 'USD'); setOpen(false); router.push('/'); }} className="w-full text-left px-4 py-2 text-sm transition hover:bg-gray-300" >
                            To: {currency === 'USD' ? 'INR' : 'USD'}
                    </button>
                </div>
            )}
        </div>
    );
}
export default ProfileSettings;