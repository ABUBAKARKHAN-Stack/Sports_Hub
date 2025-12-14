"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoles } from "@/types/main.types";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";

export default function UserMenu() {
  const { user, signOut, isLoading, isError } = useAuth();
  const { getDashboardLink, getProfileLink, getRoleIcon } = useRoleNavigation(user?.role);



  if (!user || isLoading) return <Skeleton className="size-10 rounded-full" />
  if (isError) return (
    <div className="size-10 rounded-full bg-destructive flex items-center justify-center">
      <AlertCircle className="size-5.5 text-foreground" />
    </div>
  )

  const RoleIcon = getRoleIcon(user.role)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>

        <Avatar className="rounded-full relative hover:cursor-pointer size-10 flex items-center justify-center">
          <AvatarImage
            src={user?.avatar}
            alt={`${user?.username} Avatar`}
          />
          <AvatarFallback className="text-xl font-semibold">
            {user?.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 shadow-2xl border py-2">

        {/* User Info */}
        <DropdownMenuLabel className="flex flex-col items-start px-4 py-2 space-y-1">
          <span className="font-semibold truncate w-full flex items-center">
            <RoleIcon className="size-4 mr-4" />
            {capitalizeFirstLetter(user.username)}
          </span>
          <span className="text-sm text-muted block truncate w-full">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2 opacity-50" />

        {/* Dashboard Link */}
        <DropdownMenuItem asChild>
          <Link href={getDashboardLink()} className="flex items-center">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        {/* Profile Link */}
        <DropdownMenuItem asChild>
          <Link href={getProfileLink()} className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>

        {/* Role-specific Links */}
        {user.role === UserRoles.USER && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/user/bookings">My Bookings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/user/profile">My Profile</Link>
            </DropdownMenuItem>
          </>
        )}


        <DropdownMenuSeparator className="my-2 opacity-50" />

        {/* Logout */}
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => await signOut()}
          className="flex items-center"
        >
          <span>Logout</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}