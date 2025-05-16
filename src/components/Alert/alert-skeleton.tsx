const AlertSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
        ))}
    </div>
);

export default AlertSkeletons;
