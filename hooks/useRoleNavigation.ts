import { UserRoles } from '@/types/main.types';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  submenu?: NavLink[];
  roles?: UserRoles[];
}

export const useRoleNavigation = (userRole?: UserRoles) => {
  //* Base navigation links for ALL users (header navigation)
  const baseLinks: NavLink[] = [
    { 
      label: "Home", 
      href: "/"
    },
    { 
      label: "Courts", 
      href: "/courts"
    },
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
    { 
      label: "Blogs", 
      href: "/blogs"
    },
    { 
      label: "Contact", 
      href: "/contact"
    },
  ];

  //* Regular User links (will appear in header, not sidebar)
  const regularUserLinks: NavLink[] = [
    { 
      label: "My Bookings", 
      href: "/bookings",
      roles: [UserRoles.USER]
    },
    { 
      label: "Profile", 
      href: "/profile",
      roles: [UserRoles.USER]
    },
  ];

  //* Manager/Admin-only links (for sidebar)
  const managerLinks: NavLink[] = [
    { 
      label: "Dashboard", 
      href: "/admin/dashboard",
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
      label: "Timeslots",
      href: "/admin/timeslots",
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

  //* Super Admin-only links (for sidebar, in addition to manager links)
  const superAdminLinks: NavLink[] = [
     { 
      label: "Dashboard", 
      href: "/super-admin/dashboard",
      roles: [UserRoles.ADMIN]
    },
    { 
      label: "Facilities", 
      href: "/super-admin/facilities",
      roles: [UserRoles.ADMIN]
    },
    { 
      label: "Services", 
      href: "/super-admin/services",
      roles: [UserRoles.ADMIN]
    },
    { 
      label: "Bookings", 
      href: "/super-admin/bookings",
      roles: [UserRoles.ADMIN]
    },
    { 
      label: "Payments", 
      href: "/super-admin/payments",
      roles: [UserRoles.ADMIN]
    },
    { 
      label: "System Settings", 
      href: "/super-admin/settings",
      roles: [UserRoles.SUPER_ADMIN]
    },
    { 
      label: "Manage Admins", 
      href: "/super-admin/admins",
      roles: [UserRoles.SUPER_ADMIN]
    },
    { 
      label: "Analytics", 
      href: "/super-admin/analytics",
      roles: [UserRoles.SUPER_ADMIN]
    },
    { 
      label: "Audit Logs", 
      href: "/super-admin/audit-logs",
      roles: [UserRoles.SUPER_ADMIN]
    },
  ];

  //* Get header navigation based on role
  const getHeaderNavigation = (): NavLink[] => {
    const links = [...baseLinks];
    
    // Add regular user links to header if user is logged in as USER
    if (userRole === UserRoles.USER) {
      links.push(...regularUserLinks);
    }
    
    return links;
  };

  //* Get sidebar navigation ONLY for Managers and Super Admins
  const getSidebarNavigation = (): NavLink[] => {
    const sidebarLinks: NavLink[] = [];

    // Only managers and super admins get sidebar
    if (userRole === UserRoles.ADMIN) {
      sidebarLinks.push(...managerLinks);
    } else if (userRole === UserRoles.SUPER_ADMIN) {
      sidebarLinks.push(...superAdminLinks);
    }

    return sidebarLinks;
  };

  //* Check if user has sidebar navigation (ONLY for managers/super admins)
  const hasSidebarNavigation = (): boolean => {
    return [UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(userRole as UserRoles);
  };

  //* Check if user is a regular user (for showing user-specific links in header)
  const isRegularUser = (): boolean => {
    return userRole === UserRoles.USER;
  };

  //* Get dashboard link for quick access
  const getDashboardLink = (): string => {
    switch (userRole) {
      case UserRoles.ADMIN:
        return "/admin/dashboard";
      case UserRoles.SUPER_ADMIN:
        return "/super-admin/dashboard";
      case UserRoles.USER:
        return "/bookings";
      default:
        return "/";
    }
  };

  //* Get role-specific home link (for redirects)
  const getRoleHomeLink = (): string => {
    switch (userRole) {
      case UserRoles.ADMIN:
        return "/admin/dashboard";
      case UserRoles.SUPER_ADMIN:
        return "/super-admin/dashboard";
      case UserRoles.USER:
        return "/bookings";
      default:
        return "/";
    }
  };

  //* Get role label for display
  const getRoleLabel = (): string => {
    switch (userRole) {
      case UserRoles.ADMIN:
        return "Manager";
      case UserRoles.SUPER_ADMIN:
        return "Super Admin";
      case UserRoles.USER:
        return "User";
      default:
        return "Guest";
    }
  };

  //* Check if user can access admin features (uses FacilityProvider)
  const canAccessAdminFeatures = (): boolean => {
    return [UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(userRole as UserRoles);
  };

  return {
    // Header navigation (base links + user-specific links for regular users)
    headerNavLinks: getHeaderNavigation(),
    
    // Sidebar navigation (ONLY for managers and super admins)
    sidebarNavLinks: getSidebarNavigation(),
    
    // Helper functions
    hasSidebarNavigation: hasSidebarNavigation(),
    isRegularUser: isRegularUser(),
    canAccessAdminFeatures: canAccessAdminFeatures(),
    getDashboardLink,
    getRoleHomeLink,
    getRoleLabel,
    userRole,
  };
};