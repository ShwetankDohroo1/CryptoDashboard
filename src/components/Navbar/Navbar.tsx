'use client';
import { Button } from "../ui/button";
import Link from 'next/link';
import { usePathname } from "next/navigation";

//MAIN HEADER FOR ALL THE ROUTES
const Navbar = ()=>{
    const pathname = usePathname();

    //header items and highlighting feature
    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/user/mylist", label: "My List" },
        { href: "/user/transactions", label: "Transactions" },
        { href: "/user/profile", label: "Profile" },
        { href: "/alerts", label: "Alerts" },
    ];

    return (
        <nav className="bg-[#1a1a1a] border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-300 to-blue-300 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">CD</span>
                        </div>
                        <span className="ml-2 text-white font-bold text-xl">CryptoDash</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {navLinks.map(({ href, label }) => (
                            <Link key={href} href={href}>
                                <Button variant={'default'} className={`text-lg ${pathname === href ? "bg-black/20 text-white" : "text-white hover:bg-black/70" }`} >
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;