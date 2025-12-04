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
  Sliders,
  Target,
  Square,
  Sprout,
  Droplet,
  Thermometer,
  Lightbulb,
  Battery,
  Trophy,
  UserCheck,
  Video,
  Music,
  LucideIcon
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

interface CricketVenue {
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
  
  // Cricket-specific fields
  pitchType: "Turf" | "Mat" | "Synthetic" | "Concrete";
  pitchCount: number;
  practiceNets: number;
  floodLights: boolean;
  equipmentRental: boolean;
  professionalCoach: boolean;
  groundSize: "International" | "Standard" | "Community" | "Practice";
  changingRooms: boolean;
  scoreboard: boolean;
  liveStreaming?: boolean;
  parking: boolean;
}

const initialVenues: CricketVenue[] = [
  {
    id: 1,
    name: "Premier Cricket Stadium",
    price: "$120",
    duration: "per hour",
    rating: 4.9,
    reviews: 245,
    address: "123 Sports Complex, Downtown, City 10001",
    availability: "Tomorrow, 3:00 PM",
    distance: "2.5 miles",
    host: {
      id: "host1",
      name: "Sports Authority",
      avatar: "SA",
      verified: true,
    },
    features: ["Turf Pitch", "Flood Lights", "Practice Nets", "Scoreboard", "VIP Lounge"],
    popular: true,
    new: true,
    category: "premium",
    instantBook: true,
    pitchType: "Turf",
    pitchCount: 2,
    practiceNets: 12,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: true,
    groundSize: "International",
    changingRooms: true,
    scoreboard: true,
    liveStreaming: true,
    parking: true,
  },
  {
    id: 2,
    name: "City Cricket Arena",
    price: "$85",
    duration: "per hour",
    rating: 4.8,
    reviews: 189,
    address: "456 Stadium Road, Uptown, City 10002",
    availability: "Today, 7:00 PM",
    distance: "1.8 miles",
    host: {
      id: "host2",
      name: "City Sports Club",
      avatar: "CSC",
      verified: true,
    },
    features: ["Turf Pitch", "Practice Nets", "Equipment Shop", "Cafe", "Showers"],
    trending: true,
    category: "premium",
    instantBook: true,
    pitchType: "Turf",
    pitchCount: 1,
    practiceNets: 8,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: true,
    groundSize: "Standard",
    changingRooms: true,
    scoreboard: true,
    liveStreaming: false,
    parking: true,
  },
  {
    id: 3,
    name: "Community Cricket Ground",
    price: "$45",
    duration: "per hour",
    rating: 4.7,
    reviews: 156,
    address: "789 Park Lane, Suburbs, City 10003",
    availability: "Friday, 6:30 PM",
    distance: "3.2 miles",
    host: {
      id: "host3",
      name: "Community Sports Trust",
      avatar: "CST",
      verified: true,
    },
    features: ["Mat Pitch", "Practice Area", "Basic Facilities", "Parking"],
    category: "community",
    pitchType: "Mat",
    pitchCount: 1,
    practiceNets: 4,
    floodLights: false,
    equipmentRental: false,
    professionalCoach: false,
    groundSize: "Community",
    changingRooms: true,
    scoreboard: false,
    liveStreaming: false,
    parking: true,
  },
  {
    id: 4,
    name: "Turf Masters Cricket Center",
    price: "$95",
    duration: "per hour",
    rating: 4.9,
    reviews: 134,
    address: "101 Turf Street, Sports Zone, City 10004",
    availability: "Saturday, 10:00 AM",
    distance: "1.2 miles",
    host: {
      id: "host4",
      name: "Turf Specialists Inc.",
      avatar: "TSI",
      verified: true,
    },
    features: ["Hybrid Turf", "Practice Nets", "Video Analysis", "Player Lounge"],
    new: true,
    trending: true,
    category: "premium",
    instantBook: true,
    pitchType: "Turf",
    pitchCount: 2,
    practiceNets: 10,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: true,
    groundSize: "Standard",
    changingRooms: true,
    scoreboard: true,
    liveStreaming: true,
    parking: true,
  },
  {
    id: 5,
    name: "Night Cricket Arena",
    price: "$110",
    duration: "per hour",
    rating: 4.8,
    reviews: 167,
    address: "202 Night Road, Entertainment District, City 10005",
    availability: "Sunday, 8:00 PM",
    distance: "2.8 miles",
    host: {
      id: "host5",
      name: "Night Sports Management",
      avatar: "NSM",
      verified: true,
    },
    features: ["Floodlit Ground", "Music System", "Food Court", "Live Streaming"],
    popular: true,
    category: "premium",
    instantBook: true,
    pitchType: "Synthetic",
    pitchCount: 1,
    practiceNets: 6,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: false,
    groundSize: "Standard",
    changingRooms: true,
    scoreboard: true,
    liveStreaming: true,
    parking: true,
  },
  {
    id: 6,
    name: "Practice Cricket Center",
    price: "$35",
    duration: "per hour",
    rating: 4.6,
    reviews: 98,
    address: "303 Practice Lane, Industrial Area, City 10006",
    availability: "Monday, 8:00 AM",
    distance: "0.8 miles",
    host: {
      id: "host6",
      name: "Practice Pros",
      avatar: "PP",
      verified: true,
    },
    features: ["Bowling Machines", "Coaching", "Equipment Shop", "Video Analysis"],
    category: "practice",
    pitchType: "Concrete",
    pitchCount: 1,
    practiceNets: 15,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: true,
    groundSize: "Practice",
    changingRooms: true,
    scoreboard: false,
    liveStreaming: false,
    parking: true,
  },
];

