"use client"

import { FC, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { navLinks } from "@/constants/main.constants";
import { usePathname } from "next/navigation";

interface MobileNavLinksProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileNavLinks: FC<MobileNavLinksProps> = ({ setIsOpen }) => {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="space-y-1">
      {navLinks.map((link) =>
        link.submenu ? (
          <Accordion type="single" collapsible key={link.label} className="w-full">
            <AccordionItem value={link.label}>
              <AccordionTrigger className="flex justify-between items-center px-4 py-3 text-base font-medium rounded-lg hover:bg-green-50 hover:text-[#00A575] transition-colors">
                {link.label}
              </AccordionTrigger>
              <AccordionContent className="pl-6 space-y-1">
                {link.submenu.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-[#00A575] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Link
            key={link.label}
            href={link.href}
            className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
              isActive(link.href) ? "text-[#00A575] bg-green-50" : "text-gray-700 hover:text-[#00A575] hover:bg-green-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        )
      )}
    </div>
  );
};

export default MobileNavLinks;
