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
  LucideIcon,
  Tent as Tennis,
  Eye,
  Footprints,
  Cloud,
  WindIcon,
  Sunrise
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

interface TennisCourt {
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
  
  // Tennis-specific fields
  courtType: "Hard Court" | "Clay" | "Grass" | "Artificial Grass" | "Carpet";
  courtCount: number;
  practiceWalls: number;
  floodLights: boolean;
  equipmentRental: boolean;
  professionalCoach: boolean;
  courtSize: "Grand Slam" | "Standard" | "Mini" | "Practice";
  changingRooms: boolean;
  scoreboard: boolean;
  ballMachine?: boolean;
  parking: boolean;
  netQuality: "Professional" | "Standard" | "Basic";
  surfaceCondition: "Excellent" | "Good" | "Fair";
  windScreens: boolean;
  spectatorSeating: number;
  proShop: boolean;
  stringingService?: boolean;
}

const initialCourts: TennisCourt[] = [
  {
    id: 1,
    name: "Grand Slam Tennis Center",
    price: "$85",
    duration: "per hour",
    rating: 4.9,
    reviews: 245,
    address: "123 Tennis Avenue, Sports District, City 10001",
    availability: "Tomorrow, 3:00 PM",
    distance: "2.5 miles",
    host: {
      id: "host1",
      name: "Tennis Authority",
      avatar: "TA",
      verified: true,
    },
    features: ["Hard Court", "Flood Lights", "Ball Machines", "Pro Shop", "Stringing Service"],
    popular: true,
    new: true,
    category: "premium",
    instantBook: true,
    courtType: "Hard Court",
    courtCount: 8,
    practiceWalls: 4,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: true,
    courtSize: "Grand Slam",
    changingRooms: true,
    scoreboard: true,
    ballMachine: true,
    parking: true,
    netQuality: "Professional",
    surfaceCondition: "Excellent",
    windScreens: true,
    spectatorSeating: 200,
    proShop: true,
    stringingService: true,
  },
  {
    id: 2,
    name: "Clay Masters Club",
    price: "$95",
    duration: "per hour",
    rating: 4.8,
    reviews: 189,
    address: "456 Clay Court Road, Uptown, City 10002",
    availability: "Today, 7:00 PM",
    distance: "1.8 miles",
    host: {
      id: "host2",
      name: "Clay Specialists LLC",
      avatar: "CS",
      verified: true,
    },
    features: ["Clay Court", "Practice Walls", "Equipment Shop", "Cafe", "Showers"],
    trending: true,
    category: "premium",
    instantBook: true,
    courtType: "Clay",
    courtCount: 6,
    practiceWalls: 3,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: true,
    courtSize: "Standard",
    changingRooms: true,
    scoreboard: true,
    ballMachine: true,
    parking: true,
    netQuality: "Professional",
    surfaceCondition: "Excellent",
    windScreens: true,
    spectatorSeating: 100,
    proShop: true,
    stringingService: true,
  },
  {
    id: 3,
    name: "Community Tennis Park",
    price: "$35",
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
    features: ["Hard Court", "Practice Area", "Basic Facilities", "Parking"],
    category: "community",
    courtType: "Hard Court",
    courtCount: 4,
    practiceWalls: 2,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: false,
    courtSize: "Standard",
    changingRooms: true,
    scoreboard: false,
    ballMachine: false,
    parking: true,
    netQuality: "Standard",
    surfaceCondition: "Good",
    windScreens: false,
    spectatorSeating: 50,
    proShop: false,
    stringingService: false,
  },
  {
    id: 4,
    name: "Grass Court Academy",
    price: "$120",
    duration: "per hour",
    rating: 4.9,
    reviews: 134,
    address: "101 Grass Lane, Elite Zone, City 10004",
    availability: "Saturday, 10:00 AM",
    distance: "1.2 miles",
    host: {
      id: "host4",
      name: "Grass Court Masters",
      avatar: "GCM",
      verified: true,
    },
    features: ["Grass Court", "Practice Walls", "Video Analysis", "Player Lounge"],
    new: true,
    trending: true,
    category: "premium",
    instantBook: true,
    courtType: "Grass",
    courtCount: 4,
    practiceWalls: 2,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: true,
    courtSize: "Standard",
    changingRooms: true,
    scoreboard: true,
    ballMachine: true,
    parking: true,
    netQuality: "Professional",
    surfaceCondition: "Excellent",
    windScreens: true,
    spectatorSeating: 150,
    proShop: true,
    stringingService: true,
  },
  {
    id: 5,
    name: "Night Tennis Arena",
    price: "$75",
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
    features: ["Floodlit Courts", "Music System", "Food Court", "Ball Machines"],
    popular: true,
    category: "premium",
    instantBook: true,
    courtType: "Artificial Grass",
    courtCount: 6,
    practiceWalls: 3,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: true,
    courtSize: "Standard",
    changingRooms: true,
    scoreboard: true,
    ballMachine: true,
    parking: true,
    netQuality: "Standard",
    surfaceCondition: "Good",
    windScreens: true,
    spectatorSeating: 100,
    proShop: true,
    stringingService: false,
  },
  {
    id: 6,
    name: "Practice Tennis Center",
    price: "$25",
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
    features: ["Practice Walls", "Coaching", "Equipment Shop", "Video Analysis"],
    category: "practice",
    courtType: "Hard Court",
    courtCount: 2,
    practiceWalls: 6,
    floodLights: true,
    equipmentRental: true,
    professionalCoach: true,
    courtSize: "Practice",
    changingRooms: true,
    scoreboard: false,
    ballMachine: true,
    parking: true,
    netQuality: "Basic",
    surfaceCondition: "Fair",
    windScreens: false,
    spectatorSeating: 20,
    proShop: false,
    stringingService: false,
  },
];

