"use client"

import { Dispatch, FC, SetStateAction } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { navLinks } from "@/constants/main.constants";
import { usePathname } from "next/navigation";

interface MobileNavLinksProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileNavLinks: FC<MobileNavLinksProps> = ({ setIsOpen }) => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    }

    return (
        <div className="space-y-1">
            {navLinks.map(link => {
                const active = isActive(link.href)

                return (
                    <div key={link.label}>
                        <Link
                            href={link.href}
                            className={`flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-colors ${active ? 'text-[#00A575] bg-green-50' : 'text-gray-700 hover:text-[#00A575] hover:bg-green-50'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                            {link.submenu && <ChevronDown className="h-5 w-5" />}
                        </Link>

                        {link.submenu && (
                            <div className="ml-6 mt-1 space-y-1">
                                {link.submenu.map(item => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:text-[#00A575] transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );

}

export default MobileNavLinks;
