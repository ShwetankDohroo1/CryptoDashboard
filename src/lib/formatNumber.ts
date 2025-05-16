
//formating number into readable form
export const formatNumber = (num: number | undefined| null): string => {
    if(typeof num !== 'number' || isNaN(num)){
        return 'N/A';
    }
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(2) + "B";
    }
    else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2) + "M";
    }
    else if (num >= 1_000) {
        return (num / 1_000).toFixed(2) + "K";
    }
    return num.toLocaleString();
};