// Filter options using your color palette
const CATEGORIES = [
  { label: "All Courts", value: "all" },
  { label: "Premium", value: "premium", count: 4 },
  { label: "Community", value: "community", count: 1 },
  { label: "Practice Centers", value: "practice", count: 1 },
];

const COURT_TYPES = [
  { label: "Hard Court", value: "hard", icon: Square },
  { label: "Clay", value: "clay", icon: Droplet },
  { label: "Grass", value: "grass", icon: Sprout },
  { label: "Artificial Grass", value: "artificial", icon: Cloud },
  { label: "Carpet", value: "carpet", icon: Footprints },
];

const AMENITIES = [
  { label: "Flood Lights", icon: Lightbulb },
  { label: "Practice Walls", icon: Target },
  { label: "Equipment Rental", icon: Dumbbell },
  { label: "Professional Coach", icon: UserCheck },
  { label: "Scoreboard", icon: Trophy },
  { label: "Ball Machine", icon: Tennis },
  { label: "Parking", icon: Car },
  { label: "Cafe", icon: Coffee },
  { label: "Showers", icon: Waves },
  { label: "Wi-Fi", icon: Wifi },
  { label: "Lockers", icon: Lock },
  { label: "Pro Shop", icon: ShoppingBag },
  { label: "Stringing Service", icon: WindIcon },
  { label: "Wind Screens", icon: Wind },
  { label: "Spectator Seating", icon: Users },
  { label: "Video Analysis", icon: Video },
];

const PRICE_RANGES = [
  { label: "Any Price", value: "any" },
  { label: "Under $40", value: "under40" },
  { label: "$40 - $80", value: "40-80" },
  { label: "$80+", value: "80plus" },
];

const AVAILABILITY_OPTIONS = [
  { label: "Any Time", value: "any" },
  { label: "Morning (6AM - 12PM)", value: "morning" },
  { label: "Afternoon (12PM - 6PM)", value: "afternoon" },
  { label: "Evening (6PM - 12AM)", value: "evening" },
  { label: "Night Sessions", value: "night" },
  { label: "Instant Book", value: "instant" },
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended", icon: Sparkles },
  { label: "Rating: High to Low", value: "rating_desc", icon: Star },
  { label: "Price: Low to High", value: "price_asc", icon: DollarSign },
  { label: "Price: High to Low", value: "price_desc", icon: DollarSign },
  { label: "Distance: Nearest", value: "distance_asc", icon: Navigation },
  { label: "Court Quality", value: "court_quality", icon: Trophy },
];

