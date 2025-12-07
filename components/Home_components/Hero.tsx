"use client";

import Image from "next/image";
import { Search, MapPin, Filter, Check, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ContainerLayout from "../layout/ContainerLayout";
import { useUserFacility } from "@/context/user/UserFacilityContext";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const {
    state,
    getFacilityById
  } = useUserFacility()

  console.log(state);
  

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { searchQuery, location });
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#004E56] via-[#0A7A63] to-[#34C56A]">


      {/* Animated Background Elements */}
      <div className="absolute -top-32 -left-32 h-[320px] w-[320px] rounded-full bg-white/10 blur-[100px] animate-blob1" />
      <div className="absolute top-32 -right-40 h-[400px] w-[400px] rounded-full bg-white/10 blur-[120px] animate-blob2" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[40px_40px]" />

      {/* Container */}
      <ContainerLayout className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center py-10">

          {/* LEFT CONTENT */}
          <div className="text-left animate-fade-slide-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-5 border border-white/20">
              <div className="w-2 h-2 rounded-full bg-[#C6FF56] animate-pulse" />
              <p className="text-[#C6FF56] font-medium text-sm md:text-base tracking-wide">
                Premium courts designed for every sport
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-white font-bold leading-tight text-3xl md:text-4xl lg:text-5xl mb-5">
              Choose Your{" "}
              <span className="relative">
                <span className="text-[#C6FF56] relative z-10">Venues</span>
                <span className="absolute bottom-1 left-0 w-full h-2 bg-white/10 -z-0 rounded-lg" />
              </span>
              <br />
              And Start Your Training
            </h1>

            {/* Description */}
            <p className="text-white/90 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
              Unleash your athletic potential with top-tier venues, AC indoor courts,
              and personalized training programs crafted for all skill levels.
            </p>

            {/* Search Section */}
            <div className="bg-white w-full max-w-xl rounded-2xl md:rounded-3xl shadow-xl p-2 md:p-3 animate-fade-up delay-200 hover:shadow-2xl transition-all duration-300">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-0">
                {/* Search Field */}
                <div className="flex-1 relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                    <Search className="h-5 w-5 group-hover:text-gray-600 transition-colors duration-200" />
                  </div>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courts, sports, or activities..."
                    className="pl-12 h-12 md:h-14 bg-gray-50 text-gray-900 rounded-xl md:rounded-l-xl md:rounded-r-none border-2 border-gray-200 focus:border-[#00A575] focus:ring-2 focus:ring-[#00A575]/20 focus:ring-offset-0 placeholder-gray-500 text-base md:text-lg font-medium transition-all hover:border-gray-300"
                  />
                </div>

                {/* Location Field */}
                <div className="relative flex-1 group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                    <MapPin className="h-5 w-5 group-hover:text-gray-600 transition-colors duration-200" />
                  </div>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="pl-12 h-12 md:h-14 bg-gray-50 text-gray-900 rounded-xl md:rounded-none border-2 border-gray-200 border-l-0 md:border-l-2 md:border-l-gray-300 focus:border-[#00A575] focus:ring-2 focus:ring-[#00A575]/20 focus:ring-offset-0 placeholder-gray-500 text-base md:text-lg font-medium transition-all hover:border-gray-300"
                  />
                </div>

                {/* Search Button */}
                <Button
                  type="submit"
                  className="h-12 md:h-14 px-5 md:px-7 bg-gradient-to-r from-[#00A575] to-[#34C56A] hover:from-[#008E65] hover:to-[#2BAE5A] text-white font-semibold text-base md:text-lg rounded-xl md:rounded-r-xl md:rounded-l-none shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Search className="h-5 w-5" />
                  <span className="hidden md:inline">Search</span>
                </Button>
              </form>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 md:gap-3 mt-3 px-2 md:px-3 pb-1">
                <span className="text-sm text-gray-600 font-medium mr-2 flex items-center">
                  <Filter className="h-4 w-4 mr-1 text-[#00A575]" />
                  Popular:
                </span>
                {["Badminton", "Tennis", "Basketball", "Squash"].map((item) => (
                  <button
                    key={item}
                    className="text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 md:px-4 md:py-2 transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center gap-1 md:gap-2"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">500+ Courts</p>
                  <p className="text-white/70 text-sm">Nationwide</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">4.9/5 Rating</p>
                  <p className="text-white/70 text-sm">Verified Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — IMAGE BLOB */}
          <div className="relative flex justify-center items-center animate-fade-slide-right mt-10 lg:mt-0">
            <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] animate-float">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping-slow" />
              <div className="relative w-full h-full">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#C6FF56] via-[#00A575] to-[#34C56A] rounded-full blur-xl opacity-30 animate-pulse-slow" />
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/imgs/badminton-rackets.png"
                    alt="Badminton rackets on court"
                    fill
                    priority
                    className="object-cover rounded-full p-2 bg-gradient-to-br from-white/10 to-transparent"
                    sizes="(max-width: 768px) 300px, (max-width: 1024px) 380px, 500px"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </ContainerLayout>
      
    

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {0%,100%{transform:translateY(0) rotate(0deg);}33%{transform:translateY(-15px) rotate(1deg);}66%{transform:translateY(5px) rotate(-1deg);}}
        @keyframes fadeSlideLeft {0%{opacity:0;transform:translateX(-40px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes fadeSlideRight {0%{opacity:0;transform:translateX(40px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes fadeUp {0%{opacity:0;transform:translateY(20px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes blob1 {0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(30px,-50px) scale(1.1);}66%{transform:translate(-20px,20px) scale(0.9);}}
        @keyframes blob2 {0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(-50px,30px) scale(0.95);}66%{transform:translate(40px,-20px) scale(1.15);}}
        @keyframes ping-slow {0%{transform:scale(1);opacity:0.8;}100%{transform:scale(1.2);opacity:0;}}
        @keyframes pulse-slow {0%,100%{opacity:0.3;}50%{opacity:0.5;}}
        @keyframes scroll {0%{transform:translateY(0);}50%{transform:translateY(10px);}100%{transform:translateY(0);}}

        .animate-float {animation:float 8s ease-in-out infinite;}
        .animate-fade-slide-left {animation:fadeSlideLeft 0.8s ease-out forwards;}
        .animate-fade-slide-right {animation:fadeSlideRight 0.9s ease-out forwards;}
        .animate-fade-up {animation:fadeUp 0.8s ease-out forwards 0.2s;opacity:0;}
        .animate-blob1 {animation:blob1 20s infinite ease-in-out;}
        .animate-blob2 {animation:blob2 25s infinite ease-in-out;}
        .animate-ping-slow {animation:ping-slow 3s infinite ease-out;}
        .animate-pulse-slow {animation:pulse-slow 4s infinite ease-in-out;}
        .animate-scroll {animation:scroll 2s infinite;}
        .bg-grid-white\/\[0\.02\] {background-image:url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E");}
      `}</style>
    </section>
  );
}
