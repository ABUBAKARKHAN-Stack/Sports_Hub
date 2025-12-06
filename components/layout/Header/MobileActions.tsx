"use client";

import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserRoles } from "@/types/main.types";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";
import { Home, Settings, Calendar, User as UserIcon, Shield, Building2 } from "lucide-react";

const MobileActions: FC = () => {
  const { session } = useAuth();
  const { getDashboardLink } = useRoleNavigation(session?.user?.role);

  const getRoleIcon = (role: UserRoles) => {
    switch (role) {
      case UserRoles.ADMIN:
        return <Building2 className="h-5 w-5" />;
      case UserRoles.SUPER_ADMIN:
        return <Shield className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex flex-col h-auto py-3"
      >
        <Link href="/">
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Home</span>
        </Link>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex flex-col h-auto py-3"
      >
        <Link href={getDashboardLink()}>
          {session?.user?.role ? (
            <>
              {getRoleIcon(session.user.role)}
              <span className="text-xs mt-1">Dashboard</span>
            </>
          ) : (
            <>
              <UserIcon className="h-5 w-5" />
              <span className="text-xs mt-1">Login</span>
            </>
          )}
        </Link>
      </Button>

      {session?.user?.role === UserRoles.USER && (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="flex flex-col h-auto py-3"
        >
          <Link href="/user/bookings">
            <Calendar className="h-5 w-5" />
            <span className="text-xs mt-1">Bookings</span>
          </Link>
        </Button>
      )}

      {(session?.user?.role === UserRoles.ADMIN || session?.user?.role === UserRoles.SUPER_ADMIN) && (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="flex flex-col h-auto py-3"
        >
          <Link href="/admin/settings">
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </Button>
      )}
    </div>
  );
};

export default MobileActions;