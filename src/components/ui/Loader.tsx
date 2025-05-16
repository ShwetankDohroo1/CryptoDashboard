export default function Loader(){
    return(
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#28282B]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-purple-500 animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-4 border-b-transparent border-yellow-400 animate-spin reverse"></div>
            </div>
            <p className="mt-4 text-white text-xl font-semibold animate-pulse">Fetching the Cryptos for you..</p>
        </div>
    );
}