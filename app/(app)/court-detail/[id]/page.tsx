"use client";

import { 
  Star, 
  MapPin, 
  Calendar, 
  Heart, 
  Shield, 
  ChevronRight, 
  ChevronLeft,
  Clock,
  Zap,
  Check,
  ArrowLeft,
  Maximize2,
  X,
  Users,
  CheckCircle,
  TrendingUp,
  Flame,
  Navigation,
  Car,
  Coffee,
  Dumbbell,
  Wifi,
  Lock,
  Building,
  Sparkles,
  ThumbsUp,
  Eye,
  Target,
  BookOpen,
  Headphones,
  BadgeCheck,
  AlertCircle,
  Tag,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Wind,
  Waves,
  Sun,
  Cloud,
  Crown,
  Trophy,
  CalendarDays,
  Phone,
  MessageCircle,
  Share2,
  HelpCircle,
  Award,
  Battery,
  Thermometer,
  Sprout,
  UserCheck,
  Video,
  Music,
  ShoppingBag
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Types
interface Host {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  verified: boolean;
  joinedDate: string;
  responseRate: number;
  responseTime: string;
  rating: number;
  bio: string;
  expertise: string[];
  languages: string[];
}

interface Amenity {
  name: string;
  icon: any;
  description: string;
  available: boolean;
}

interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface AvailabilitySlot {
  date: string;
  day: string;
  slots: {
    time: string;
    available: boolean;
    peak?: boolean;
  }[];
}

interface VenueDetail {
  id: number;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  price: string;
  duration: string;
  rating: number;
  reviews: number;
  address: string;
  fullAddress: string;
  distance: string;
  travelTime: string;
  host: Host;
  features: string[];
  amenities: Amenity[];
  specifications: {
    courtType: string;
    courtSurface: string;
    courtSize: string;
    lighting: string;
    capacity: number;
    totalCourts: number;
  };
  rules: {
    title: string;
    description: string;
    icon: any;
  }[];
  safetyFeatures: {
    title: string;
    description: string;
    icon: any;
  }[];
  popular?: boolean;
  trending?: boolean;
  new?: boolean;
  category: string;
  instantBook?: boolean;
  images: string[];
  totalCourts: number;
  operatingHours: {
    weekdays: string;
    weekends: string;
    holidays: string;
  };
  bookingPolicy: {
    minBooking: string;
    maxBooking: string;
    cancellation: string;
    paymentMethods: string[];
  };
  availabilitySlots: AvailabilitySlot[];
  reviewsList: Review[];
  stats: {
    bookingsThisWeek: number;
    satisfactionRate: number;
    peakHours: string;
  };
}

// Mock data for Pakistan
const venueDetails: VenueDetail[] = [
  {
    id: 1,
    name: "Lahore Sports Complex",
    tagline: "Premium Badminton Courts in Central Lahore",
    description: "Modern sports facility with professionally maintained badminton courts, perfect for tournaments, training, and recreational play. Our courts feature excellent lighting, quality surfaces, and all essential amenities for an optimal playing experience. Located in the heart of Lahore with easy access from all major areas.",
    highlights: [
      "Professional Grade Courts",
      "Premium LED Lighting System",
      "Modern Changing Rooms",
      "Secure Parking Facility",
      "Equipment Rental Available",
      "Professional Coaching"
    ],
    price: "₨ 1,500",
    duration: "per court/hour",
    rating: 4.8,
    reviews: 156,
    address: "Sports Complex Road, Gulberg",
    fullAddress: "Sports Complex Road, Gulberg, Lahore, Punjab 54000",
    distance: "3.2 km",
    travelTime: "15 mins drive",
    host: {
      id: "host1",
      name: "Sports Management Pakistan",
      avatar: "SMP",
      avatarColor: "from-[#097E52] to-[#23B33A]",
      verified: true,
      joinedDate: "2022",
      responseRate: 95,
      responseTime: "Within 30 mins",
      rating: 4.9,
      bio: "Professional sports facility management with focus on quality court maintenance and customer satisfaction. Over 7 years of experience in sports facility management across Pakistan.",
      expertise: ["Court Maintenance", "Sports Events", "Facility Management", "Player Training"],
      languages: ["Urdu", "English", "Punjabi"]
    },
    features: [
      "Professional-grade courts",
      "Evening lighting available",
      "Changing facilities",
      "Drinking water access",
      "Spectator seating",
      "Wi-Fi access",
      "Equipment rentals",
      "Parking facility"
    ],
    amenities: [
      { name: "Court Lighting", icon: Sun, description: "Premium LED lighting for evening games", available: true },
      { name: "Parking Space", icon: Car, description: "Secure parking for 40+ vehicles", available: true },
      { name: "Changing Rooms", icon: Waves, description: "Clean changing facilities with showers", available: true },
      { name: "Drinking Water", icon: Coffee, description: "Filtered water available", available: true },
      { name: "Equipment Rentals", icon: Dumbbell, description: "Quality rackets & shuttles", available: true },
      { name: "Wi-Fi Access", icon: Wifi, description: "Free high-speed internet", available: true },
      { name: "First Aid Kit", icon: Shield, description: "Emergency medical supplies", available: true },
      { name: "Seating Area", icon: Users, description: "Comfortable spectator seating", available: true },
      { name: "AC Facility", icon: Wind, description: "Air conditioned lounge area", available: true },
      { name: "Lockers", icon: Lock, description: "Secure storage lockers", available: true },
      { name: "Pro Shop", icon: ShoppingBag, description: "Sports equipment store", available: true },
      { name: "Cafeteria", icon: Coffee, description: "Food and beverage service", available: true }
    ],
    specifications: {
      courtType: "Professional Badminton",
      courtSurface: "PVC Professional Mat",
      courtSize: "13.4m × 6.1m (Standard)",
      lighting: "LED 400 lux",
      capacity: 4,
      totalCourts: 8
    },
    rules: [
      { title: "Court Shoes", description: "Non-marking sports shoes mandatory", icon: CheckCircle },
      { title: "Booking Time", description: "Please arrive 10 minutes before your slot", icon: Clock },
      { title: "Court Usage", description: "No food or colored drinks on court", icon: Coffee },
      { title: "Equipment Care", description: "Handle all equipment with care", icon: Dumbbell },
      { title: "Safety First", description: "Follow all safety guidelines", icon: Shield }
    ],
    safetyFeatures: [
      { title: "24/7 CCTV", description: "Security cameras throughout facility", icon: Eye },
      { title: "First Aid", description: "Trained staff & medical supplies", icon: Shield },
      { title: "Clean Facilities", description: "Regular sanitization", icon: CheckCircle },
      { title: "Emergency Exits", description: "Clearly marked emergency routes", icon: Navigation }
    ],
    popular: true,
    trending: true,
    new: false,
    category: "premium",
    instantBook: true,
    images: [
      "/api/placeholder/1200/800",
      "/api/placeholder/1200/800",
      "/api/placeholder/1200/800",
      "/api/placeholder/1200/800"
    ],
    totalCourts: 8,
    operatingHours: {
      weekdays: "6:00 AM - 11:00 PM",
      weekends: "7:00 AM - 10:00 PM",
      holidays: "8:00 AM - 8:00 PM"
    },
    bookingPolicy: {
      minBooking: "1 hour",
      maxBooking: "3 hours",
      cancellation: "Free cancellation 24h before",
      paymentMethods: ["JazzCash", "EasyPaisa", "Credit Card", "Debit Card", "Bank Transfer"]
    },
    availabilitySlots: [
      {
        date: "Today",
        day: "Mon",
        slots: [
          { time: "7:00 AM", available: true },
          { time: "8:00 AM", available: true },
          { time: "9:00 AM", available: false },
          { time: "4:00 PM", available: true },
          { time: "5:00 PM", available: true, peak: true },
          { time: "6:00 PM", available: false },
          { time: "7:00 PM", available: true, peak: true },
          { time: "8:00 PM", available: true }
        ]
      },
      {
        date: "Tomorrow",
        day: "Tue",
        slots: [
          { time: "7:00 AM", available: true },
          { time: "8:00 AM", available: true },
          { time: "9:00 AM", available: true },
          { time: "4:00 PM", available: true },
          { time: "5:00 PM", available: true },
          { time: "6:00 PM", available: true },
          { time: "7:00 PM", available: true },
          { time: "8:00 PM", available: true }
        ]
      },
      {
        date: "Wednesday",
        day: "Wed",
        slots: [
          { time: "7:00 AM", available: true },
          { time: "8:00 AM", available: true },
          { time: "9:00 AM", available: false },
          { time: "4:00 PM", available: true },
          { time: "5:00 PM", available: true },
          { time: "6:00 PM", available: true },
          { time: "7:00 PM", available: true },
          { time: "8:00 PM", available: false }
        ]
      }
    ],
    reviewsList: [
      {
        id: "1",
        user: "Ahmed Khan",
        avatar: "AK",
        rating: 5.0,
        date: "2 days ago",
        comment: "Excellent facility! The courts are well-maintained and the lighting is perfect for evening games. Booking process was smooth and professional. Will definitely recommend to friends.",
        helpful: 24
      },
      {
        id: "2",
        user: "Fatima Ali",
        avatar: "FA",
        rating: 4.5,
        date: "1 week ago",
        comment: "Great value for money. Clean changing rooms and good quality courts. The staff is very cooperative and helpful. Will definitely book again!",
        helpful: 18
      },
      {
        id: "3",
        user: "Bilal Ahmed",
        avatar: "BA",
        rating: 4.0,
        date: "2 weeks ago",
        comment: "Good facility with all basic amenities. Parking is convenient and the staff is helpful. The courts are well-maintained and the lighting is adequate.",
        helpful: 9
      },
      {
        id: "4",
        user: "Sara Khan",
        avatar: "SK",
        rating: 4.8,
        date: "3 weeks ago",
        comment: "Professional setup with excellent facilities. The equipment rental service is very convenient. Perfect for weekend matches with friends.",
        helpful: 15
      }
    ],
    stats: {
      bookingsThisWeek: 72,
      satisfactionRate: 96,
      peakHours: "5 PM - 9 PM"
    }
  },
];

// Helper component for responsive layout
const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-[1800px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12">
    {children}
  </div>
);

const CourtDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Resolve async params
  useEffect(() => {
    params.then(resolved => {
      setResolvedParams(resolved);
    });
  }, [params]);

  // Load venue data
  useEffect(() => {
    if (resolvedParams) {
      const foundVenue = venueDetails.find(v => v.id === parseInt(resolvedParams.id));
      setVenue(foundVenue || null);
    }
  }, [resolvedParams]);

  // Auto-select first available date if not selected
  useEffect(() => {
    if (venue && !selectedDate) {
      setSelectedDate(venue.availabilitySlots[0]?.date || "Today");
    }
  }, [venue, selectedDate]);

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 xs:w-16 h-12 xs:h-16 mx-auto mb-3 xs:mb-4 rounded-full bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 flex items-center justify-center animate-pulse">
            <Trophy className="h-5 xs:h-6 sm:h-8 w-5 xs:w-6 sm:w-8 text-[#097E52]" />
          </div>
          <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-1 xs:mb-2">Loading Court Details...</h2>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 xs:w-16 h-12 xs:h-16 mx-auto mb-3 xs:mb-4 rounded-full bg-gradient-to-r from-[#097E52]/10 to-[#23B33A]/10 flex items-center justify-center">
            <AlertCircle className="h-5 xs:h-6 sm:h-8 w-5 xs:w-6 sm:w-8 text-[#097E52]" />
          </div>
          <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-1 xs:mb-2">Court Not Available</h2>
          <button
            onClick={() => router.push('/courts')}
            className="mt-3 xs:mt-4 px-4 xs:px-6 py-2 xs:py-2.5 rounded-lg font-medium bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white hover:opacity-90 transition-opacity shadow-sm hover:shadow-md text-sm xs:text-base"
          >
            Browse Available Courts
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!selectedTime) {
      alert("Please select a time slot to continue");
      return;
    }
    router.push(`/booking/${venue.id}?date=${selectedDate}&time=${selectedTime}`);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // Scroll to booking card on mobile when time is selected
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('booking-card')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: venue.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 xs:bottom-6 right-4 xs:right-6 z-40 flex flex-col gap-2 xs:gap-3 lg:hidden">
        <button
          onClick={handleShare}
          className="h-10 xs:h-12 w-10 xs:w-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border border-gray-200"
        >
          <Share2 className="h-4 xs:h-5 w-4 xs:w-5 text-gray-700" />
        </button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="h-10 xs:h-12 w-10 xs:w-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border border-gray-200"
        >
          <Heart className={`h-4 xs:h-5 w-4 xs:w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
        </button>
      </div>

      {/* Sticky Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-sm transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md border-b border-gray-200' : 'bg-transparent'}`}>
        <ResponsiveContainer>
          <div className="flex items-center justify-between py-3 xs:py-4">
            <div className="flex items-center gap-2 xs:gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1 xs:gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="h-4 xs:h-5 w-4 xs:w-5 transition-transform group-hover:-translate-x-0.5 xs:group-hover:-translate-x-1" />
                <span className="font-medium text-sm xs:text-base hidden sm:inline">Back to Courts</span>
              </button>
              
              {isScrolled && (
                <div className="hidden sm:block">
                  <h1 className="text-base xs:text-lg font-bold text-gray-900 truncate max-w-[180px] xs:max-w-xs">{venue.name}</h1>
                  <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm text-gray-600">
                    <Star className="h-3 xs:h-4 w-3 xs:w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{venue.rating}</span>
                    <span className="hidden xs:inline">•</span>
                    <span className="hidden xs:inline">{venue.reviews} reviews</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 xs:gap-3">
              <button
                onClick={handleShare}
                className="hidden sm:flex items-center gap-1 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors text-sm xs:text-base"
              >
                <Share2 className="h-3 xs:h-4 w-3 xs:w-4" />
                <span>Share</span>
              </button>
              
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="hidden sm:flex items-center gap-1 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors text-sm xs:text-base"
              >
                <Heart className={`h-3 xs:h-4 w-3 xs:w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </button>
              
              <button
                onClick={() => window.open('tel:+923001234567')}
                className="hidden sm:flex items-center gap-1 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg bg-[#097E52] hover:bg-[#097E52]/90 text-white font-medium transition-colors shadow-sm hover:shadow-md text-sm xs:text-base"
              >
                <Phone className="h-3 xs:h-4 w-3 xs:w-4" />
                <span>Call</span>
              </button>
            </div>
          </div>
        </ResponsiveContainer>
      </header>

      <main className="pb-16 xs:pb-20">
        <ResponsiveContainer>
          <div className="grid lg:grid-cols-3 gap-4 xs:gap-6 lg:gap-8 xl:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2" ref={mainContentRef}>
              {/* Hero Section */}
              <div className="mb-6 xs:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 xs:gap-4 mb-4 xs:mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 xs:gap-3 mb-2 xs:mb-3">
                      <div className="flex items-center gap-1 xs:gap-1.5 flex-wrap">
                        {venue.popular && (
                          <div className="px-2 xs:px-3 py-1 xs:py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1 xs:gap-1.5">
                            <Flame className="h-3 xs:h-3.5 w-3 xs:w-3.5" />
                            <span className="text-[10px] xs:text-xs">POPULAR</span>
                          </div>
                        )}
                        {venue.trending && (
                          <div className="px-2 xs:px-3 py-1 xs:py-1.5 bg-gradient-to-r from-[#7ABC82] to-[#097E52] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1 xs:gap-1.5">
                            <TrendingUp className="h-3 xs:h-3.5 w-3 xs:w-3.5" />
                            <span className="text-[10px] xs:text-xs">TRENDING</span>
                          </div>
                        )}
                        {venue.new && (
                          <div className="px-2 xs:px-3 py-1 xs:py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1 xs:gap-1.5">
                            <CheckCircle className="h-3 xs:h-3.5 w-3 xs:w-3.5" />
                            <span className="text-[10px] xs:text-xs">NEW</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="hidden sm:flex items-center gap-1 xs:gap-2 px-2 xs:px-3 py-1 xs:py-1.5 bg-[#097E52]/10 text-[#097E52] text-xs font-semibold rounded-full">
                        <Sparkles className="h-3 xs:h-3.5 w-3 xs:w-3.5" />
                        <span className="text-[10px] xs:text-xs">PREMIUM COURT</span>
                      </div>
                    </div>
                    
                    <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 xs:mb-3">{venue.name}</h1>
                    
                    <p className="text-base xs:text-lg text-gray-600 mb-3 xs:mb-4">{venue.tagline}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 xs:gap-4 sm:gap-6">
                      <div className="flex items-center gap-1 xs:gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 xs:h-5 w-4 xs:w-5 ${
                                i < Math.floor(venue.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-gray-900 text-base xs:text-lg">{venue.rating}</span>
                        <span className="text-gray-600 text-sm xs:text-base">({venue.reviews} reviews)</span>
                      </div>
                      
                      <div className="hidden xs:flex items-center gap-1 xs:gap-2 text-gray-600 text-sm xs:text-base">
                        <MapPin className="h-4 xs:h-5 w-4 xs:w-5" />
                        <span>{venue.distance} • {venue.travelTime}</span>
                      </div>
                      
                      <div className="hidden sm:flex items-center gap-1 xs:gap-2 text-gray-600 text-sm xs:text-base">
                        <Building className="h-4 xs:h-5 w-4 xs:w-5" />
                        <span>{venue.totalCourts} courts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="mb-6 xs:mb-8">
                <div className="relative rounded-xl xs:rounded-2xl overflow-hidden bg-gradient-to-br from-[#097E52]/10 to-[#23B33A]/10 aspect-[16/9] mb-3 xs:mb-4 group">
                  {/* Main Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Building className="h-12 xs:h-16 sm:h-20 w-12 xs:w-16 sm:w-20 text-[#097E52]/30 mx-auto mb-2 xs:mb-3 sm:mb-4" />
                      <p className="text-gray-500 text-xs xs:text-sm sm:text-base">Court Image Gallery</p>
                    </div>
                  </div>
                  
                  {/* Navigation Buttons */}
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + venue.images.length) % venue.images.length)}
                    className="absolute left-2 xs:left-4 top-1/2 transform -translate-y-1/2 h-8 xs:h-10 w-8 xs:w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:scale-105"
                  >
                    <ChevronLeft className="h-3 xs:h-4 sm:h-5 w-3 xs:w-4 sm:w-5 text-gray-700" />
                  </button>
                  
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % venue.images.length)}
                    className="absolute right-2 xs:right-4 top-1/2 transform -translate-y-1/2 h-8 xs:h-10 w-8 xs:w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:scale-105"
                  >
                    <ChevronRight className="h-3 xs:h-4 sm:h-5 w-3 xs:w-4 sm:w-5 text-gray-700" />
                  </button>

                  {/* Expand Button */}
                  <button
                    onClick={() => setShowLightbox(true)}
                    className="absolute top-2 xs:top-4 right-2 xs:right-4 h-8 xs:h-10 w-8 xs:w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:scale-105"
                  >
                    <Maximize2 className="h-3 xs:h-4 sm:h-5 w-3 xs:w-4 sm:w-5 text-gray-700" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-2 xs:bottom-4 left-1/2 transform -translate-x-1/2 px-2 xs:px-3 py-1 xs:py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
                    <span className="text-white text-xs xs:text-sm font-medium">
                      {selectedImage + 1} / {venue.images.length}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-1 xs:gap-2 overflow-x-auto pb-1 xs:pb-2">
                  {venue.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 xs:w-20 h-12 xs:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === idx
                          ? 'border-[#097E52] scale-105'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-[#097E52]/20 to-[#23B33A]/20" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="sticky top-14 xs:top-16 z-30 bg-white border-b border-gray-200 mb-4 xs:mb-6 lg:top-24">
                <nav className="flex overflow-x-auto">
                  {[
                    { id: "overview", label: "Overview", icon: BookOpen },
                    { id: "availability", label: "Availability", icon: Calendar },
                    { id: "amenities", label: "Amenities", icon: CheckCircle },
                    { id: "reviews", label: "Reviews", icon: Star },
                    { id: "rules", label: "Rules", icon: Shield }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        px-3 xs:px-4 sm:px-6 py-3 xs:py-4 text-xs xs:text-sm font-medium whitespace-nowrap flex items-center gap-1 xs:gap-2 border-b-2 transition-all duration-200
                        ${activeTab === tab.id
                          ? 'border-[#097E52] text-[#097E52] bg-[#097E52]/5'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <tab.icon className="h-3 xs:h-4 w-3 xs:w-4" />
                      {tab.label}
                      {tab.id === "reviews" && (
                        <span className="ml-1 px-1.5 xs:px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {venue.reviews}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mb-6 xs:mb-8">
                {activeTab === "overview" && (
                  <div className="space-y-6 xs:space-y-8">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-3 xs:mb-4">About This Facility</h3>
                      <div className={`text-gray-700 leading-relaxed text-sm xs:text-base ${showFullDescription ? '' : 'line-clamp-4'}`}>
                        {venue.description}
                      </div>
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-3 xs:mt-4 text-[#097E52] font-medium hover:text-[#097E52]/80 flex items-center gap-1 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-[#097E52]/5 transition-colors text-sm xs:text-base"
                      >
                        {showFullDescription ? 'Show Less' : 'Read More'}
                        {showFullDescription ? <ChevronUp className="h-3 xs:h-4 w-3 xs:w-4" /> : <ChevronDown className="h-3 xs:h-4 w-3 xs:w-4" />}
                      </button>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Key Features</h3>
                      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4">
                        {venue.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 xs:gap-3 p-3 xs:p-4 bg-white border border-gray-200 rounded-xl hover:border-[#097E52]/30 transition-all duration-200 hover:shadow-sm">
                            <div className="h-8 xs:h-10 sm:h-12 w-8 xs:w-10 sm:w-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-[#097E52]/10 to-[#23B33A]/10 flex items-center justify-center flex-shrink-0">
                              <Check className="h-4 xs:h-5 sm:h-6 w-4 xs:w-5 sm:w-6 text-[#097E52]" />
                            </div>
                            <span className="font-semibold text-gray-900 text-xs xs:text-sm sm:text-base">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-gradient-to-r from-[#097E52]/5 to-[#23B33A]/5 rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8">
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Court Statistics</h3>
                      <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                        <div className="text-center p-3 xs:p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{venue.stats.bookingsThisWeek}</div>
                          <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">Weekly Bookings</div>
                        </div>
                        <div className="text-center p-3 xs:p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{venue.stats.satisfactionRate}%</div>
                          <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">Satisfaction Rate</div>
                        </div>
                        <div className="text-center p-3 xs:p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{venue.totalCourts}</div>
                          <div className="text-xs xs:text-sm text-gray-600 mt-1 xs:mt-2">Total Courts</div>
                        </div>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div>
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Court Specifications</h3>
                      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-3 xs:gap-4">
                        {Object.entries(venue.specifications).map(([key, value], idx) => (
                          <div key={idx} className="p-3 xs:p-4 bg-white border border-gray-200 rounded-xl hover:border-[#097E52]/30 transition-colors">
                            <div className="text-xs xs:text-sm text-gray-600 mb-1 xs:mb-2">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </div>
                            <div className="font-semibold text-gray-900 text-sm xs:text-base">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "amenities" && (
                  <div>
                    <div className="mb-6 xs:mb-8">
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-1 xs:mb-2">Amenities & Facilities</h3>
                      <p className="text-gray-600 text-sm xs:text-base">All the facilities you need for a great playing experience</p>
                    </div>
                    
                    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4">
                      {venue.amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className={`p-3 xs:p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                            amenity.available
                              ? 'bg-white border-gray-200 hover:border-[#097E52]'
                              : 'bg-gray-50 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className="h-8 xs:h-10 sm:h-12 w-8 xs:w-10 sm:w-12 rounded-lg bg-gradient-to-br from-[#097E52]/10 to-[#23B33A]/10 flex items-center justify-center mb-2 xs:mb-3">
                            <amenity.icon className="h-4 xs:h-5 sm:h-6 w-4 xs:w-5 sm:w-6 text-[#097E52]" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-xs xs:text-sm mb-1">{amenity.name}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{amenity.description}</p>
                          {!amenity.available && (
                            <div className="text-xs text-gray-500 mt-1 xs:mt-2">Coming Soon</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 xs:mb-8">
                      <div>
                        <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-1 xs:mb-2">Customer Reviews</h3>
                        <p className="text-gray-600 text-sm xs:text-base">What players are saying about this court</p>
                      </div>
                      <div className="flex items-center gap-3 xs:gap-4 mt-3 xs:mt-4 sm:mt-0">
                        <div className="px-4 xs:px-6 py-2 xs:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-sm">
                          <div className="flex items-baseline gap-1 xs:gap-2">
                            <span className="font-bold text-2xl xs:text-3xl">{venue.rating}</span>
                            <span className="text-base xs:text-lg">/5</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 xs:h-4 w-3 xs:w-4 ${
                                  i < Math.floor(venue.rating)
                                    ? "fill-white"
                                    : "text-white/40"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6">
                      {venue.reviewsList.map((review) => (
                        <div key={review.id} className="p-4 xs:p-6 bg-white border border-gray-200 rounded-xl xs:rounded-2xl hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start justify-between mb-4 xs:mb-5">
                            <div className="flex items-center gap-2 xs:gap-3">
                              <div className="h-10 xs:h-12 w-10 xs:w-12 rounded-full bg-gradient-to-r from-[#097E52] to-[#23B33A] flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-sm xs:text-base">{review.avatar}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm xs:text-base">{review.user}</h4>
                                <div className="flex items-center gap-2 xs:gap-3 mt-0.5 xs:mt-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 xs:h-4 w-3 xs:w-4 ${
                                          i < Math.floor(review.rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs xs:text-sm text-gray-500">{review.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-sm xs:text-base mb-3 xs:mb-4 line-clamp-4">{review.comment}</p>
                          
                          <div className="flex items-center justify-between pt-3 xs:pt-4 border-t border-gray-100">
                            <button className="flex items-center gap-1 xs:gap-2 text-gray-500 hover:text-gray-700 text-xs xs:text-sm font-medium px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                              <ThumbsUp className="h-3 xs:h-4 w-3 xs:w-4" />
                              <span>Helpful ({review.helpful})</span>
                            </button>
                            
                            <button className="text-gray-500 hover:text-gray-700 text-xs xs:text-sm font-medium px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "rules" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8">
                    <div>
                      <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6">
                        <Shield className="h-5 xs:h-6 w-5 xs:w-6 text-[#097E52]" />
                        <h4 className="text-lg xs:text-xl font-bold text-gray-900">Court Rules & Guidelines</h4>
                      </div>
                      <div className="space-y-3 xs:space-y-4">
                        {venue.rules.map((rule, idx) => (
                          <div key={idx} className="flex items-start gap-2 xs:gap-3 p-3 xs:p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                            <div className="h-8 xs:h-10 w-8 xs:w-10 rounded-lg bg-gradient-to-br from-[#097E52]/10 to-[#23B33A]/10 flex items-center justify-center flex-shrink-0">
                              <rule.icon className="h-4 xs:h-5 w-4 xs:w-5 text-[#097E52]" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 text-sm xs:text-base mb-0.5 xs:mb-1">{rule.title}</h5>
                              <p className="text-gray-600 text-xs xs:text-sm">{rule.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6">
                        <CheckCircle className="h-5 xs:h-6 w-5 xs:w-6 text-green-600" />
                        <h4 className="text-lg xs:text-xl font-bold text-gray-900">Safety & Cleanliness</h4>
                      </div>
                      <div className="space-y-3 xs:space-y-4">
                        {venue.safetyFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 xs:gap-3 p-3 xs:p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                            <div className="h-8 xs:h-10 w-8 xs:w-10 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center flex-shrink-0">
                              <feature.icon className="h-4 xs:h-5 w-4 xs:w-5 text-green-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 text-sm xs:text-base mb-0.5 xs:mb-1">{feature.title}</h5>
                              <p className="text-gray-600 text-xs xs:text-sm">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Operating Hours */}
                      <div className="mt-6 xs:mt-8 p-4 xs:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                          <Clock className="h-4 xs:h-5 w-4 xs:w-5 text-blue-600" />
                          <h5 className="font-semibold text-gray-900 text-sm xs:text-base">Operating Hours</h5>
                        </div>
                        <div className="space-y-2 xs:space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-xs xs:text-sm">Weekdays</span>
                            <span className="font-medium text-gray-900 text-xs xs:text-sm">{venue.operatingHours.weekdays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-xs xs:text-sm">Weekends</span>
                            <span className="font-medium text-gray-900 text-xs xs:text-sm">{venue.operatingHours.weekends}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-xs xs:text-sm">Holidays</span>
                            <span className="font-medium text-gray-900 text-xs xs:text-sm">{venue.operatingHours.holidays}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Card with Availability */}
            <div className="lg:col-span-1">
              <div id="booking-card" className="sticky top-20 xs:top-24 space-y-4 xs:space-y-6">
                {/* Booking Summary Card */}
                <div className="bg-white rounded-xl xs:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  {/* Price Header */}
                  <div className="p-4 xs:p-6 bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-24 xs:w-32 h-24 xs:h-32 bg-white/10 rounded-full -translate-y-12 xs:-translate-y-16 translate-x-12 xs:translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-16 xs:w-24 h-16 xs:h-24 bg-white/10 rounded-full translate-y-6 xs:translate-y-12 -translate-x-6 xs:-translate-x-12"></div>
                    
                    <div className="relative z-10">
                      {/* Single Price Display */}
                      <div className="flex items-baseline gap-1 xs:gap-2 mb-0.5 xs:mb-1">
                        <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{venue.price}</span>
                        <span className="text-sm xs:text-base lg:text-xl text-white">{venue.duration}</span>
                      </div>
                      
                      {/* Rating Display */}
                      <div className="flex items-center gap-2 xs:gap-3 mt-2 xs:mt-3">
                        <div className="flex items-center gap-1 xs:gap-2 bg-white/20 px-2 xs:px-3 py-1 xs:py-1.5 rounded-full">
                          <Star className="h-3 xs:h-4 w-3 xs:w-4 fill-white" />
                          <span className="font-bold text-xs xs:text-sm">{venue.rating}</span>
                          <span className="opacity-90 text-xs xs:text-sm">({venue.reviews} reviews)</span>
                        </div>
                        
                        {venue.instantBook && (
                          <div className="flex items-center gap-1 xs:gap-2 bg-white/20 px-2 xs:px-3 py-1 xs:py-1.5 rounded-full">
                            <Zap className="h-3 xs:h-4 w-3 xs:w-4" />
                            <span className="text-xs xs:text-sm font-medium">Instant Book</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Availability Section */}
                  <div className="p-4 xs:p-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 xs:mb-4 text-base xs:text-lg flex items-center gap-2">
                      <Calendar className="h-4 xs:h-5 w-4 xs:w-5 text-[#097E52]" />
                      Available Time Slots
                    </h4>
                    
                    {/* Date Selection */}
                    <div className="mb-4 xs:mb-6">
                      <div className="flex items-center justify-between mb-2 xs:mb-3">
                        <h5 className="font-semibold text-gray-900 text-sm xs:text-base">Select Date</h5>
                        <span className="text-xs xs:text-sm text-gray-500">{venue.bookingPolicy.minBooking} minimum</span>
                      </div>
                      <div className="flex gap-2 xs:gap-3 overflow-x-auto pb-2 xs:pb-3">
                        {venue.availabilitySlots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDate(slot.date);
                              setSelectedTime("");
                            }}
                            className={`flex-shrink-0 px-3 xs:px-4 py-2 xs:py-3 rounded-lg xs:rounded-xl text-xs xs:text-sm font-medium transition-all duration-200 flex flex-col items-center min-w-[70px] xs:min-w-[80px] sm:min-w-[100px] ${
                              selectedDate === slot.date
                                ? 'bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#097E52] hover:shadow-sm'
                            }`}
                          >
                            <span className="font-bold text-base xs:text-lg">{slot.day}</span>
                            <span className="text-xs">{slot.date}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <div className="flex items-center justify-between mb-2 xs:mb-3">
                          <h5 className="font-semibold text-gray-900 text-sm xs:text-base">Available Slots</h5>
                          <div className="flex items-center gap-1 xs:gap-2">
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-xs text-gray-500">Available</span>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span className="text-xs text-gray-500">Peak</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-3 gap-2 xs:gap-3 mb-4 xs:mb-6">
                          {venue.availabilitySlots
                            .find(s => s.date === selectedDate)
                            ?.slots.map((slot, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleTimeSelect(slot.time)}
                                className={`p-2 xs:p-3 rounded-lg xs:rounded-xl text-center transition-all duration-200 relative group ${
                                  selectedTime === slot.time
                                    ? 'bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white shadow-lg transform scale-105'
                                    : slot.available
                                    ? 'bg-white border border-gray-200 hover:border-[#097E52] hover:shadow-md hover:scale-[1.02]'
                                    : 'bg-gray-50 border border-gray-200 opacity-50 cursor-not-allowed'
                                }`}
                                disabled={!slot.available}
                              >
                                <div className="font-bold text-sm xs:text-base">{slot.time}</div>
                                {slot.peak && (
                                  <div className="absolute -top-1 -right-1 xs:-top-2 xs:-right-2 h-4 xs:h-6 w-4 xs:w-6 rounded-full bg-amber-500 flex items-center justify-center shadow-sm">
                                    <Flame className="h-2 xs:h-3 w-2 xs:w-3 text-white" />
                                  </div>
                                )}
                                <div className={`text-xs mt-1 xs:mt-2 px-1 xs:px-2 py-0.5 xs:py-1 rounded-full ${
                                  slot.available
                                    ? slot.peak
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-green-100 text-green-700'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {slot.available ? (slot.peak ? 'Peak' : 'Available') : 'Booked'}
                                </div>
                              </button>
                            ))}
                        </div>

                        {/* Selected Time Summary */}
                        {selectedTime && (
                          <div className="p-3 xs:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 mb-3 xs:mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="font-bold text-gray-900 text-sm xs:text-base">Selected Slot</h6>
                              <div className="px-2 xs:px-3 py-0.5 xs:py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                                Selected
                              </div>
                            </div>
                            
                            <div className="space-y-1 xs:space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-xs xs:text-sm">Date</span>
                                <span className="font-semibold text-gray-900 text-xs xs:text-sm">{selectedDate}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-xs xs:text-sm">Time</span>
                                <span className="font-semibold text-gray-900 text-xs xs:text-sm">{selectedTime}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-xs xs:text-sm">Duration</span>
                                <span className="font-semibold text-gray-900 text-xs xs:text-sm">{venue.bookingPolicy.minBooking} min</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => {
                                setSelectedTime("");
                              }}
                              className="w-full mt-2 xs:mt-3 py-1.5 xs:py-2 text-xs xs:text-sm text-gray-600 hover:text-gray-900 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                            >
                              Change Selection
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Peak Hours Info */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 xs:p-4">
                      <div className="flex items-start gap-2 xs:gap-3">
                        <AlertCircle className="h-4 xs:h-5 w-4 xs:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm xs:text-base mb-0.5 xs:mb-1">Peak Hours Information</p>
                          <p className="text-gray-600 text-xs xs:text-sm">
                            Peak hours ({venue.stats.peakHours}) may have higher demand. We recommend booking in advance for these slots.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Policies */}
                  <div className="p-4 xs:p-6 border-b border-gray-200">
                    <div className="space-y-3 xs:space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-3 xs:h-4 w-3 xs:w-4" />
                          <span className="text-xs xs:text-sm">Maximum Duration</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-xs xs:text-sm">{venue.bookingPolicy.maxBooking}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Shield className="h-3 xs:h-4 w-3 xs:w-4" />
                          <span className="text-xs xs:text-sm">Cancellation Policy</span>
                        </div>
                        <span className="font-semibold text-green-600 text-xs xs:text-sm text-right max-w-[120px] xs:max-w-[150px]">{venue.bookingPolicy.cancellation}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-3 xs:h-4 w-3 xs:w-4" />
                          <span className="text-xs xs:text-sm">Maximum Players</span>
                        </div>
                        <span className="font-semibold text-gray-900 text-xs xs:text-sm">{venue.specifications.capacity} per court</span>
                      </div>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <div className="p-4 xs:p-6">
                    <button
                      onClick={handleBookNow}
                      disabled={!selectedTime}
                      className={`
                        w-full py-3 xs:py-4 rounded-lg xs:rounded-xl font-bold text-base xs:text-lg
                        transition-all duration-300 transform
                        flex items-center justify-center gap-2 xs:gap-3
                        relative overflow-hidden group
                        ${selectedTime
                          ? 'bg-gradient-to-r from-[#097E52] to-[#23B33A] text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      <span className="relative z-10">
                        {selectedTime ? (
                          <>
                            <span className="inline-block group-hover:translate-x-1 transition-transform">
                              Book Court Now
                            </span>
                            <ArrowUpRight className="h-4 xs:h-5 w-4 xs:w-5 inline-block ml-1 xs:ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        ) : (
                          "Select Time to Book"
                        )}
                      </span>
                      
                      {/* Button shine effect */}
                      {selectedTime && (
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      )}
                    </button>

                    {/* Payment Methods */}
                    <div className="mt-4 xs:mt-6 pt-4 xs:pt-4 border-t border-gray-200">
                      <p className="text-xs xs:text-sm text-gray-600 text-center mb-1 xs:mb-2">Accepted payment methods</p>
                      <div className="flex flex-wrap items-center justify-center gap-1 xs:gap-2">
                        {venue.bookingPolicy.paymentMethods.map((method, idx) => (
                          <div key={idx} className="px-2 xs:px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                            {method}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 xs:mb-6 text-base xs:text-lg flex items-center gap-2 xs:gap-3">
                    <div className="h-8 xs:h-10 w-8 xs:w-10 rounded-lg xs:rounded-xl bg-gradient-to-br from-[#097E52]/10 to-[#23B33A]/10 flex items-center justify-center">
                      <BadgeCheck className="h-4 xs:h-5 w-4 xs:w-5 text-[#097E52]" />
                    </div>
                    <span>Quick Info</span>
                  </h4>
                  
                  <div className="space-y-3 xs:space-y-4">
                    <div className="flex items-start gap-2 xs:gap-3 p-2 xs:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <Shield className="h-4 xs:h-5 w-4 xs:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-xs xs:text-sm">Secure Booking</p>
                        <p className="text-gray-600 text-xs mt-0.5 xs:mt-1">Your court is confirmed instantly with payment protection</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 xs:gap-3 p-2 xs:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <CheckCircle className="h-4 xs:h-5 w-4 xs:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-xs xs:text-sm">Quality Assured</p>
                        <p className="text-gray-600 text-xs mt-0.5 xs:mt-1">Courts maintained to professional standards</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 xs:gap-3 p-2 xs:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <Headphones className="h-4 xs:h-5 w-4 xs:w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-xs xs:text-sm">24/7 Support</p>
                        <p className="text-gray-600 text-xs mt-0.5 xs:mt-1">Help available for any booking issues</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </main>

      {/* Lightbox */}
      {showLightbox && venue && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-3 xs:p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-3 xs:top-4 right-3 xs:right-4 h-10 xs:h-12 w-10 xs:w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="h-5 xs:h-6 w-5 xs:w-6 text-white" />
          </button>

          <button
            onClick={() => setSelectedImage((prev) => (prev - 1 + venue.images.length) % venue.images.length)}
            className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 h-10 xs:h-12 w-10 xs:w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="h-5 xs:h-6 w-5 xs:w-6 text-white" />
          </button>

          <button
            onClick={() => setSelectedImage((prev) => (prev + 1) % venue.images.length)}
            className="absolute right-3 xs:right-4 top-1/2 transform -translate-y-1/2 h-10 xs:h-12 w-10 xs:w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="h-5 xs:h-6 w-5 xs:w-6 text-white" />
          </button>

          <div className="relative w-full max-w-6xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-[#097E52]/20 to-[#23B33A]/20 rounded-xl xs:rounded-2xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Building className="h-12 xs:h-16 sm:h-20 w-12 xs:w-16 sm:w-20 text-white/40 mx-auto mb-2 xs:mb-3 sm:mb-4" />
                  <p className="text-white/80 text-sm xs:text-base">Court Image {selectedImage + 1} of {venue.images.length}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 xs:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1 xs:gap-2">
              {venue.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-1 xs:h-2 rounded-full transition-all duration-300 ${
                    selectedImage === idx
                      ? 'w-6 xs:w-8 bg-white'
                      : 'w-1 xs:w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtDetailPage;