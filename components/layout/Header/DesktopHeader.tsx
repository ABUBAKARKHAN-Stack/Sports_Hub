"use client";

import { navLinks } from "@/constants/main.constants";
import {  ChevronDown } from "lucide-react";
import Link from "next/link";
import {  FC } from "react";
import { usePathname } from "next/navigation";


type Props = {
   
};

const DesktopHeader: FC<Props> = () => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
            <nav className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => {
                    const active = isActive(link.href);

                    return (
                        <div key={link.label} className="relative group">
                            <Link
                                href={link.href}
                                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${active
                                    ? "text-[#00A575] bg-green-50"
                                    : "text-gray-700 hover:text-[#00A575] hover:bg-green-50"
                                    }`}
                            >
                                {link.label}
                                {link.submenu && <ChevronDown className="h-4 w-4" />}
                            </Link>

                            {/* DROPDOWN */}
                            {link.submenu && (
                                <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
                                        {link.submenu.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                className={`flex items-center px-4 py-3 text-gray-700 hover:text-[#00A575] hover:bg-green-50 transition-colors ${isActive(item.href) ? "text-[#00A575] bg-green-50" : ""
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
    );
};

export default DesktopHeader;
