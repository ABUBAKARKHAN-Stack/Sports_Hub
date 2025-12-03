"use client";

import { navLinks } from "@/constants/main.constants";
import { Bell, ChevronDown, User } from "lucide-react";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
    setUserMenuOpen: Dispatch<SetStateAction<boolean>>;
    userMenuOpen: boolean;
};

const DesktopHeader: FC<Props> = ({ setUserMenuOpen, userMenuOpen }) => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <>

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


            <div className="hidden lg:flex items-center space-x-2">
                {/* Notifications */}
                <button className="relative  text-gray-600 hover:text-[#00A575] transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-0.5 h-2 w-2 bg-destructive rounded-full"></span>
                </button>

                {/* USER MENU */}
                <div className="relative">
                    <Button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="rounded-full hover:cursor-pointer"
                        size={"icon"}
                        variant={"outline"}
                    >

                        <User className="size-5" />

                    </Button>

                    {userMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
                            <Link
                                href="/profile"
                                className="block px-4 py-3 text-gray-700 hover:text-[#00A575] hover:bg-green-50 transition-colors"
                            >
                                My Profile
                            </Link>
                            <Link
                                href="/bookings"
                                className="block px-4 py-3 text-gray-700 hover:text-[#00A575] hover:bg-green-50 transition-colors"
                            >
                                My Bookings
                            </Link>
                            <Link
                                href="/courts"
                                className="block px-4 py-3 text-gray-700 hover:text-[#00A575] hover:bg-green-50 transition-colors"
                            >
                                My Courts
                            </Link>

                            <div className="border-t border-gray-100 my-2"></div>

                            <button className="block w-full text-left px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors">
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* CTA BUTTON */}
                <button className="px-6 py-2.5 rounded-full bg-linear-to-r from-[#00A575] to-[#34C56A] text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all shadow-md">
                    List Your Court
                </button>
            </div>
        </>
    );
};

export default DesktopHeader;
