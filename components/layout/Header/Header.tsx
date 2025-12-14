"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import HeaderTopBar from "./HeaderTopBar";
import ContainerLayout from "../ContainerLayout";
import DesktopHeader from "./DesktopHeader";
import MobileMenu from "./MobileMenu";
import Logo from "@/components/ui/logo";
import UserMenu from "./UserMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const { headerNavLinks } = useRoleNavigation(user?.role);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <HeaderTopBar />

      <header
        className={
          cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            scrolled ? "bg-white/75 backdrop-blur-2xl" : "bg-white"
          )

        }
      >
        <ContainerLayout className="py-0">
          <div className="flex h-16 lg:h-18 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Header */}
            <DesktopHeader navLinks={headerNavLinks} />

            {/* User Menu and Mobile Menu Trigger */}
            <div className="flex gap-x-3 items-center">
              <UserMenu />
              <Button
                variant={"secondary"}
                className="lg:hidden cursor-pointer "
                onClick={() => setIsMenuOpen(true)}
                size={"icon"}
              >
                <Menu className="size-6" />
              </Button>
            </div>
          </div>
        </ContainerLayout>

        {/* Mobile Menu Drawer */}
        <MobileMenu
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          navLinks={headerNavLinks}
        />
      </header>
    </>
  );
};

export default Header;