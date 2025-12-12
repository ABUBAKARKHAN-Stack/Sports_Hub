// components/layout/UserMenu.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Building2, Settings, User, Shield, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoles } from "@/types/main.types";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const { getDashboardLink } = useRoleNavigation(user?.role);

  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (!user) {
    return (
      <button className="rounded-full w-10 h-10 flex items-center justify-center border b pointer-events-none bg-foreground text-background text-xl font-semibold">
        <User className="w-5 h-5 " />
      </button>
    );
  }

  const getRoleIcon = (role: UserRoles) => {
    switch (role) {
      case UserRoles.ADMIN:
        return <Building2 className="h-4 w-4 mr-2" />;
      case UserRoles.SUPER_ADMIN:
        return <Shield className="h-4 w-4 mr-2" />;
      default:
        return <User className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-full relative hover:cursor-pointer size-10 flex items-center justify-center border border-gray-200">
          <AvatarImage
            src={user?.avatar}
            alt={`${user?.username} Avatar`}
          />
          <AvatarFallback className="bg-foreground text-background text-xl font-semibold">
            {user?.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 shadow-2xl border py-2">
        {/* User Info */}
        <DropdownMenuLabel className="flex flex-col items-start px-4 py-2 space-y-1">
          <span className="font-semibold truncate w-full flex items-center">
            {getRoleIcon(user.role)}
            {capitalizeFirst(user.username)}
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

        {/* {(user.role === UserRoles.ADMIN || user.role === UserRoles.SUPER_ADMIN) && (
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">
              <Settings className="h-4 w-4 mr-2" />
              Admin Settings
            </Link>
          </DropdownMenuItem>
        )} */}

        <DropdownMenuSeparator className="my-2 opacity-50" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={async () => await signOut()}
          className="text-red-600 hover:bg-red-50 flex items-center"
        >
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}