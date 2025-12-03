"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, User, MapPin, ChevronDown, Bell } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", active: true },
    { label: "Courts", href: "/courts" },
    { 
      label: "Sports", 
      href: "/sports",
      submenu: [
        { label: "Badminton", href: "/sports/badminton" },
        { label: "Tennis", href: "/sports/tennis" },
        { label: "Basketball", href: "/sports/basketball" },
        { label: "Squash", href: "/sports/squash" },
        { label: "Cricket", href: "/sports/cricket" },
      ]
    },
    { label: "Pages", href: "/pages" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top Info Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-[#004E56] via-[#0A7A63] to-[#34C56A] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span className="font-medium">Toll free: +1 8164 164654</span>
              </div>
              <div className="w-px h-4 bg-white/30" />
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span className="font-medium">info@dreamsports.com</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:text-[#C6FF56] transition-colors">
                <User className="h-3.5 w-3.5" />
                <span className="font-medium">Login / Register</span>
              </button>
              <div className="w-px h-4 bg-white/30" />
              <button className="flex items-center gap-2 hover:text-[#C6FF56] transition-colors">
                <MapPin className="h-3.5 w-3.5" />
                <span className="font-medium">Find a Court</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#004E56] via-[#0A7A63] to-[#34C56A] flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">DS</span>
              </div>
              <Link href="/" className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">DreamSports</span>
                <span className="text-xs text-gray-500 hidden sm:block">Find Your Perfect Court</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      link.active 
                        ? 'text-[#00A575] bg-green-50' 
                        : 'text-gray-700 hover:text-[#00A575] hover:bg-green-50'
                    }`}
                  >
                    {link.label}
                    {link.submenu && <ChevronDown className="h-4 w-4" />}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {link.submenu && (
                    <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
                        {link.submenu.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-gray-700 hover:text-[#00A575] hover:bg-green-50 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-[#00A575] transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:border-[#00A575] transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#004E56] to-[#34C56A] flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Account</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
                    <Link href="/profile" className="block px-4 py-3 text-gray-700 hover:text-[#00A575] hover:bg-green-50 transition-colors">
                      My Profile
                    </Link>
                    <Link href="/bookings" className="block px-4 py-3 text-gray-700 hover:text-[#00A575] hover:bg-green-50 transition-colors">
                      My Bookings
                    </Link>
                    <Link href="/courts" className="block px-4 py-3 text-gray-700 hover:text-[#00A575] hover:bg-green-50 transition-colors">
                      My Courts
                    </Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button className="block w-full text-left px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
              <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#00A575] to-[#34C56A] text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all shadow-md">
                List Your Court
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-[#00A575] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#004E56] via-[#0A7A63] to-[#34C56A] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DS</span>
                </div>
                <span className="text-xl font-bold text-gray-900">DreamSports</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="h-[calc(100vh-80px)] overflow-y-auto">
              <div className="p-6">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-[#004E56]/5 via-[#0A7A63]/5 to-[#34C56A]/5 rounded-xl">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#004E56] to-[#34C56A] flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Welcome to DreamSports!</p>
                    <p className="text-sm text-gray-600">Login to access bookings</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                          link.active 
                            ? 'text-[#00A575] bg-green-50' 
                            : 'text-gray-700 hover:text-[#00A575] hover:bg-green-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                        {link.submenu && <ChevronDown className="h-5 w-5" />}
                      </Link>
                      
                      {/* Mobile Submenu */}
                      {link.submenu && (
                        <div className="ml-6 mt-1 space-y-1">
                          {link.submenu.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-[#00A575] transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Actions */}
                <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                  <button className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[#00A575] to-[#34C56A] text-white font-medium hover:shadow-lg transition-shadow">
                    List Your Court
                  </button>
                  <div className="flex gap-4">
                    <button className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:border-[#00A575] hover:text-[#00A575] transition-colors">
                      Login
                    </button>
                    <button className="flex-1 px-4 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
                      Register
                    </button>
                  </div>
                </div>

                {/* Contact Info - Mobile */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-gray-900 mb-3">Contact Info</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#00A575]" />
                      <span className="text-sm text-gray-700">+1 8164 164654</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-[#00A575]" />
                      <span className="text-sm text-gray-700">info@dreamsports.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;