import { NavLink } from "@/types/navlinks.types";

const brandName = "SportsHub"


const navLinks:NavLink[] = [
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


export {
        brandName,
        navLinks
}