"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import HeaderTopBar from "./HeaderTopBar";
import ContainerLayout from "../ContainerLayout";
import DesktopHeader from "./DesktopHeader";
import MobileMenu from "./MobileMenu";
import Logo from "@/components/ui/logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <HeaderTopBar />

      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/50 backdrop-blur-2xl shadow-lg' : 'bg-white'}`}>
        <ContainerLayout className="py-0">
          <div className="flex h-16 lg:h-20 items-center justify-between">

            {/* Logo */}
            <Logo  />

            {/* Desktop Header */}
            <DesktopHeader setUserMenuOpen={setUserMenuOpen} userMenuOpen={userMenuOpen} />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-[#00A575] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </ContainerLayout>

        {/* Mobile Menu */}
        {isMenuOpen && <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />}
      </header>
    </>
  );
};

export default Header;
