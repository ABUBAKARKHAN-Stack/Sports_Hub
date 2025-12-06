import { UserRoles } from '@/types/main.types';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  submenu?: NavLink[];
  roles?: UserRoles[];
}

export const useRoleNavigation = (userRole?: UserRoles) => {
  //* Base navigation links for all roles
  const baseLinks: NavLink[] = [
    { 
      label: "Home", 
      href: "/", 
      roles: [UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN, undefined] 
    },
    { 
      label: "Courts", 
      href: "/courts", 
      roles: [UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN, undefined] 
    },
    {
      label: "Sports",
      href: "/sports",
      roles: [UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN, undefined],
      submenu: [
        { label: "Badminton", href: "/sports/badminton" },
        { label: "Tennis", href: "/sports/tennis" },
        { label: "Basketball", href: "/sports/basketball" },
        { label: "Squash", href: "/sports/squash" },
        { label: "Cricket", href: "/sports/cricket" },
      ],
    },
    { 
      label: "Blogs", 
      href: "/blogs", 
      roles: [UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN, undefined] 
    },
    { 
      label: "Contact", 
      href: "/contact", 
      roles: [UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN, undefined] 
    },
  ];

  //* Admin-only links
  const adminLinks: NavLink[] = [
    { 
      label: "Dashboard", 
      href: "/admin", 
      roles: [UserRoles.ADMIN] 
    },
    { 
      label: "Facilities", 
      href: "/admin/facilities", 
      roles: [UserRoles.ADMIN] 
    },
    { 
      label: "Services", 
      href: "/admin/services", 
      roles: [UserRoles.ADMIN] 
    },
    { 
      label: "Bookings", 
      href: "/admin/bookings", 
      roles: [UserRoles.ADMIN] 
    },
    { 
      label: "Payments", 
      href: "/admin/payments", 
      roles: [UserRoles.ADMIN] 
    },
  ];

  //* Super Admin-only links
  const superAdminLinks: NavLink[] = [
    { 
      label: "Super Admin", 
      href: "/super-admin", 
      roles: [UserRoles.SUPER_ADMIN] 
    },
    { 
      label: "Facilities", 
      href: "/super-admin/facilities", 
      roles: [UserRoles.SUPER_ADMIN] 
    },
    { 
      label: "Admins", 
      href: "/super-admin/admins", 
      roles: [UserRoles.SUPER_ADMIN] 
    },
    { 
      label: "Analytics", 
      href: "/super-admin/analytics", 
      roles: [UserRoles.SUPER_ADMIN] 
    },
  ];

  //* User-only links (logged in regular users)
  const userLinks: NavLink[] = [
    { 
      label: "My Bookings", 
      href: "/user/bookings", 
      roles: [UserRoles.USER] 
    },
    { 
      label: "Profile", 
      href: "/user/profile", 
      roles: [UserRoles.USER] 
    },
  ];

  //* Combine all links and filter by role
  const allLinks = [
    ...baseLinks,
    ...adminLinks,
    ...superAdminLinks,
    ...userLinks,
  ];

  //* Filter links based on user role
  const filteredLinks = allLinks.filter(link => {
    if (!link.roles || link.roles.includes(undefined as any)) {
      return true;
    }
    
    if (userRole) {
      return link.roles.includes(userRole);
    }
    
    return false;
  });

  //* Also get role-specific dashboard link for quick access
  const getDashboardLink = (): string => {
    switch (userRole) {
      case UserRoles.ADMIN:
        return "/admin";
      case UserRoles.SUPER_ADMIN:
        return "/super-admin";
      case UserRoles.USER:
        return "/user/dashboard";
      default:
        return "/";
    }
  };

  return {
    navLinks: filteredLinks,
    getDashboardLink,
    userRole,
  };
};