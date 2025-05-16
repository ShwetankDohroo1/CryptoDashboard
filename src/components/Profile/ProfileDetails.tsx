import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
    username: string;
    email: string;
    editMode: boolean;
    setUsername: (v: string) => void;
    setEmail: (v: string) => void;
}

//Contains username and email of user and an edit mode ui also
const ProfileDetails = ({ username, email, editMode, setUsername, setEmail }: Props)=>{
    return (
        <div className="space-y-4 bg-gray-100 p-4 m-2 rounded">
            <div>
                <Label className="text-gray-600">Username</Label>
                {editMode ? (
                    <Input className="m-2" value={username ?? ''} onChange={(e) => setUsername(e.target.value)} />
                ) : (
                    <p className="text-lg font-medium text-black">{username}</p>
                )}
            </div>
            <div>
                <Label className="text-gray-600">Email</Label>
                {editMode ? (
                    <Input className="m-2" value={email ?? ''} onChange={(e) => setEmail(e.target.value)} />
                ) : (
                    <p className="text-lg font-medium text-black">{email}</p>
                )}
            </div>
        </div>
    );
}
export default ProfileDetails;
