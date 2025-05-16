import { CameraIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRef } from "react";
import Image from "next/image";
//header of user profile containing username and avatar, avatart changing also
const ProfileHeader = ({ username, avatarUrl, onAvatarChange }: { username: string; avatarUrl?: string; onAvatarChange: (file: File) => void })=>{
    const fileRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-wide">{username || 'User'}</h2>
            <div className="relative">
                {avatarUrl ? (
                    <Image src={avatarUrl} className="h-24 w-24 rounded-full object-cover" alt={"avatar"} />
                ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-semibold">
                        {username ? username.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}
                <Button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow"onClick={() => fileRef.current?.click()}>
                    <CameraIcon className="h-4 w-4 text-gray-700" />
                </Button>
                <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => e.target.files && onAvatarChange(e.target.files[0])} />
            </div>
        </div>
    );
}
export default ProfileHeader;