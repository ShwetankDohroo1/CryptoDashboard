import Skeleton from "../ui/Skeleton";

const ListCardSkeleton = ()=>{
    return (
        <div className="mb-5 rounded-lg bg-gray-800 p-4 animate-pulse">
            <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40 bg-gray-700" />
                <Skeleton className="h-5 w-5 bg-gray-700 rounded-full" />
            </div>
            <div className="mt-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full bg-gray-700" />
                ))}
            </div>
        </div>
    );
}
export default ListCardSkeleton;