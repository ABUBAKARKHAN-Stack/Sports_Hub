import { NavLink } from "@/types/navlinks.types";

const brandName = "SportsHub"


const navLinks: NavLink[] = [
        { label: "Home", href: "/" },
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
                ],
        },
        { label: "Pages", href: "/pages" },
        { label: "Blogs", href: "/blogs" },
        { label: "Contact", href: "/contact" },
] as const;

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




export {
        brandName,
        navLinks
}