const CourtCard = ({ 
  court, 
  isFavorite, 
  onToggleFavorite,
  viewMode = "grid"
}: { 
  court: TennisCourt; 
  isFavorite: boolean; 
  onToggleFavorite: (id: number) => void;
  viewMode: "grid" | "list";
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/court-detail/${court.id}`);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/court-detail/${court.id}`);
  };

  const getCourtColor = (type: string) => {
    switch (type) {
      case "Hard Court": return "bg-gradient-to-r from-[#097E52] to-[#23B33A]";
      case "Clay": return "bg-gradient-to-r from-[#FFB800] to-[#FF9900]";
      case "Grass": return "bg-gradient-to-r from-[#097E52] to-[#7ABC82]";
      case "Artificial Grass": return "bg-gradient-to-r from-[#006177] to-[#269089]";
      case "Carpet": return "bg-gradient-to-r from-gray-500 to-gray-700";
      default: return "bg-gradient-to-r from-gray-500 to-gray-700";
    }
  };

  const getCourtSizeColor = (size: string) => {
    switch (size) {
      case "Grand Slam": return "text-[#097E52] bg-[#097E52]/10";
      case "Standard": return "text-[#006177] bg-[#006177]/10";
      case "Mini": return "text-[#FFB800] bg-[#FFB800]/10";
      case "Practice": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSurfaceConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent": return "text-[#097E52] bg-[#097E52]/10";
      case "Good": return "text-[#FFB800] bg-[#FFB800]/10";
      case "Fair": return "text-gray-600 bg-gray-100";
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
              {/* Badges Container */}
              <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                <div className="flex flex-wrap gap-2 max-w-[calc(100%-60px)] sm:max-w-[70%]">
                  {court.new && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-[#006177] to-[#269089] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>NEW</span>
                    </div>
                  )}
                  {court.popular && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-[#FF9900] to-[#FF6600] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5" />
                      <span>POPULAR</span>
                    </div>
                  )}
                  {court.trending && (
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
                    onToggleFavorite(court.id);
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

              {/* Court Type Badge */}
              <div className="absolute top-20 sm:top-16 left-4 z-10">
                <div className={`${getCourtColor(court.courtType)} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm`}>
                  {court.courtType}
                </div>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[#097E52]">{court.price}</span>
                    <span className="text-sm text-gray-500">{court.duration}</span>
                  </div>
                </div>
              </div>
              
              {/* Tennis Info */}
              <div className="absolute bottom-4 right-4 z-10">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <span className="text-xs font-medium text-white flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {court.distance}
                    </span>
                  </div>
                  <div className={`${getCourtSizeColor(court.courtSize)} text-xs font-medium px-3 py-1.5 rounded-full`}>
                    {court.courtSize}
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
                              i < Math.floor(court.rating)
                                ? "fill-[#FFB800] text-[#FFB800]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-base sm:text-lg">
                          {court.rating}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          ({court.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    
                    {/* Court Size Badge */}
                    <div className="hidden sm:block">
                      <div className={`px-3 py-1.5 ${getCourtSizeColor(court.courtSize)} rounded-full text-sm font-medium`}>
                        {court.courtSize} Court
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-[#097E52] transition-colors">
                    {court.name}
                  </h3>
                  
                  <div className="flex items-start gap-3 text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{court.address}</span>
                  </div>
                </div>
                
                {/* Host Info */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="relative">
                    <div className="
                      h-12 w-12 rounded-full 
                      flex items-center justify-center
                      bg-gradient-to-r from-[#097E52] to-[#23B33A]
                      ring-2 ring-white shadow-sm
                    ">
                      <span className="text-white font-semibold text-sm">
                        {court.host.avatar}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Host</p>
                    <p className="text-sm font-semibold text-foreground">
                      {court.host.name}
                    </p>
                    {court.host.verified && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#097E52]">
                        <Shield className="h-3 w-3" />
                        <span className="font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tennis Specific Info */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-[#097E52]/5 rounded-lg sm:rounded-xl p-3 border border-[#097E52]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Tennis className="h-4 w-4 text-[#097E52]" />
                    <span className="text-sm font-medium text-foreground">Courts</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{court.courtCount}</p>
                </div>
                <div className="bg-[#097E52]/5 rounded-lg sm:rounded-xl p-3 border border-[#097E52]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-[#097E52]" />
                    <span className="text-sm font-medium text-foreground">Practice Walls</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{court.practiceWalls}</p>
                </div>
                <div className="bg-[#097E52]/5 rounded-lg sm:rounded-xl p-3 border border-[#097E52]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-4 w-4 text-[#097E52]" />
                    <span className="text-sm font-medium text-foreground">Flood Lights</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{court.floodLights ? "Yes" : "No"}</p>
                </div>
                <div className="bg-[#097E52]/5 rounded-lg sm:rounded-xl p-3 border border-[#097E52]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSurfaceConditionColor(court.surfaceCondition)}`}>
                      {court.surfaceCondition} Surface
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {court.features.slice(0, 4).map((feature, idx) => {
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
                {court.features.length > 4 && (
                  <div className="px-3 py-1.5 bg-gray-50 text-gray-500 text-sm font-medium rounded-lg border border-gray-200">
                    +{court.features.length - 4} more
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
                        <p className="font-semibold text-base sm:text-lg">{court.availability}</p>
                      </div>
                    </div>
                    {court.instantBook && (
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
            {court.new && (
              <div className="px-2 py-1 bg-gradient-to-r from-[#006177] to-[#269089] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>NEW</span>
              </div>
            )}
            {court.popular && (
              <div className="px-2 py-1 bg-gradient-to-r from-[#FF9900] to-[#FF6600] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1">
                <Flame className="h-3 w-3" />
                <span>POPULAR</span>
              </div>
            )}
            {court.trending && (
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
              onToggleFavorite(court.id);
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

        {/* Court Type Badge */}
        <div className="absolute top-12 sm:top-16 left-3 sm:left-4 z-10">
          <div className={`${getCourtColor(court.courtType)} text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm`}>
            {court.courtType}
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-[#097E52]/5 to-[#23B33A]/5">
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10">
            <div className="bg-white rounded-full px-3 py-1.5 shadow-sm">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-[#097E52]">{court.price}</span>
                <span className="text-xs text-gray-500">{court.duration}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="text-xs font-medium text-white flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {court.distance}
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
                      i < Math.floor(court.rating)
                        ? "fill-[#FFB800] text-[#FFB800]"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-foreground text-base">
                {court.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({court.reviews})
              </span>
            </div>
            
            {court.host.verified && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-[#097E52] bg-[#097E52]/10 px-2.5 py-1 rounded-full">
                <Shield className="h-3.5 w-3.5" />
                <span className="font-medium">Verified</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-[#097E52] transition-colors">
            {court.name}
          </h3>

          <div className="flex items-start gap-2 text-gray-600 mb-3 sm:mb-4">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm line-clamp-2 flex-1">{court.address}</span>
          </div>

          {/* Tennis Quick Info */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Tennis className="h-4 w-4 text-[#097E52]" />
              <span className="text-sm font-medium text-foreground">
                {court.courtCount} court{court.courtCount > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#097E52]" />
              <span className="text-sm font-medium text-foreground">
                {court.practiceWalls} wall{court.practiceWalls > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#097E52]" />
              <span className="text-sm font-medium text-foreground">
                {court.floodLights ? 'Floodlit' : 'Day only'}
              </span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCourtSizeColor(court.courtSize)}`}>
              {court.courtSize}
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
            {court.features.slice(0, 2).map((feature, idx) => {
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
            {court.features.length > 2 && (
              <div className="px-2.5 py-1.5 bg-gray-50 text-gray-500 text-xs font-medium rounded-lg border border-gray-200">
                +{court.features.length - 2}
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
                      {court.host.avatar}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 font-medium">Host</p>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">
                    {court.host.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Calendar className="h-4 w-4 text-[#097E52]" />
                  <span className="text-xs font-medium text-foreground">Available</span>
                </div>
                <p className="text-xs sm:text-sm text-[#097E52] font-semibold line-clamp-1">
                  {court.availability}
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
  selectedCourtType,
  setSelectedCourtType,
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
  selectedCourtType: string[];
  setSelectedCourtType: (types: string[]) => void;
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
            <Tennis className="h-6 w-6 text-[#097E52]" />
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
        <p className="text-gray-500 text-sm">Refine your tennis courts search</p>
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
                  {category.count || initialCourts.filter(v => v.category === category.value).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Court Type */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Tennis className="h-5 w-5 text-gray-400" />
            Court Surface
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {COURT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedCourtType(
                    selectedCourtType.includes(type.value)
                      ? selectedCourtType.filter(t => t !== type.value)
                      : [...selectedCourtType, type.value]
                  )}
                  className={`
                    px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200
                    flex items-center justify-between
                    ${selectedCourtType.includes(type.value)
                      ? 'bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 text-[#097E52] border border-[#097E52]/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </div>
                  {selectedCourtType.includes(type.value) && (
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
              if (option.value === "morning") Icon = Sunrise;
              if (option.value === "afternoon") Icon = Sun;
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

const TennisCourtsPage = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCourtType, setSelectedCourtType] = useState<string[]>([]);
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

  const filteredCourts = useMemo(() => {
    let result = [...initialCourts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(court =>
        court.name.toLowerCase().includes(query) ||
        court.address.toLowerCase().includes(query) ||
        court.features.some(feature => feature.toLowerCase().includes(query)) ||
        court.courtType.toLowerCase().includes(query) ||
        court.courtSize.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(court => court.category === selectedCategory);
    }

    // Apply court type filter
    if (selectedCourtType.length > 0) {
      result = result.filter(court =>
        selectedCourtType.some(type => 
          court.courtType.toLowerCase().includes(type)
        )
      );
    }

    // Apply amenities filter
    if (selectedAmenities.length > 0) {
      result = result.filter(court =>
        selectedAmenities.every(amenity => {
          if (amenity === "Flood Lights") return court.floodLights;
          if (amenity === "Professional Coach") return court.professionalCoach;
          if (amenity === "Scoreboard") return court.scoreboard;
          if (amenity === "Ball Machine") return court.ballMachine;
          if (amenity === "Practice Walls") return court.practiceWalls > 0;
          if (amenity === "Equipment Rental") return court.equipmentRental;
          if (amenity === "Parking") return court.parking;
          if (amenity === "Stringing Service") return court.stringingService;
          if (amenity === "Wind Screens") return court.windScreens;
          if (amenity === "Spectator Seating") return court.spectatorSeating > 0;
          if (amenity === "Pro Shop") return court.proShop;
          return court.features.includes(amenity);
        })
      );
    }

    // Apply price range filter
    if (selectedPriceRange !== "any") {
      result = result.filter(court => {
        const price = parseInt(court.price.replace("$", ""));
        switch (selectedPriceRange) {
          case "under40":
            return price < 40;
          case "40-80":
            return price >= 40 && price <= 80;
          case "80plus":
            return price > 80;
          default:
            return true;
        }
      });
    }

    // Apply availability filter
    if (selectedAvailability !== "any") {
      result = result.filter(court => {
        if (selectedAvailability === "instant") {
          return court.instantBook;
        }
        if (selectedAvailability === "night") {
          return court.floodLights;
        }
        const time = court.availability.toLowerCase();
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
      case "court_quality":
        const qualityOrder = { "Grand Slam": 3, "Standard": 2, "Mini": 1, "Practice": 0 };
        result.sort((a, b) => qualityOrder[b.courtSize] - qualityOrder[a.courtSize]);
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
    selectedCourtType, 
    selectedPriceRange, 
    selectedAvailability, 
    sortBy
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAmenities([]);
    setSelectedCourtType([]);
    setSelectedPriceRange("any");
    setSelectedAvailability("any");
    setSortBy("recommended");
  };

  const activeFilterCount = [
    searchQuery,
    selectedCategory !== "all",
    selectedAmenities.length > 0,
    selectedCourtType.length > 0,
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
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Tennis Courts</h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Book professional tennis courts & facilities
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
                  placeholder="Search tennis courts, surface types, or locations..."
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
                  selectedCourtType={selectedCourtType}
                  setSelectedCourtType={setSelectedCourtType}
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
                  selectedCourtType={selectedCourtType}
                  setSelectedCourtType={setSelectedCourtType}
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
                        {filteredCourts.length} {filteredCourts.length === 1 ? 'Tennis Court' : 'Tennis Courts'} Available
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
                        {selectedCourtType.length > 0 && (
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2">
                            <Tennis className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#097E52]" />
                            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
                              {selectedCourtType.length} surface type{selectedCourtType.length > 1 ? 's' : ''}
                            </span>
                            <button
                              onClick={() => setSelectedCourtType([])}
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
            {filteredCourts.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
                  <Tennis className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">No tennis courts found</h3>
                <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4 text-sm sm:text-base">
                  Try adjusting your search criteria or explore different court surfaces
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
                    View Premium Courts
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
                  {filteredCourts.map((court) => (
                    <CourtCard
                      key={court.id}
                      court={court}
                      isFavorite={favorites.includes(court.id)}
                      onToggleFavorite={toggleFavorite}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {filteredCourts.length > 6 && (
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

export default TennisCourtsPage;