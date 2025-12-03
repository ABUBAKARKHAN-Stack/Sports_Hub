"use client";

import { Star, MapPin, Calendar, User, Heart, Shield, ChevronRight } from "lucide-react";
import { useState } from "react";

const venues = [
  {
    id: 1,
    name: "Elite Badminton Arena",
    price: "$28",
    duration: "per hour",
    rating: 4.9,
    reviews: 142,
    address: "123 Sports Ave, Downtown, City",
    availability: "Tomorrow, 3:00 PM",
    distance: "2.5 miles",
    host: {
      name: "Alex Chen",
      avatar: "AC",
      verified: true,
    },
    features: ["AC Courts", "Free Parking", "Showers", "Equipment"],
    popular: true,
  },
  {
    id: 2,
    name: "Sky Shuttle Center",
    price: "$32",
    duration: "per hour",
    rating: 4.8,
    reviews: 89,
    address: "456 Court Street, Uptown, City",
    availability: "Today, 7:00 PM",
    distance: "1.8 miles",
    host: {
      name: "Maria Rodriguez",
      avatar: "MR",
      verified: true,
    },
    features: ["Premium Courts", "Cafe", "Coaching", "Lockers"],
    trending: true,
  },
  {
    id: 3,
    name: "Champion's Court",
    price: "$25",
    duration: "per hour",
    rating: 4.7,
    reviews: 203,
    address: "789 Victory Lane, Midtown, City",
    availability: "Friday, 6:30 PM",
    distance: "3.2 miles",
    host: {
      name: "James Wilson",
      avatar: "JW",
      verified: true,
    },
    features: ["Olympic Standard", "Gym Access", "Pro Shop", "Physio"],
  },
];

const FeaturedVenues = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#097E52]/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#097E52] animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
              Premium Selection
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            Featured{" "}
            <span className="text-gradient">Courts</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover top-rated badminton venues with premium facilities and excellent ratings
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="group relative"
            >
              {/* Card */}
              <div className="
                relative bg-white rounded-xl sm:rounded-2xl overflow-hidden
                border border-[#E5E7EB]
                shadow-sm hover:shadow-lg
                transition-all duration-300
                hover:-translate-y-1
              ">
                
                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 z-10 flex justify-between">
                  <div className="flex gap-2">
                    {venue.popular && (
                      <div className="px-2.5 py-1 bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white text-xs font-semibold rounded-full shadow-sm">
                        Popular
                      </div>
                    )}
                    {venue.trending && (
                      <div className="px-2.5 py-1 bg-gradient-to-r from-[#006177] to-[#269089] text-white text-xs font-semibold rounded-full shadow-sm">
                        Trending
                      </div>
                    )}
                  </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(venue.id)}
                    className="
                      h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm 
                      flex items-center justify-center shadow-sm 
                      hover:shadow-md transition-all duration-300
                      hover:scale-110
                    "
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors duration-300 ${
                        favorites.includes(venue.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Image/Header Section */}
                <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-[#097E52]/10 to-[#23B33A]/10">
                  {/* Price Tag */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-white rounded-full px-3 py-2 shadow-md">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#097E52]">{venue.price}</span>
                        <span className="text-xs text-gray-500">{venue.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Distance */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <span className="text-xs font-medium text-white flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {venue.distance}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              i < Math.floor(venue.rating)
                                ? "fill-[#FFB800] text-[#FFB800]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        {venue.rating}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        ({venue.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-[#097E52] bg-[#097E52]/10 px-2 py-1 rounded-full">
                      <Shield className="h-3 w-3" />
                      <span className="font-medium">Verified</span>
                    </div>
                  </div>

                  {/* Venue Name */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {venue.name}
                  </h3>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-gray-600 mb-4">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">{venue.address}</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {venue.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Bottom Section */}
                  <div className="border-t border-gray-200 pt-4">
                    {/* Host & Availability */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Host */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="
                            h-10 w-10 rounded-full 
                            flex items-center justify-center
                            bg-gradient-to-r from-[#097E52] to-[#23B33A]
                          ">
                            <span className="text-white font-semibold text-sm">
                              {venue.host.avatar}
                            </span>
                          </div>
                          {venue.host.verified && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#097E52] border-2 border-white flex items-center justify-center shadow-sm">
                              <Shield className="h-2 w-2 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500">Host</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {venue.host.name}
                          </p>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end mb-1">
                          <Calendar className="h-3.5 w-3.5 text-[#097E52]" />
                          <span className="text-xs font-medium text-gray-900">Available</span>
                        </div>
                        <p className="text-xs text-[#097E52] font-semibold">
                          {venue.availability}
                        </p>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button className="
                      w-full py-3 rounded-lg font-semibold text-sm sm:text-base
                      bg-gradient-to-r from-[#097E52] to-[#23B33A]
                      text-white
                      hover:from-[#097E52]/90 hover:to-[#23B33A]/90
                      hover:shadow-md
                      transition-all duration-300
                      flex items-center justify-center gap-2
                      group/button
                    ">
                      <span>Book Now</span>
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full
            border-2 border-[#097E52]/30 text-[#097E52] font-semibold 
            hover:border-[#097E52] hover:bg-[#097E52]/5 
            transition-all duration-300 group"
          >
            View All Venues
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVenues;