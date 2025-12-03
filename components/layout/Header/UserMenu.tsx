import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserMenu() {
    const { session } = useAuth();

    const capitalizeFirst = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    if (!session?.user) {
        return (
            <button className="rounded-full w-10 h-10 flex items-center justify-center border b pointer-events-none bg-foreground text-background text-xl font-semibold">
                <User className="w-5 h-5 " />
            </button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="rounded-full relative hover:cursor-pointer size-10 flex items-center justify-center border border-gray-200">

                    <AvatarImage
                        src={session.user.avatar}
                        alt={`${session.user.username} Avatar`}
                    />
                    <AvatarFallback className="bg-foreground text-background text-xl font-semibold">{session.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 shadow-2xl border py-2">

                {/* User Info */}
                <DropdownMenuLabel className="flex flex-col items-start px-4 py-2 space-y-1">
                    <span className="font-semibold truncate w-full">
                        {capitalizeFirst(session.user.username)}
                    </span>
                    <span className="text-sm text-muted block truncate w-full">
                        {session.user.email}
                    </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-2 opacity-50" />

                {/* Links */}

                <DropdownMenuItem asChild>
                    <Link href="/dashboard">My Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/bookings">My Bookings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2 opacity-50" />

                {/* Logout */}
                <DropdownMenuItem
                    onClick={async () =>
                        await signOut({ redirect: true, callbackUrl: "/signin" })
                    }
                    className="text-red-600 hover:bg-red-50"
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
