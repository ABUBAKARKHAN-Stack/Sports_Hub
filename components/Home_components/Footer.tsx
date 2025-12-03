"use client";

import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Apple,
  Phone,
  Mail,
  Globe,
  DollarSign,
  MapPin,
  Clock,
  PlayCircle,
  ChevronRight,
  MessageSquare,
  Shield,
  Download,
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
    { label: "Press", href: "/press" },
    { label: "Support", href: "/support" },
  ];

  const otherLinks = [
    { label: "Become a Coach", href: "/coach" },
    { label: "List Your Venue", href: "/venue" },
    { label: "Tournaments", href: "/tournaments" },
    { label: "Training Programs", href: "/training" },
    { label: "Membership", href: "/membership" },
    { label: "FAQ", href: "/faq" },
  ];

  const locations = [
    { country: "United States", cities: "New York, LA, Chicago" },
    { country: "United Kingdom", cities: "London, Manchester" },
    { country: "Canada", cities: "Toronto, Vancouver" },
    { country: "Australia", cities: "Sydney, Melbourne" },
    { country: "India", cities: "Mumbai, Delhi, Bangalore" },
  ];

  const policies = [
    { label: "Legal Notice", href: "/legal" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Payment Policy", href: "/payment" },
    { label: "Cookie Policy", href: "/cookies" },
  ];

  return (
    <footer className="bg-foreground text-white">
      {/* Newsletter CTA */}
      <div className="bg-gradient-primary py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Ready to Play?
            </h3>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of players finding their perfect court through DreamSports
            </p>
            <button className="
              inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full
              bg-white text-[#097E52] font-semibold text-sm sm:text-base
              hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-300
            ">
              <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              Get Started Free
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">DS</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold">DreamSports</span>
                <p className="text-xs sm:text-sm text-white/70">Find Your Perfect Court</p>
              </div>
            </div>
            
            <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6 max-w-md">
              Empowering athletes through premium sports facilities, expert coaching, and a vibrant community. Your journey to excellence starts here.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-white/80" />
                <span className="text-sm sm:text-base">+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-white/80" />
                <span className="text-sm sm:text-base">info@dreamsports.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-white/80" />
                <span className="text-sm sm:text-base">24/7 Support Available</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 pb-2 border-b border-white/20">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="
                      text-white/70 hover:text-white transition-colors duration-300
                      text-sm sm:text-base flex items-center gap-2 group
                    "
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 pb-2 border-b border-white/20">
              Resources
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {otherLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="
                      text-white/70 hover:text-white transition-colors duration-300
                      text-sm sm:text-base flex items-center gap-2 group
                    "
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 pb-2 border-b border-white/20">
              Our Locations
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {locations.map((location) => (
                <div key={location.country} className="group">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-white/70 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base group-hover:text-white transition-colors">
                        {location.country}
                      </p>
                      <p className="text-xs sm:text-sm text-white/60">
                        {location.cities}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* App & Social */}
        <div className="border-t border-white/20 pt-6 sm:pt-8 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* App Downloads */}
            <div className="w-full lg:w-auto">
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center lg:text-left">
                Play On The Go
              </h4>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button className="
                  flex items-center gap-3 px-4 sm:px-6 py-3
                  bg-black/30 rounded-xl hover:bg-black/40
                  transition-all duration-300 group w-full sm:w-auto
                ">
                  <Apple className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-bold text-sm sm:text-base">App Store</div>
                  </div>
                  <Download className="h-4 w-4 ml-auto sm:ml-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
                
                <button className="
                  flex items-center gap-3 px-4 sm:px-6 py-3
                  bg-black/30 rounded-xl hover:bg-black/40
                  transition-all duration-300 group w-full sm:w-auto
                ">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 bg-white rounded flex items-center justify-center">
                    <span className="text-black font-bold text-xs">G</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-bold text-sm sm:text-base">Google Play</div>
                  </div>
                  <Download className="h-4 w-4 ml-auto sm:ml-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="text-center lg:text-right">
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Connect With Us
              </h4>
              <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-end">
                <a
                  href="#"
                  className="
                    h-8 w-8 sm:h-10 sm:w-10 rounded-full
                    bg-white/10 flex items-center justify-center
                    hover:bg-white/20 hover:scale-110
                    transition-all duration-300
                  "
                  aria-label="Facebook"
                >
                  <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
                <a
                  href="#"
                  className="
                    h-8 w-8 sm:h-10 sm:w-10 rounded-full
                    bg-white/10 flex items-center justify-center
                    hover:bg-white/20 hover:scale-110
                    transition-all duration-300
                  "
                  aria-label="Twitter"
                >
                  <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
                <a
                  href="#"
                  className="
                    h-8 w-8 sm:h-10 sm:w-10 rounded-full
                    bg-white/10 flex items-center justify-center
                    hover:bg-white/20 hover:scale-110
                    transition-all duration-300
                  "
                  aria-label="Instagram"
                >
                  <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
                <a
                  href="#"
                  className="
                    h-8 w-8 sm:h-10 sm:w-10 rounded-full
                    bg-white/10 flex items-center justify-center
                    hover:bg-white/20 hover:scale-110
                    transition-all duration-300
                  "
                  aria-label="YouTube"
                >
                  <Youtube className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
                <a
                  href="#"
                  className="
                    h-8 w-8 sm:h-10 sm:w-10 rounded-full
                    bg-white/10 flex items-center justify-center
                    hover:bg-white/20 hover:scale-110
                    transition-all duration-300
                  "
                  aria-label="Chat"
                >
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Copyright */}
            <div className="text-white/70 text-xs sm:text-sm text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <Shield className="h-3 w-3" />
                <span>© 2024 DreamSports. All rights reserved.</span>
              </div>
              <p className="text-white/50 text-xs">
                Proudly serving players worldwide since 2020
              </p>
            </div>
            
            {/* Language & Currency */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs sm:text-sm cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs sm:text-sm cursor-pointer"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
            
            {/* Policies */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/70">
              {policies.map((policy) => (
                <a
                  key={policy.label}
                  href={policy.href}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  {policy.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;