"use client";

import { 
  Star, 
  MapPin, 
  Calendar, 
  Heart, 
  Shield, 
  ChevronRight, 
  Search, 
  Filter, 
  X, 
  Zap,
  Check,
  Clock,
  Users,
  Grid,
  List,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Flame,
  DollarSign,
  Navigation,
  Building,
  Car,
  Coffee,
  Dumbbell,
  ShoppingBag,
  Waves,
  Wifi,
  Wind,
  Lock,
  Sun,
  Moon,
  ChevronLeft,
  Menu,
  Sliders
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

// Types
interface Host {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
}

interface Venue {
  id: number;
  name: string;
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  address: string;
  availability: string;
  distance: string;
  host: Host;
  features: string[];
  popular?: boolean;
  trending?: boolean;
  new?: boolean;
  category: string;
  instantBook?: boolean;
}

const initialVenues: Venue[] = [
  {
    id: 1,
    name: "Elite Badminton Arena",
    price: "$28",
    duration: "per hour",
    rating: 4.9,
    reviews: 142,
    address: "123 Sports Ave, Downtown, City 10001",
    availability: "Tomorrow, 3:00 PM",
    distance: "2.5 miles",
    host: {
      id: "host1",
      name: "Alex Chen",
      avatar: "AC",
      verified: true,
    },
    features: ["AC Courts", "Free Parking", "Showers", "Equipment"],
    popular: true,
    new: true,
    category: "premium",
    instantBook: true,
  },
  {
    id: 2,
    name: "Sky Shuttle Center",
    price: "$32",
    duration: "per hour",
    rating: 4.8,
    reviews: 89,
    address: "456 Court Street, Uptown, City 10002",
    availability: "Today, 7:00 PM",
    distance: "1.8 miles",
    host: {
      id: "host2",
      name: "Maria Rodriguez",
      avatar: "MR",
      verified: true,
    },
    features: ["Premium Courts", "Cafe", "Coaching", "Lockers"],
    trending: true,
    category: "premium",
    instantBook: true,
  },
  {
    id: 3,
    name: "Champion's Court",
    price: "$25",
    duration: "per hour",
    rating: 4.7,
    reviews: 203,
    address: "789 Victory Lane, Midtown, City 10003",
    availability: "Friday, 6:30 PM",
    distance: "3.2 miles",
    host: {
      id: "host3",
      name: "James Wilson",
      avatar: "JW",
      verified: true,
    },
    features: ["Olympic Standard", "Gym Access", "Pro Shop", "Physio"],
    category: "standard",
  },
  {
    id: 4,
    name: "Velocity Sports Hub",
    price: "$36",
    duration: "per hour",
    rating: 4.9,
    reviews: 56,
    address: "101 Velocity Road, Tech Park, City 10004",
    availability: "Saturday, 10:00 AM",
    distance: "1.2 miles",
    host: {
      id: "host4",
      name: "Tech Sports",
      avatar: "TS",
      verified: true,
    },
    features: ["Smart Courts", "AI Analysis", "VR Training", "Recovery"],
    new: true,
    trending: true,
    category: "luxury",
    instantBook: true,
  },
  {
    id: 5,
    name: "Nexus Badminton Center",
    price: "$22",
    duration: "per hour",
    rating: 4.6,
    reviews: 187,
    address: "202 Nexus Blvd, Eastside, City 10005",
    availability: "Sunday, 2:00 PM",
    distance: "4.5 miles",
    host: {
      id: "host5",
      name: "Community Sports",
      avatar: "CS",
      verified: true,
    },
    features: ["8 Courts", "Cafe", "Kids Zone", "Parking"],
    category: "community",
    instantBook: true,
  },
  {
    id: 6,
    name: "Apex Sports Arena",
    price: "$40",
    duration: "per hour",
    rating: 5.0,
    reviews: 45,
    address: "303 Apex Street, Westend, City 10006",
    availability: "Monday, 8:00 AM",
    distance: "0.8 miles",
    host: {
      id: "host6",
      name: "Pro Sports Management",
      avatar: "PS",
      verified: true,
    },
    features: ["Tournament Grade", "VIP Lounge", "Coaching", "Spa"],
    popular: true,
    category: "luxury",
    instantBook: true,
  },
];

// Filter options
const CATEGORIES = [
  { label: "All Courts", value: "all" },
  { label: "Premium", value: "premium", count: 2 },
  { label: "Luxury", value: "luxury", count: 2 },
  { label: "Standard", value: "standard", count: 1 },
  { label: "Community", value: "community", count: 1 },
];

const AMENITIES = [
  { label: "AC Courts", icon: Wind },
  { label: "Free Parking", icon: Car },
  { label: "Showers", icon: Waves },
  { label: "Equipment", icon: Dumbbell },
  { label: "Cafe", icon: Coffee },
  { label: "Coaching", icon: Users },
  { label: "Gym", icon: Dumbbell },
  { label: "Pro Shop", icon: ShoppingBag },
  { label: "Wi-Fi", icon: Wifi },
  { label: "Lockers", icon: Lock },
];

const PRICE_RANGES = [
  { label: "Any Price", value: "any" },
  { label: "Under $25", value: "under25" },
  { label: "$25 - $35", value: "25-35" },
  { label: "$35+", value: "35plus" },
];

const AVAILABILITY_OPTIONS = [
  { label: "Any Time", value: "any" },
  { label: "Morning (6AM - 12PM)", value: "morning" },
  { label: "Afternoon (12PM - 6PM)", value: "afternoon" },
  { label: "Evening (6PM - 12AM)", value: "evening" },
  { label: "Instant Book", value: "instant" },
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended", icon: Sparkles },
  { label: "Rating: High to Low", value: "rating_desc", icon: Star },
  { label: "Price: Low to High", value: "price_asc", icon: DollarSign },
  { label: "Price: High to Low", value: "price_desc", icon: DollarSign },
  { label: "Distance: Nearest", value: "distance_asc", icon: Navigation },
];

const VenueCard = ({ 
  venue, 
  isFavorite, 
  onToggleFavorite,
  viewMode = "grid"
}: { 
  venue: Venue; 
  isFavorite: boolean; 
  onToggleFavorite: (id: number) => void;
  viewMode: "grid" | "list";
}) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/court-detail/${venue.id}`);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/court-detail/${venue.id}`);
  };

  if (viewMode === "list") {
    return (
      <div 
        className="group cursor-pointer transition-all duration-300"
        onClick={handleCardClick}
      >
        <div className="
          bg-white rounded-xl overflow-hidden
          border border-gray-100
          shadow-sm hover:shadow-xl
          transition-all duration-300
          hover:-translate-y-0.5
          h-full flex flex-col md:flex-row
          hover:border-[#097E52]/20
        ">
          {/* Image Section */}
          <div className="md:w-64 w-full h-48 md:h-auto relative flex-shrink-0">
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#097E52]/10 to-[#23B33A]/10">
              {/* Badges Container */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
                {/* Left side badges */}
                <div className="flex flex-wrap gap-2 max-w-[70%]">
                  {venue.new && (
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>NEW</span>
                    </div>
                  )}
                  {venue.popular && (
                    <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5" />
                      <span>POPULAR</span>
                    </div>
                  )}
                  {venue.trending && (
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>TRENDING</span>
                    </div>
                  )}
                </div>
                
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(venue.id);
                  }}
                  className="
                    h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm 
                    flex items-center justify-center shadow-lg 
                    hover:shadow-xl transition-all duration-300
                    hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#097E52]/50
                    flex-shrink-0 border border-gray-200
                  "
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-300 ${
                      isFavorite
                        ? 'fill-red-500 text-red-500 scale-110'
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-white rounded-full px-4 py-2 shadow-lg">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[#097E52]">{venue.price}</span>
                    <span className="text-sm text-gray-500">{venue.duration}</span>
                  </div>
                </div>
              </div>
              
              {/* Distance */}
              <div className="absolute bottom-4 right-4 z-10">
                <div className="bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <span className="text-xs font-medium text-white flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {venue.distance}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="h-full flex flex-col">
              {/* Header with rating and host */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(venue.rating)
                              ? "fill-[#FFB800] text-[#FFB800]"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-lg">
                        {venue.rating}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({venue.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="
                          h-10 w-10 rounded-full 
                          flex items-center justify-center
                          bg-gradient-to-r from-[#097E52] to-[#23B33A]
                          ring-2 ring-white shadow-sm
                        ">
                          <span className="text-white font-semibold text-sm">
                            {venue.host.avatar}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Host</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {venue.host.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {venue.host.verified && (
                  <div className="flex items-center gap-2 text-sm text-[#097E52] bg-[#097E52]/10 px-4 py-2 rounded-full">
                    <Shield className="h-4 w-4" />
                    <span className="font-semibold">Verified Host</span>
                  </div>
                )}
              </div>

              {/* Venue Name and Address */}
              <div className="mb-5">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#097E52] transition-colors">
                  {venue.name}
                </h3>
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-base">{venue.address}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-3 mb-6">
                {venue.features.map((feature, idx) => {
                  const amenity = AMENITIES.find(a => a.label === feature);
                  return (
                    <div
                      key={idx}
                      className="px-4 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2.5 border border-gray-100"
                    >
                      {amenity?.icon && <amenity.icon className="h-4 w-4" />}
                      <span>{feature}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Section */}
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-gray-100">
                  {/* Availability */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-[#097E52]">
                      <div className="h-12 w-12 rounded-full bg-[#097E52]/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Available</p>
                        <p className="font-semibold text-lg">{venue.availability}</p>
                      </div>
                    </div>
                    {venue.instantBook && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] text-sm font-semibold px-4 py-2 rounded-full">
                        <Zap className="h-4 w-4" />
                        <span>Instant Book</span>
                      </div>
                    )}
                  </div>

                  {/* Book Button */}
                  <button 
                    onClick={handleBookClick}
                    className="
                      px-8 py-4 rounded-xl font-semibold text-base
                      bg-gradient-to-r from-[#097E52] to-[#23B33A]
                      text-white
                      hover:from-[#097E52]/90 hover:to-[#23B33A]/90
                      hover:shadow-lg
                      transition-all duration-300
                      flex items-center justify-center gap-2
                      group/button focus:outline-none focus:ring-2 focus:ring-[#097E52]/50 focus:ring-offset-2
                      shadow-md hover:shadow-xl
                      min-w-[180px]
                    "
                  >
                    <span>Book Now</span>
                    <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className="group relative cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="
        relative bg-white rounded-xl overflow-hidden
        border border-gray-100
        shadow-sm hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-0.5
        h-full
        hover:border-[#097E52]/20
      ">
        {/* Badges Container */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
          <div className="flex flex-wrap gap-2 max-w-[70%]">
            {venue.new && (
              <div className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>NEW</span>
              </div>
            )}
            {venue.popular && (
              <div className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                <Flame className="h-3 w-3" />
                <span>POPULAR</span>
              </div>
            )}
            {venue.trending && (
              <div className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>TRENDING</span>
              </div>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(venue.id);
            }}
            className="
              h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm 
              flex items-center justify-center shadow-sm 
              hover:shadow-md transition-all duration-300
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#097E52]/50
              flex-shrink-0 border border-gray-200
            "
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                isFavorite
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>
        </div>

        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#097E52]/10 to-[#23B33A]/10">
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-white rounded-full px-3 py-1.5 shadow-md">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-[#097E52]">{venue.price}</span>
                <span className="text-xs text-gray-500">{venue.duration}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="text-xs font-medium text-white flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {venue.distance}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(venue.rating)
                        ? "fill-[#FFB800] text-[#FFB800]"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-900 text-base">
                {venue.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({venue.reviews} reviews)
              </span>
            </div>
            
            {venue.host.verified && (
              <div className="flex items-center gap-1 text-xs text-[#097E52] bg-[#097E52]/10 px-2.5 py-1 rounded-full">
                <Shield className="h-3.5 w-3.5" />
                <span className="font-medium">Verified</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#097E52] transition-colors">
            {venue.name}
          </h3>

          <div className="flex items-start gap-2 text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm line-clamp-2 flex-1">{venue.address}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {venue.features.slice(0, 3).map((feature, idx) => {
              const amenity = AMENITIES.find(a => a.label === feature);
              return (
                <div
                  key={idx}
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 border border-gray-100"
                >
                  {amenity?.icon && <amenity.icon className="h-3.5 w-3.5" />}
                  <span>{feature}</span>
                </div>
              );
            })}
            {venue.features.length > 3 && (
              <div className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs font-medium rounded-lg border border-gray-100">
                +{venue.features.length - 3} more
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="
                    h-10 w-10 rounded-full 
                    flex items-center justify-center
                    bg-gradient-to-r from-[#097E52] to-[#23B33A]
                    ring-2 ring-white shadow-sm
                  ">
                    <span className="text-white font-semibold text-sm">
                      {venue.host.avatar}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 font-medium">Host</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {venue.host.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Calendar className="h-4 w-4 text-[#097E52]" />
                  <span className="text-xs font-medium text-gray-900">Available</span>
                </div>
                <p className="text-sm text-[#097E52] font-semibold">
                  {venue.availability}
                </p>
              </div>
            </div>

            <button 
              onClick={handleBookClick}
              className="
                w-full py-3 rounded-lg font-semibold text-sm
                bg-gradient-to-r from-[#097E52] to-[#23B33A]
                text-white
                hover:from-[#097E52]/90 hover:to-[#23B33A]/90
                hover:shadow-md
                transition-all duration-300
                flex items-center justify-center gap-2
                group/button focus:outline-none focus:ring-2 focus:ring-[#097E52]/50 focus:ring-offset-2
                shadow-sm
              "
            >
              <span>View Details</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedAmenities,
  setSelectedAmenities,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedAvailability,
  setSelectedAvailability,
  sortBy,
  setSortBy,
  clearFilters,
  activeFilterCount,
  onClose
}: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  selectedPriceRange: string;
  setSelectedPriceRange: (range: string) => void;
  selectedAvailability: string;
  setSelectedAvailability: (availability: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  onClose: () => void;
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Sliders className="h-6 w-6 text-[#097E52]" />
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          </div>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#097E52] hover:text-[#097E52]/80 font-semibold transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-sm">Refine your search results</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Sort */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gray-400" />
            Sort by
          </h3>
          <div className="space-y-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`
                  w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  flex items-center gap-3
                  ${sortBy === option.value
                    ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }
                `}
              >
                <option.icon className={`h-4 w-4 ${sortBy === option.value ? 'text-[#097E52]' : 'text-gray-400'}`} />
                <span className="flex-1">{option.label}</span>
                {sortBy === option.value && (
                  <Check className="h-4 w-4 text-[#097E52]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-400" />
            Categories
          </h3>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200
                  flex items-center justify-between group
                  ${selectedCategory === category.value
                    ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }
                `}
              >
                <span className="font-medium">{category.label}</span>
                <span className={`
                  text-xs px-2.5 py-1 rounded-full transition-colors
                  ${selectedCategory === category.value
                    ? 'bg-[#097E52] text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }
                `}>
                  {category.count || initialVenues.filter(v => v.category === category.value).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            Price Range
          </h3>
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedPriceRange(range.value)}
                className={`
                  w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  flex items-center justify-between
                  ${selectedPriceRange === range.value
                    ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }
                `}
              >
                <span>{range.label}</span>
                {selectedPriceRange === range.value && (
                  <Check className="h-4 w-4 text-[#097E52]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            Availability
          </h3>
          <div className="space-y-2">
            {AVAILABILITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedAvailability(option.value)}
                className={`
                  w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  flex items-center justify-between
                  ${selectedAvailability === option.value
                    ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {option.value === "morning" && <Sun className={`h-4 w-4 ${selectedAvailability === option.value ? 'text-[#097E52]' : 'text-gray-400'}`} />}
                  {option.value === "afternoon" && <Sun className={`h-4 w-4 ${selectedAvailability === option.value ? 'text-[#097E52]' : 'text-gray-400'}`} />}
                  {option.value === "evening" && <Moon className={`h-4 w-4 ${selectedAvailability === option.value ? 'text-[#097E52]' : 'text-gray-400'}`} />}
                  {option.value === "instant" && <Zap className={`h-4 w-4 ${selectedAvailability === option.value ? 'text-[#097E52]' : 'text-gray-400'}`} />}
                  {option.value === "any" && <Clock className={`h-4 w-4 ${selectedAvailability === option.value ? 'text-[#097E52]' : 'text-gray-400'}`} />}
                  <span>{option.label}</span>
                </div>
                {selectedAvailability === option.value && (
                  <Check className="h-4 w-4 text-[#097E52]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-gray-400" />
            Amenities
          </h3>
          <div className="space-y-2">
            {AMENITIES.map((amenity) => (
              <button
                key={amenity.label}
                onClick={() => setSelectedAmenities(
                  selectedAmenities.includes(amenity.label)
                    ? selectedAmenities.filter(a => a !== amenity.label)
                    : [...selectedAmenities, amenity.label]
                )}
                className={`
                  w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  flex items-center justify-between
                  ${selectedAmenities.includes(amenity.label)
                    ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <amenity.icon className={`h-4 w-4 ${selectedAmenities.includes(amenity.label) ? 'text-[#097E52]' : 'text-gray-400'}`} />
                  <span>{amenity.label}</span>
                </div>
                <div className={`
                  h-5 w-5 rounded border flex items-center justify-center transition-all duration-200
                  ${selectedAmenities.includes(amenity.label)
                    ? 'bg-[#097E52] border-[#097E52]'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}>
                  <Check className={`h-3 w-3 text-white transition-all duration-200 ${
                    selectedAmenities.includes(amenity.label) ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white hover:opacity-90 transition-opacity shadow-sm hover:shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

const CourtsPage = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("any");
  const [selectedAvailability, setSelectedAvailability] = useState("any");
  const [sortBy, setSortBy] = useState("recommended");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  // Filter and sort venues
  const filteredVenues = useMemo(() => {
    let result = [...initialVenues];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(venue =>
        venue.name.toLowerCase().includes(query) ||
        venue.address.toLowerCase().includes(query) ||
        venue.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(venue => venue.category === selectedCategory);
    }

    // Apply amenities filter
    if (selectedAmenities.length > 0) {
      result = result.filter(venue =>
        selectedAmenities.every(amenity => 
          venue.features.includes(amenity)
        )
      );
    }

    // Apply price range filter
    if (selectedPriceRange !== "any") {
      result = result.filter(venue => {
        const price = parseInt(venue.price.replace("$", ""));
        switch (selectedPriceRange) {
          case "under25":
            return price < 25;
          case "25-35":
            return price >= 25 && price <= 35;
          case "35plus":
            return price > 35;
          default:
            return true;
        }
      });
    }

    // Apply availability filter
    if (selectedAvailability !== "any") {
      result = result.filter(venue => {
        const time = venue.availability.toLowerCase();
        if (selectedAvailability === "instant") {
          return venue.instantBook;
        }
        if (selectedAvailability === "morning") {
          return time.includes("am") && !time.includes("pm");
        }
        if (selectedAvailability === "afternoon") {
          return time.includes("pm") && 
                 (!time.includes("6:") && !time.includes("7:") && !time.includes("8:") && !time.includes("9:"));
        }
        if (selectedAvailability === "evening") {
          return time.includes("pm") && 
                 (time.includes("6:") || time.includes("7:") || time.includes("8:") || time.includes("9:"));
        }
        return true;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "rating_desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price_asc":
        result.sort((a, b) => {
          const priceA = parseInt(a.price.replace("$", ""));
          const priceB = parseInt(b.price.replace("$", ""));
          return priceA - priceB;
        });
        break;
      case "price_desc":
        result.sort((a, b) => {
          const priceA = parseInt(a.price.replace("$", ""));
          const priceB = parseInt(b.price.replace("$", ""));
          return priceB - priceA;
        });
        break;
      case "distance_asc":
        result.sort((a, b) => {
          const distanceA = parseFloat(a.distance.replace(" miles", ""));
          const distanceB = parseFloat(b.distance.replace(" miles", ""));
          return distanceA - distanceB;
        });
        break;
      default:
        result.sort((a, b) => {
          const scoreA = (a.new ? 3 : 0) + (a.popular ? 2 : 0) + (a.trending ? 1 : 0) + a.rating;
          const scoreB = (b.new ? 3 : 0) + (b.popular ? 2 : 0) + (b.trending ? 1 : 0) + b.rating;
          return scoreB - scoreA;
        });
    }

    return result;
  }, [searchQuery, selectedCategory, selectedAmenities, selectedPriceRange, selectedAvailability, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAmenities([]);
    setSelectedPriceRange("any");
    setSelectedAvailability("any");
    setSortBy("recommended");
  };

  // Count active filters
  const activeFilterCount = [
    searchQuery,
    selectedCategory !== "all",
    selectedAmenities.length > 0,
    selectedPriceRange !== "any",
    selectedAvailability !== "any",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Desktop Sidebar Toggle */}
                <button
                  onClick={() => setShowDesktopSidebar(!showDesktopSidebar)}
                  className="hidden lg:flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  aria-label={showDesktopSidebar ? "Hide filters" : "Show filters"}
                >
                  {showDesktopSidebar ? <ChevronLeft className="h-5 w-5" /> : <Sliders className="h-5 w-5" />}
                </button>
                
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Courts</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Discover premium venues for your game
                  </p>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition-colors border border-gray-200"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#097E52] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#097E52] transition-colors" />
                <input
                  type="text"
                  placeholder="Search courts, locations, or amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-11 pr-10 py-3.5 rounded-xl
                    border border-gray-300 focus:outline-none
                    focus:ring-2 focus:ring-[#097E52]/20 focus:border-[#097E52]
                    text-gray-900 placeholder-gray-500 text-sm
                    bg-white/50
                    transition-all duration-200
                    hover:border-gray-400
                  "
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex gap-6 xl:gap-8 relative">
          {/* Desktop Sidebar */}
          {!isMobile && showDesktopSidebar && (
            <aside className="hidden lg:block w-80 flex-shrink-0 transition-all duration-300">
              <div className="sticky top-24">
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedAmenities={selectedAmenities}
                  setSelectedAmenities={setSelectedAmenities}
                  selectedPriceRange={selectedPriceRange}
                  setSelectedPriceRange={setSelectedPriceRange}
                  selectedAvailability={selectedAvailability}
                  setSelectedAvailability={setSelectedAvailability}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  clearFilters={clearFilters}
                  activeFilterCount={activeFilterCount}
                  onClose={() => setShowDesktopSidebar(false)}
                />
              </div>
            </aside>
          )}

          {/* Mobile Filters Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                onClick={() => setShowMobileFilters(false)} 
              />
              <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300">
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedAmenities={selectedAmenities}
                  setSelectedAmenities={setSelectedAmenities}
                  selectedPriceRange={selectedPriceRange}
                  setSelectedPriceRange={setSelectedPriceRange}
                  selectedAvailability={selectedAvailability}
                  setSelectedAvailability={setSelectedAvailability}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  clearFilters={clearFilters}
                  activeFilterCount={activeFilterCount}
                  onClose={() => setShowMobileFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${showDesktopSidebar && !isMobile ? '' : 'lg:ml-0'}`}>
            {/* Results Header */}
            <div className="bg-white rounded-2xl p-5 md:p-6 mb-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {filteredVenues.length} {filteredVenues.length === 1 ? 'Court Found' : 'Courts Found'}
                      </h2>
                      {activeFilterCount > 0 && (
                        <p className="text-gray-600 text-sm mt-1">
                          {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                        </p>
                      )}
                    </div>
                    
                    {/* Active Filters */}
                    {activeFilterCount > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCategory !== "all" && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 rounded-full px-3 py-2">
                            <Building className="h-3.5 w-3.5 text-[#097E52]" />
                            <span className="text-sm font-medium text-[#097E52]">
                              {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                            </span>
                            <button
                              onClick={() => setSelectedCategory("all")}
                              className="text-[#097E52]/60 hover:text-[#097E52] p-0.5 rounded-full hover:bg-[#097E52]/10 transition-colors ml-1"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        {selectedPriceRange !== "any" && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 rounded-full px-3 py-2">
                            <DollarSign className="h-3.5 w-3.5 text-[#097E52]" />
                            <span className="text-sm font-medium text-[#097E52]">
                              {PRICE_RANGES.find(p => p.value === selectedPriceRange)?.label}
                            </span>
                            <button
                              onClick={() => setSelectedPriceRange("any")}
                              className="text-[#097E52]/60 hover:text-[#097E52] p-0.5 rounded-full hover:bg-[#097E52]/10 transition-colors ml-1"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        {selectedAvailability !== "any" && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 rounded-full px-3 py-2">
                            <Clock className="h-3.5 w-3.5 text-[#097E52]" />
                            <span className="text-sm font-medium text-[#097E52]">
                              {AVAILABILITY_OPTIONS.find(a => a.value === selectedAvailability)?.label}
                            </span>
                            <button
                              onClick={() => setSelectedAvailability("any")}
                              className="text-[#097E52]/60 hover:text-[#097E52] p-0.5 rounded-full hover:bg-[#097E52]/10 transition-colors ml-1"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Clear All Button */}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#097E52] hover:text-[#097E52]/80 font-semibold transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === "grid" 
                          ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === "list" 
                          ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      aria-label="List view"
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-sm text-gray-600 font-medium">Sort by:</span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white rounded-lg border border-gray-300 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#097E52]/20 focus:border-[#097E52] transition-all duration-200 hover:border-gray-400 w-full sm:w-auto"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronLeft className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none -rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {filteredVenues.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No courts found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or explore different filters
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Clear all filters
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory("premium");
                      isMobile ? setShowMobileFilters(false) : null;
                    }}
                    className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white hover:opacity-90 transition-opacity shadow-sm"
                  >
                    View Premium Courts
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={`${
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
                    : "space-y-6"
                }`}>
                  {filteredVenues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      isFavorite={favorites.includes(venue.id)}
                      onToggleFavorite={toggleFavorite}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination - Only show if there are more than 6 items */}
                {filteredVenues.length > 6 && (
                  <div className="mt-12 flex items-center justify-center">
                    <nav className="flex items-center gap-2" aria-label="Pagination">
                      <button className="
                        px-5 py-2.5 rounded-lg font-medium text-sm
                        border border-gray-300 text-gray-700
                        hover:bg-gray-50 hover:border-gray-400
                        transition-colors flex items-center gap-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                      ">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>
                      
                      <div className="flex items-center gap-1 mx-2">
                        <button className="
                          h-10 w-10 rounded-lg font-medium text-sm
                          bg-gradient-to-r from-[#097E52] to-[#23B33A]
                          text-white shadow-sm
                        ">
                          1
                        </button>
                        <button className="
                          h-10 w-10 rounded-lg font-medium text-sm
                          border border-gray-300 text-gray-700
                          hover:bg-gray-50 hover:border-gray-400
                          transition-colors
                        ">
                          2
                        </button>
                        <button className="
                          h-10 w-10 rounded-lg font-medium text-sm
                          border border-gray-300 text-gray-700
                          hover:bg-gray-50 hover:border-gray-400
                          transition-colors
                        ">
                          3
                        </button>
                        <span className="px-2 text-gray-500">...</span>
                        <button className="
                          h-10 w-10 rounded-lg font-medium text-sm
                          border border-gray-300 text-gray-700
                          hover:bg-gray-50 hover:border-gray-400
                          transition-colors
                        ">
                          8
                        </button>
                      </div>
                      
                      <button className="
                        px-5 py-2.5 rounded-lg font-medium text-sm
                        border border-gray-300 text-gray-700
                        hover:bg-gray-50 hover:border-gray-400
                        transition-colors flex items-center gap-2
                      ">
                        <span className="hidden sm:inline">Next</span>
                        <ChevronLeft className="h-4 w-4 rotate-180" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourtsPage;