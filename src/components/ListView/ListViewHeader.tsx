// components/ListViewHeader.tsx
import { Crypto } from "@/types/Crypto";
import ListTable from "./ListTable";

type ListViewHeaderProps = {
    displayedData: Crypto[];
};

const ListViewHeader = ({ displayedData }: ListViewHeaderProps)=>{
    return (
        <>
            <div className="flex flex-col items-center border rounded-lg p-6 bg-[#edeeff] w-full">
                <ListTable data={displayedData} />
            </div>
        </>
    );
}
export default ListViewHeader;