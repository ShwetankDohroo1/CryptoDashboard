//seaching and filtering type
export interface Props{
    searchQuery: string,
    onSearchQuery: (value:string) => void;
    currentFilter: "all" |"best"|"worst",
    onFilterChange:(type:"all"|"best"|"worst") => void;
}