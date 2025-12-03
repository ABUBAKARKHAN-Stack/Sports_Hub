"use client";

import { MapPin, Star, Check, Navigation, Filter, ChevronRight } from "lucide-react";
import { useState } from "react";

const nearbyVenues = [
  {
    id: 1,
    name: "City Sports Complex",
    distance: "1.2 miles",
    rating: 4.8,
    reviews: 156,
    courts: 8,
    price: "$26",
    duration: "per hour",
    features: ["AC Courts", "Professional Lighting", "Free Parking", "Locker Rooms"],
    coordinates: { x: 30, y: 40 },
    popular: true,
  },
  {
    id: 2,
    name: "Olympic Badminton Hub",
    distance: "2.5 miles",
    rating: 4.9,
    reviews: 234,
    courts: 12,
    price: "$30",
    duration: "per hour",
    features: ["Premium Courts", "AC", "Cafe", "Coaching", "Pro Shop"],
    coordinates: { x: 70, y: 20 },
    trending: true,
  },
  {
    id: 3,
    name: "Community Sports Center",
    distance: "0.8 miles",
    rating: 4.6,
    reviews: 89,
    courts: 6,
    price: "$22",
    duration: "per hour",
    features: ["Free Parking", "Equipment Rental", "Showers", "Friendly"],
    coordinates: { x: 20, y: 70 },
  },
];

const FindVenues = () => {
  const [selectedVenue, setSelectedVenue] = useState<number | null>(1);
  const [userLocation] = useState({ x: 50, y: 50 });

  const handleVenueClick = (id: number) => {
    setSelectedVenue(id);
  };

  const venue = nearbyVenues.find(v => v.id === selectedVenue);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#097E52]/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#097E52] animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
              Discover Nearby
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            Find{" "}
            <span className="text-gradient">Venues Near You</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover premium badminton courts in your neighborhood with real-time availability
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Venues List - Left Side */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {nearbyVenues.map((venue) => (
                <div
                  key={venue.id}
                  onClick={() => handleVenueClick(venue.id)}
                  className={`
                    bg-white rounded-xl p-4 sm:p-5
                    border cursor-pointer transition-all duration-300
                    ${selectedVenue === venue.id
                      ? 'border-[#097E52] shadow-md'
                      : 'border-[#E5E7EB] hover:border-[#097E52]/50 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base sm:text-lg text-foreground">
                          {venue.name}
                        </h3>
                        {venue.popular && (
                          <span className="px-2 py-0.5 bg-[#097E52] text-white text-xs font-semibold rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-[#097E52]" />
                        <span>{venue.distance} away</span>
                        <span className="text-gray-400">•</span>
                        <span>{venue.courts} courts</span>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#097E52]">
                        {venue.price}
                      </div>
                      <div className="text-xs text-gray-500">{venue.duration}</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(venue.rating)
                              ? "fill-[#FFB800] text-[#FFB800]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-foreground text-sm">
                      {venue.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({venue.reviews})
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {venue.features.slice(0, 2).map((feature, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button className={`
                    w-full py-2.5 rounded-lg font-medium text-sm
                    transition-all duration-300
                    ${selectedVenue === venue.id
                      ? 'bg-[#097E52] text-white'
                      : 'bg-[#097E52]/10 text-[#097E52] hover:bg-[#097E52]/20'
                    }
                  `}>
                    {selectedVenue === venue.id ? 'Selected' : 'View Details'}
                  </button>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <button className="w-full mt-4 py-3 rounded-lg border border-[#097E52]/30 text-[#097E52] font-medium hover:border-[#097E52] hover:bg-[#097E52]/5 transition-colors">
              View All Nearby Venues
            </button>
          </div>

          {/* Map Section - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full border border-[#E5E7EB] shadow-sm">
              {/* Map Header */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  {venue?.name || "Select a venue"}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#097E52]" />
                  <span>{venue?.distance || "0.8 miles"} from your location</span>
                </p>
              </div>

              {/* Map Container */}
              <div className="relative h-[300px] sm:h-[350px] md:h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-[#097E52]/5 to-[#23B33A]/5">
                {/* Grid Lines */}
                <div className="absolute inset-0">
                  {/* Horizontal Lines */}
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-[#097E52]/20" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-[#097E52]/20" />
                  <div className="absolute bottom-1/4 left-0 right-0 h-px bg-[#097E52]/20" />
                  
                  {/* Vertical Lines */}
                  <div className="absolute left-1/4 top-0 bottom-0 w-px bg-[#097E52]/20" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#097E52]/20" />
                  <div className="absolute right-1/4 top-0 bottom-0 w-px bg-[#097E52]/20" />
                </div>

                {/* User Location */}
                <div 
                  className="absolute z-20"
                  style={{
                    left: `${userLocation.x}%`,
                    top: `${userLocation.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-white border-4 border-[#097E52] flex items-center justify-center shadow-lg">
                      <div className="h-6 w-6 rounded-full bg-[#097E52] animate-pulse" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
                        <p className="font-semibold text-foreground text-xs">Your Location</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Venue Markers */}
                {nearbyVenues.map((venue) => (
                  <div
                    key={venue.id}
                    className="absolute z-10 cursor-pointer"
                    style={{
                      left: `${venue.coordinates.x}%`,
                      top: `${venue.coordinates.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleVenueClick(venue.id)}
                  >
                    <div className="relative">
                      {/* Marker */}
                      <div className={`
                        h-10 w-10 rounded-full flex items-center justify-center shadow-lg
                        transition-all duration-300
                        ${selectedVenue === venue.id
                          ? 'bg-[#097E52] scale-125'
                          : 'bg-[#097E52] hover:scale-110'
                        }
                      `}>
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      
                      {/* Venue Info Card (Visible on selected or hover) */}
                      <div className={`
                        absolute -top-16 left-1/2 transform -translate-x-1/2
                        bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-3
                        min-w-[160px] transition-all duration-300
                        ${selectedVenue === venue.id ? 'opacity-100 visible' : 'opacity-0 invisible hover:opacity-100 hover:visible'}
                      `}>
                        <h4 className="font-bold text-foreground text-sm mb-1">
                          {venue.name}
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-[#FFB800] text-[#FFB800]" />
                            <span className="text-xs font-semibold">{venue.rating}</span>
                          </div>
                          <span className="text-xs font-bold text-[#097E52]">{venue.price}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{venue.distance} away</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Venue Details */}
              {venue && (
                <div className="mt-4 sm:mt-6">
                  <div className="bg-[#097E52]/5 rounded-lg p-4 border border-[#097E52]/20">
                    <h4 className="font-semibold text-foreground mb-3">Venue Details</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{venue.price}</div>
                        <div className="text-xs text-muted-foreground">Price/hour</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{venue.courts}</div>
                        <div className="text-xs text-muted-foreground">Courts</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{venue.rating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{venue.distance}</div>
                        <div className="text-xs text-muted-foreground">Distance</div>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {venue.features.map((feature, i) => (
                          <div
                            key={i}
                            className="px-3 py-1.5 bg-white text-foreground text-xs font-medium rounded-lg border border-[#E5E7EB]"
                          >
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 py-2.5 rounded-lg bg-[#097E52] text-white font-medium hover:bg-[#097E52]/90 transition-colors">
                        Book Now
                      </button>
                      <button className="flex-1 py-2.5 rounded-lg border border-[#097E52] text-[#097E52] font-medium hover:bg-[#097E52]/5 transition-colors">
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindVenues;