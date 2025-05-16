const StatCard = ({ label, value }: { label: string, value: string })=>{
    return (
        <div>
            <p className="text-gray-700 font-semibold text-lg">{label}</p>
            <p className="text-2xl font-bold text-center text-black/40">{value}</p>
        </div>
    );
}
export default StatCard;