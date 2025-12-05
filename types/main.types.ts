import { Document } from "mongoose"

type DatabaseConnectionObject = {
    isConntected?: number
}

enum UserRoles {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

enum AuthProviderEnum {
    CREDENTIALS = "CREDENTIALS",
    GOOGLE = "GOOGLE"
}

interface IBooking { }
interface IPayment { }
interface IReview { }

interface IUser  {
    username: string;
    email: string;
    password: string;
    role: UserRoles;
    avatar: string;
    isVerified: boolean;
    phone: string;
    provider: AuthProviderEnum
}


export type {
    DatabaseConnectionObject,
    IUser
}

export {
    UserRoles,
    AuthProviderEnum
}

export interface Host {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
}

export interface Venue {
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

export const AMENITIES = [
  { label: "AC Courts", icon: "Wind" },
  { label: "Free Parking", icon: "Car" },
  { label: "Showers", icon: "Waves" },
  { label: "Equipment", icon: "Dumbbell" },
  { label: "Cafe", icon: "Coffee" },
  { label: "Coaching", icon: "Users" },
  { label: "Gym", icon: "Dumbbell" },
  { label: "Pro Shop", icon: "ShoppingBag" },
  { label: "Wi-Fi", icon: "Wifi" },
  { label: "Lockers", icon: "Lock" },
] as const;

export const CATEGORIES = [
  { label: "All Courts", value: "all" },
  { label: "Premium", value: "premium", count: 2 },
  { label: "Luxury", value: "luxury", count: 2 },
  { label: "Standard", value: "standard", count: 1 },
  { label: "Community", value: "community", count: 1 },
] as const;

export const PRICE_RANGES = [
  { label: "Any Price", value: "any" },
  { label: "Under $25", value: "under25" },
  { label: "$25 - $35", value: "25-35" },
  { label: "$35+", value: "35plus" },
] as const;

export const AVAILABILITY_OPTIONS = [
  { label: "Any Time", value: "any" },
  { label: "Morning (6AM - 12PM)", value: "morning" },
  { label: "Afternoon (12PM - 6PM)", value: "afternoon" },
  { label: "Evening (6PM - 12AM)", value: "evening" },
  { label: "Instant Book", value: "instant" },
] as const;

export const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended", icon: "Sparkles" },
  { label: "Rating: High to Low", value: "rating_desc", icon: "Star" },
  { label: "Price: Low to High", value: "price_asc", icon: "DollarSign" },
  { label: "Price: High to Low", value: "price_desc", icon: "DollarSign" },
  { label: "Distance: Nearest", value: "distance_asc", icon: "Navigation" },
] as const;