// Filter options using your color palette
const CATEGORIES = [
  { label: "All Grounds", value: "all" },
  { label: "Premium", value: "premium", count: 4 },
  { label: "Community", value: "community", count: 1 },
  { label: "Practice Centers", value: "practice", count: 1 },
];

const PITCH_TYPES = [
  { label: "Turf", value: "turf", icon: Sprout },
  { label: "Synthetic", value: "synthetic", icon: Square },
  { label: "Mat", value: "mat", icon: Droplet },
  { label: "Concrete", value: "concrete", icon: Thermometer },
];

const AMENITIES = [
  { label: "Flood Lights", icon: Lightbulb },
  { label: "Practice Nets", icon: Target },
  { label: "Equipment Rental", icon: Dumbbell },
  { label: "Professional Coach", icon: UserCheck },
  { label: "Scoreboard", icon: Trophy },
  { label: "Live Streaming", icon: Video },
  { label: "Parking", icon: Car },
  { label: "Cafe", icon: Coffee },
  { label: "Showers", icon: Waves },
  { label: "Wi-Fi", icon: Wifi },
  { label: "Lockers", icon: Lock },
  { label: "Pro Shop", icon: ShoppingBag },
];

const PRICE_RANGES = [
  { label: "Any Price", value: "any" },
  { label: "Under $50", value: "under50" },
  { label: "$50 - $100", value: "50-100" },
  { label: "$100+", value: "100plus" },
];

const AVAILABILITY_OPTIONS = [
  { label: "Any Time", value: "any" },
  { label: "Morning (6AM - 12PM)", value: "morning" },
  { label: "Afternoon (12PM - 6PM)", value: "afternoon" },
  { label: "Evening (6PM - 12AM)", value: "evening" },
  { label: "Night Matches", value: "night" },
  { label: "Instant Book", value: "instant" },
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended", icon: Sparkles },
  { label: "Rating: High to Low", value: "rating_desc", icon: Star },
  { label: "Price: Low to High", value: "price_asc", icon: DollarSign },
  { label: "Price: High to Low", value: "price_desc", icon: DollarSign },
  { label: "Distance: Nearest", value: "distance_asc", icon: Navigation },
  { label: "Ground Size", value: "ground_size", icon: Target },
];

const VenueCard = ({ 
  venue, 
  isFavorite, 
  onToggleFavorite,
  viewMode = "grid"
}: { 
  venue: CricketVenue; 
  isFavorite: boolean; 
  onToggleFavorite: (id: number) => void;
  viewMode: "grid" | "list";
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/court-detail/${venue.id}`);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/court-detail/${venue.id}`);
  };

  const getPitchColor = (type: string) => {
    switch (type) {
      case "Turf": return "bg-gradient-to-r from-[#097E52] to-[#23B33A]";
      case "Synthetic": return "bg-gradient-to-r from-[#006177] to-[#269089]";
      case "Mat": return "bg-gradient-to-r from-[#FFB800] to-[#FF9900]";
      case "Concrete": return "bg-gradient-to-r from-gray-500 to-gray-700";
      default: return "bg-gradient-to-r from-gray-500 to-gray-700";
    }
  };

  const getGroundSizeColor = (size: string) => {
    switch (size) {
      case "International": return "text-[#097E52] bg-[#097E52]/10";
      case "Standard": return "text-[#006177] bg-[#006177]/10";
      case "Community": return "text-[#FFB800] bg-[#FFB800]/10";
      case "Practice": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (viewMode === "list") {
    return (
      <div 
        className="group cursor-pointer transition-all duration-300"
        onClick={handleCardClick}
      >
        <div className="
          bg-white rounded-xl overflow-hidden
          border border-gray-200
          shadow-soft hover:shadow-medium
          transition-all duration-300
          hover:-translate-y-0.5
          h-full flex flex-col md:flex-row
          hover:border-[#097E52]/20
        ">
          {/* Image Section */}
          <div className="md:w-64 w-full h-48 md:h-auto relative flex-shrink-0 overflow-hidden">
            <div className="relative h-full w-full bg-gradient-to-br from-[#097E52]/5 to-[#23B33A]/5">
              {/* Badges Container - Stacked vertically on mobile */}
              <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                {/* Left side badges - Stack vertically on small screens */}
                <div className="flex flex-wrap gap-2 max-w-[calc(100%-60px)] sm:max-w-[70%]">
                  {venue.new && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-[#006177] to-[#269089] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>NEW</span>
                    </div>
                  )}
                  {venue.popular && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-[#FF9900] to-[#FF6600] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5" />
                      <span>POPULAR</span>
                    </div>
                  )}
                  {venue.trending && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-[#7ABC82] to-[#097E52] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
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
                    flex items-center justify-center shadow-sm 
                    hover:shadow-md transition-all duration-300
                    hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#097E52]/50
                    flex-shrink-0 border border-gray-200 sm:self-start
                  "
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-300 ${
                      isFavorite
                        ? 'fill-[#F50303] text-[#F50303] scale-110'
                        : 'text-gray-500 hover:text-[#F50303]'
                    }`}
                  />
                </button>
              </div>

              {/* Pitch Type Badge - Position based on screen size */}
              <div className="absolute top-20 sm:top-16 left-4 z-10">
                <div className={`${getPitchColor(venue.pitchType)} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm`}>
                  {venue.pitchType}
                </div>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[#097E52]">{venue.price}</span>
                    <span className="text-sm text-gray-500">{venue.duration}</span>
                  </div>
                </div>
              </div>
              
              {/* Cricket Info */}
              <div className="absolute bottom-4 right-4 z-10">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <span className="text-xs font-medium text-white flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {venue.distance}
                    </span>
                  </div>
                  <div className={`${getGroundSizeColor(venue.groundSize)} text-xs font-medium px-3 py-1.5 rounded-full`}>
                    {venue.groundSize}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-5">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 sm:h-5 w-4 sm:w-5 ${
                              i < Math.floor(venue.rating)
                                ? "fill-[#FFB800] text-[#FFB800]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-base sm:text-lg">
                          {venue.rating}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          ({venue.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    
                    {/* Ground Size Badge */}
                    <div className="hidden sm:block">
                      <div className={`px-3 py-1.5 ${getGroundSizeColor(venue.groundSize)} rounded-full text-sm font-medium`}>
                        {venue.groundSize} Ground
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-[#097E52] transition-colors">
                    {venue.name}
                  </h3>
                  
                  <div className="flex items-start gap-3 text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{venue.address}</span>
                  </div>
                </div>
                
                {/* Host Info - Hidden on mobile in list view */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="relative">
                    <div className="
                      h-12 w-12 rounded-full 
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
                    <p className="text-sm font-semibold text-foreground">
                      {venue.host.name}
                    </p>
                    {venue.host.verified && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#097E52]">
                        <Shield className="h-3 w-3" />
                        <span className="font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cricket Specific Info */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-[#097E52]/5 rounded-lg sm:rounded-xl p-3 border border-[#097E52]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-[#097E52]" />
                    <span className="text-sm font-medium text-foreground">Pitches</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{venue.pitchCount}</p>
                </div>
                <div className="bg-[#097E52]/5 rounded-lg sm:rounded-xl p-3 border border-[#097E52]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-[#097E52]" />
                    <span className="text-sm font-medium text-foreground">Practice Nets</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{venue.practiceNets}</p>
                </div>
                <div className="bg-[#097E52]/5 rounded-lg sm:rounded-xl p-3 border border-[#097E52]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-4 w-4 text-[#097E52]" />
                    <span className="text-sm font-medium text-foreground">Flood Lights</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{venue.floodLights ? "Yes" : "No"}</p>
                </div>
                <div className="bg-[#097E52]/5 rounded-lg sm:rounded-xl p-3 border border-[#097E52]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="h-4 w-4 text-[#097E52]" />
                    <span className="text-sm font-medium text-foreground">Coach</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{venue.professionalCoach ? "Available" : "No"}</p>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {venue.features.slice(0, 4).map((feature, idx) => {
                  const amenity = AMENITIES.find(a => a.label === feature);
                  return (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 border border-gray-200"
                    >
                      {amenity?.icon && <amenity.icon className="h-4 w-4" />}
                      <span className="hidden sm:inline">{feature}</span>
                      <span className="sm:hidden">{feature.split(' ')[0]}</span>
                    </div>
                  );
                })}
                {venue.features.length > 4 && (
                  <div className="px-3 py-1.5 bg-gray-50 text-gray-500 text-sm font-medium rounded-lg border border-gray-200">
                    +{venue.features.length - 4} more
                  </div>
                )}
              </div>

              {/* Bottom Section */}
              <div className="flex-1 flex flex-col justify-end">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 sm:pt-5 border-t border-gray-200">
                  {/* Availability */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 text-[#097E52]">
                      <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-[#097E52]/10 flex items-center justify-center">
                        <Calendar className="h-5 sm:h-6 w-5 sm:w-6" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Available</p>
                        <p className="font-semibold text-base sm:text-lg">{venue.availability}</p>
                      </div>
                    </div>
                    {venue.instantBook && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full">
                        <Zap className="h-3.5 w-3.5" />
                        <span>Instant Book</span>
                      </div>
                    )}
                  </div>

                  {/* Book Button */}
                  <button 
                    onClick={handleBookClick}
                    className="
                      px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base
                      bg-gradient-to-r from-[#097E52] to-[#23B33A]
                      text-white
                      hover:from-[#097E52]/90 hover:to-[#23B33A]/90
                      hover:shadow-md
                      transition-all duration-300
                      flex items-center justify-center gap-2
                      group/button focus:outline-none focus:ring-2 focus:ring-[#097E52]/50 focus:ring-offset-2
                      shadow-sm hover:shadow-md
                      w-full sm:w-auto min-w-[140px] sm:min-w-[180px]
                    "
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5 transition-transform duration-300 group-hover/button:translate-x-1" />
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
        border border-gray-200
        shadow-soft hover:shadow-medium
        transition-all duration-300
        hover:-translate-y-0.5
        h-full
        hover:border-[#097E52]/20
      ">
        {/* Badges Container */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex items-start justify-between">
          <div className="flex flex-wrap gap-2 max-w-[calc(100%-40px)]">
            {venue.new && (
              <div className="px-2 py-1 bg-gradient-to-r from-[#006177] to-[#269089] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>NEW</span>
              </div>
            )}
            {venue.popular && (
              <div className="px-2 py-1 bg-gradient-to-r from-[#FF9900] to-[#FF6600] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                <Flame className="h-3 w-3" />
                <span>POPULAR</span>
              </div>
            )}
            {venue.trending && (
              <div className="px-2 py-1 bg-gradient-to-r from-[#7ABC82] to-[#097E52] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
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
                  ? 'fill-[#F50303] text-[#F50303] scale-110'
                  : 'text-gray-400 hover:text-[#F50303]'
              }`}
            />
          </button>
        </div>

        {/* Pitch Type Badge - Position adjusted */}
        <div className="absolute top-12 sm:top-16 left-3 sm:left-4 z-10">
          <div className={`${getPitchColor(venue.pitchType)} text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm`}>
            {venue.pitchType}
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-[#097E52]/5 to-[#23B33A]/5">
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10">
            <div className="bg-white rounded-full px-3 py-1.5 shadow-sm">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-[#097E52]">{venue.price}</span>
                <span className="text-xs text-gray-500">{venue.duration}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="text-xs font-medium text-white flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {venue.distance}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(venue.rating)
                        ? "fill-[#FFB800] text-[#FFB800]"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-foreground text-base">
                {venue.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({venue.reviews})
              </span>
            </div>
            
            {venue.host.verified && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-[#097E52] bg-[#097E52]/10 px-2.5 py-1 rounded-full">
                <Shield className="h-3.5 w-3.5" />
                <span className="font-medium">Verified</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-[#097E52] transition-colors">
            {venue.name}
          </h3>

          <div className="flex items-start gap-2 text-gray-600 mb-3 sm:mb-4">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm line-clamp-2 flex-1">{venue.address}</span>
          </div>

          {/* Cricket Quick Info */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#097E52]" />
              <span className="text-sm font-medium text-foreground">
                {venue.pitchCount} pitch{venue.pitchCount > 1 ? 'es' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#097E52]" />
              <span className="text-sm font-medium text-foreground">
                {venue.practiceNets} nets
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#097E52]" />
              <span className="text-sm font-medium text-foreground">
                {venue.floodLights ? 'Floodlit' : 'Day only'}
              </span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getGroundSizeColor(venue.groundSize)}`}>
              {venue.groundSize}
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
            {venue.features.slice(0, 2).map((feature, idx) => {
              const amenity = AMENITIES.find(a => a.label === feature);
              return (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 border border-gray-200"
                >
                  {amenity?.icon && <amenity.icon className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{feature}</span>
                  <span className="sm:hidden">{feature.split(' ')[0]}</span>
                </div>
              );
            })}
            {venue.features.length > 2 && (
              <div className="px-2.5 py-1.5 bg-gray-50 text-gray-500 text-xs font-medium rounded-lg border border-gray-200">
                +{venue.features.length - 2}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-3 sm:pt-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="
                    h-8 sm:h-10 w-8 sm:w-10 rounded-full 
                    flex items-center justify-center
                    bg-gradient-to-r from-[#097E52] to-[#23B33A]
                    ring-2 ring-white shadow-sm
                  ">
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      {venue.host.avatar}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 font-medium">Host</p>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">
                    {venue.host.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Calendar className="h-4 w-4 text-[#097E52]" />
                  <span className="text-xs font-medium text-foreground">Available</span>
                </div>
                <p className="text-xs sm:text-sm text-[#097E52] font-semibold line-clamp-1">
                  {venue.availability}
                </p>
              </div>
            </div>

            <button 
              onClick={handleBookClick}
              className="
                w-full py-2.5 rounded-lg font-semibold text-sm
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
  selectedPitchType,
  setSelectedPitchType,
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
  selectedPitchType: string[];
  setSelectedPitchType: (types: string[]) => void;
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
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-[#097E52]" />
            <h2 className="text-xl font-bold text-foreground">Filters</h2>
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
        <p className="text-gray-500 text-sm">Refine your cricket grounds search</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Sort */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gray-400" />
            Sort by
          </h3>
          <div className="space-y-2">
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`
                    w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200
                    flex items-center gap-3
                    ${sortBy === option.value
                      ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${sortBy === option.value ? 'text-[#097E52]' : 'text-gray-400'}`} />
                  <span className="flex-1">{option.label}</span>
                  {sortBy === option.value && (
                    <Check className="h-4 w-4 text-[#097E52]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-400" />
            Categories
          </h3>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm transition-all duration-200
                  flex items-center justify-between group
                  ${selectedCategory === category.value
                    ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }
                `}
              >
                <span className="font-medium">{category.label}</span>
                <span className={`
                  text-xs px-2 sm:px-2.5 py-1 rounded-full transition-colors
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

        {/* Pitch Type */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Sprout className="h-5 w-5 text-gray-400" />
            Pitch Type
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PITCH_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedPitchType(
                    selectedPitchType.includes(type.value)
                      ? selectedPitchType.filter(t => t !== type.value)
                      : [...selectedPitchType, type.value]
                  )}
                  className={`
                    px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200
                    flex items-center justify-between
                    ${selectedPitchType.includes(type.value)
                      ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </div>
                  {selectedPitchType.includes(type.value) && (
                    <Check className="h-4 w-4 text-[#097E52]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            Price Range
          </h3>
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedPriceRange(range.value)}
                className={`
                  w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200
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
          <h3 className="font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            Availability
          </h3>
          <div className="space-y-2">
            {AVAILABILITY_OPTIONS.map((option) => {
              let Icon = Clock;
              if (option.value === "morning" || option.value === "afternoon") Icon = Sun;
              if (option.value === "evening") Icon = Moon;
              if (option.value === "night") Icon = Lightbulb;
              if (option.value === "instant") Icon = Zap;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedAvailability(option.value)}
                  className={`
                    w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200
                    flex items-center justify-between
                    ${selectedAvailability === option.value
                      ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${selectedAvailability === option.value ? 'text-[#097E52]' : 'text-gray-400'}`} />
                    <span className="text-xs sm:text-sm">{option.label}</span>
                  </div>
                  {selectedAvailability === option.value && (
                    <Check className="h-4 w-4 text-[#097E52]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-gray-400" />
            Amenities
          </h3>
          <div className="space-y-2">
            {AMENITIES.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <button
                  key={amenity.label}
                  onClick={() => setSelectedAmenities(
                    selectedAmenities.includes(amenity.label)
                      ? selectedAmenities.filter(a => a !== amenity.label)
                      : [...selectedAmenities, amenity.label]
                  )}
                  className={`
                    w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200
                    flex items-center justify-between
                    ${selectedAmenities.includes(amenity.label)
                      ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${selectedAmenities.includes(amenity.label) ? 'text-[#097E52]' : 'text-gray-400'}`} />
                    <span className="text-xs sm:text-sm">{amenity.label}</span>
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
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white hover:opacity-90 transition-opacity shadow-sm hover:shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

const CricketGroundsPage = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPitchType, setSelectedPitchType] = useState<string[]>([]);
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

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const filteredVenues = useMemo(() => {
    let result = [...initialVenues];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(venue =>
        venue.name.toLowerCase().includes(query) ||
        venue.address.toLowerCase().includes(query) ||
        venue.features.some(feature => feature.toLowerCase().includes(query)) ||
        venue.pitchType.toLowerCase().includes(query) ||
        venue.groundSize.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(venue => venue.category === selectedCategory);
    }

    // Apply pitch type filter
    if (selectedPitchType.length > 0) {
      result = result.filter(venue =>
        selectedPitchType.includes(venue.pitchType.toLowerCase())
      );
    }

    // Apply amenities filter
    if (selectedAmenities.length > 0) {
      result = result.filter(venue =>
        selectedAmenities.every(amenity => {
          if (amenity === "Flood Lights") return venue.floodLights;
          if (amenity === "Professional Coach") return venue.professionalCoach;
          if (amenity === "Scoreboard") return venue.scoreboard;
          if (amenity === "Live Streaming") return venue.liveStreaming;
          if (amenity === "Practice Nets") return venue.practiceNets > 0;
          if (amenity === "Equipment Rental") return venue.equipmentRental;
          if (amenity === "Parking") return venue.parking;
          return venue.features.includes(amenity);
        })
      );
    }

    // Apply price range filter
    if (selectedPriceRange !== "any") {
      result = result.filter(venue => {
        const price = parseInt(venue.price.replace("$", ""));
        switch (selectedPriceRange) {
          case "under50":
            return price < 50;
          case "50-100":
            return price >= 50 && price <= 100;
          case "100plus":
            return price > 100;
          default:
            return true;
        }
      });
    }

    // Apply availability filter
    if (selectedAvailability !== "any") {
      result = result.filter(venue => {
        if (selectedAvailability === "instant") {
          return venue.instantBook;
        }
        if (selectedAvailability === "night") {
          return venue.floodLights;
        }
        const time = venue.availability.toLowerCase();
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
      case "ground_size":
        const sizeOrder = { "International": 3, "Standard": 2, "Community": 1, "Practice": 0 };
        result.sort((a, b) => sizeOrder[b.groundSize] - sizeOrder[a.groundSize]);
        break;
      default:
        result.sort((a, b) => {
          const scoreA = (a.new ? 3 : 0) + (a.popular ? 2 : 0) + (a.trending ? 1 : 0) + a.rating;
          const scoreB = (b.new ? 3 : 0) + (b.popular ? 2 : 0) + (b.trending ? 1 : 0) + b.rating;
          return scoreB - scoreA;
        });
    }

    return result;
  }, [
    searchQuery, 
    selectedCategory, 
    selectedAmenities, 
    selectedPitchType, 
    selectedPriceRange, 
    selectedAvailability, 
    sortBy
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAmenities([]);
    setSelectedPitchType([]);
    setSelectedPriceRange("any");
    setSelectedAvailability("any");
    setSortBy("recommended");
  };

  const activeFilterCount = [
    searchQuery,
    selectedCategory !== "all",
    selectedAmenities.length > 0,
    selectedPitchType.length > 0,
    selectedPriceRange !== "any",
    selectedAvailability !== "any",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Desktop Sidebar Toggle */}
                <button
                  onClick={() => setShowDesktopSidebar(!showDesktopSidebar)}
                  className="hidden lg:flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  aria-label={showDesktopSidebar ? "Hide filters" : "Show filters"}
                >
                  {showDesktopSidebar ? <ChevronLeft className="h-5 w-5" /> : <Sliders className="h-5 w-5" />}
                </button>
                
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Cricket Grounds</h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Book professional cricket pitches & stadiums
                  </p>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition-colors border border-gray-200 text-sm"
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
                  placeholder="Search cricket grounds, pitch types, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-xl
                    border border-gray-300 focus:outline-none
                    focus:ring-2 focus:ring-[#097E52]/20 focus:border-[#097E52]
                    text-gray-900 placeholder-gray-500 text-sm
                    bg-white
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex gap-4 sm:gap-6 xl:gap-8 relative">
          {/* Desktop Sidebar */}
          {!isMobile && showDesktopSidebar && (
            <aside className="hidden lg:block w-80 flex-shrink-0 transition-all duration-300">
              <div className="sticky top-24">
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedAmenities={selectedAmenities}
                  setSelectedAmenities={setSelectedAmenities}
                  selectedPitchType={selectedPitchType}
                  setSelectedPitchType={setSelectedPitchType}
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
                  selectedPitchType={selectedPitchType}
                  setSelectedPitchType={setSelectedPitchType}
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
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">
                        {filteredVenues.length} {filteredVenues.length === 1 ? 'Cricket Ground' : 'Cricket Grounds'} Available
                      </h2>
                      {activeFilterCount > 0 && (
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">
                          {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                        </p>
                      )}
                    </div>
                    
                    {/* Active Filters */}
                    {activeFilterCount > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCategory !== "all" && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2">
                            <Building className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#097E52]" />
                            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
                              {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                            </span>
                            <button
                              onClick={() => setSelectedCategory("all")}
                              className="text-[#097E52]/60 hover:text-[#097E52] p-0.5 rounded-full hover:bg-[#097E52]/10 transition-colors ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        {selectedPitchType.length > 0 && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2">
                            <Sprout className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#097E52]" />
                            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
                              {selectedPitchType.length} pitch type{selectedPitchType.length > 1 ? 's' : ''}
                            </span>
                            <button
                              onClick={() => setSelectedPitchType([])}
                              className="text-[#097E52]/60 hover:text-[#097E52] p-0.5 rounded-full hover:bg-[#097E52]/10 transition-colors ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        {selectedPriceRange !== "any" && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2">
                            <DollarSign className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#097E52]" />
                            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
                              {PRICE_RANGES.find(p => p.value === selectedPriceRange)?.label}
                            </span>
                            <button
                              onClick={() => setSelectedPriceRange("any")}
                              className="text-[#097E52]/60 hover:text-[#097E52] p-0.5 rounded-full hover:bg-[#097E52]/10 transition-colors ml-1"
                            >
                              <X className="h-3 w-3" />
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
                
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === "grid" 
                          ? "bg-white text-foreground shadow-sm border border-gray-200" 
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
                          ? "bg-white text-foreground shadow-sm border border-gray-200" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      aria-label="List view"
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-sm text-gray-600 font-medium">Sort:</span>
                    <div className="relative flex-1 sm:flex-none">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 bg-white rounded-lg border border-gray-300 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#097E52]/20 focus:border-[#097E52] transition-all duration-200 hover:border-gray-400 w-full"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronLeft className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none -rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {filteredVenues.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
                  <Target className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">No cricket grounds found</h3>
                <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4 text-sm sm:text-base">
                  Try adjusting your search criteria or explore different pitch types
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm sm:text-base"
                  >
                    Clear all filters
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory("premium");
                      isMobile ? setShowMobileFilters(false) : null;
                    }}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white hover:opacity-90 transition-opacity shadow-sm text-sm sm:text-base"
                  >
                    View Premium Grounds
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={`${
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" 
                    : "space-y-4 sm:space-y-6"
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

                {/* Pagination */}
                {filteredVenues.length > 6 && (
                  <div className="mt-8 sm:mt-12 flex items-center justify-center">
                    <nav className="flex items-center gap-1 sm:gap-2" aria-label="Pagination">
                      <button className="
                        px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm
                        border border-gray-300 text-gray-700
                        hover:bg-gray-50 hover:border-gray-400
                        transition-colors flex items-center gap-1 sm:gap-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                      ">
                        <ChevronLeft className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>
                      
                      <div className="flex items-center gap-1 mx-1 sm:mx-2">
                        <button className="
                          h-8 sm:h-10 w-8 sm:w-10 rounded-lg font-medium text-xs sm:text-sm
                          bg-gradient-to-r from-[#097E52] to-[#23B33A]
                          text-white shadow-sm
                        ">
                          1
                        </button>
                        <button className="
                          h-8 sm:h-10 w-8 sm:w-10 rounded-lg font-medium text-xs sm:text-sm
                          border border-gray-300 text-gray-700
                          hover:bg-gray-50 hover:border-gray-400
                          transition-colors
                        ">
                          2
                        </button>
                        <button className="
                          h-8 sm:h-10 w-8 sm:w-10 rounded-lg font-medium text-xs sm:text-sm
                          border border-gray-300 text-gray-700
                          hover:bg-gray-50 hover:border-gray-400
                          transition-colors
                        ">
                          3
                        </button>
                        <span className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">...</span>
                        <button className="
                          h-8 sm:h-10 w-8 sm:w-10 rounded-lg font-medium text-xs sm:text-sm
                          border border-gray-300 text-gray-700
                          hover:bg-gray-50 hover:border-gray-400
                          transition-colors
                        ">
                          8
                        </button>
                      </div>
                      
                      <button className="
                        px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm
                        border border-gray-300 text-gray-700
                        hover:bg-gray-50 hover:border-gray-400
                        transition-colors flex items-center gap-1 sm:gap-2
                      ">
                        <span className="hidden sm:inline">Next</span>
                        <ChevronLeft className="h-3.5 sm:h-4 w-3.5 sm:w-4 rotate-180" />
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

export default CricketGroundsPage;