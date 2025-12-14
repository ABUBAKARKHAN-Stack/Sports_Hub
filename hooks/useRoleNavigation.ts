import { UserRoles } from '@/types/main.types';
import {
  Home,
  LayoutDashboard,
  Building,
  ToolCase,
  Clock,
  CalendarCheck,
  CreditCard,
  Settings,
  Users,
  BarChart2,
  FileText,
  LucideIcon,
  Building2,
  Shield,
  User,
} from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  icon?: LucideIcon; 
  submenu?: NavLink[];
  roles?: UserRoles[];
}

export const useRoleNavigation = (userRole?: UserRoles) => {
  //* Base navigation links for ALL users (header navigation)

  const baseLinks: NavLink[] = [
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
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ];

  //* Regular User links
  const regularUserLinks: NavLink[] = [
    { label: "My Bookings", href: "/bookings", roles: [UserRoles.USER] },
    { label: "Profile", href: "/profile", roles: [UserRoles.USER] },
  ];

  //* Manager/Admin sidebar links with icons
  const managerLinks: NavLink[] = [
    { label: "Home", href: "/", icon: Home, roles: [UserRoles.ADMIN] },
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: [UserRoles.ADMIN] },
    { label: "Facilities", href: "/admin/facilities", icon: Building, roles: [UserRoles.ADMIN] },
    { label: "Services", href: "/admin/services", icon: ToolCase, roles: [UserRoles.ADMIN] },
    { label: "Timeslots", href: "/admin/timeslots", icon: Clock, roles: [UserRoles.ADMIN] },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck, roles: [UserRoles.ADMIN] },
    { label: "Payments", href: "/admin/payments", icon: CreditCard, roles: [UserRoles.ADMIN] },
  ];

  //* Super Admin sidebar links with icons
  const superAdminLinks: NavLink[] = [
    { label: "Home", href: "/", icon: Home, roles: [UserRoles.ADMIN] },
    { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard, roles: [UserRoles.ADMIN] },
    { label: "Facilities", href: "/super-admin/facilities", icon: Building, roles: [UserRoles.ADMIN] },
    { label: "Services", href: "/super-admin/services", icon: ToolCase, roles: [UserRoles.ADMIN] },
    { label: "Bookings", href: "/super-admin/bookings", icon: CalendarCheck, roles: [UserRoles.ADMIN] },
    { label: "Payments", href: "/super-admin/payments", icon: CreditCard, roles: [UserRoles.ADMIN] },
    { label: "System Settings", href: "/super-admin/settings", icon: Settings, roles: [UserRoles.SUPER_ADMIN] },
    { label: "Manage Admins", href: "/super-admin/admins", icon: Users, roles: [UserRoles.SUPER_ADMIN] },
    { label: "Analytics", href: "/super-admin/analytics", icon: BarChart2, roles: [UserRoles.SUPER_ADMIN] },
    { label: "Audit Logs", href: "/super-admin/audit-logs", icon: FileText, roles: [UserRoles.SUPER_ADMIN] },
  ];

  //* Header navigation
  const getHeaderNavigation = (): NavLink[] => {
    const links = [...baseLinks];
    if (userRole === UserRoles.USER) links.push(...regularUserLinks);
    return links;
  };

  //* Sidebar navigation
  const getSidebarNavigation = (): NavLink[] => {
    if (userRole === UserRoles.ADMIN) return [...managerLinks];
    if (userRole === UserRoles.SUPER_ADMIN) return [...superAdminLinks];
    return [];
  };

  //* Helper functions
  const hasSidebarNavigation = () => [UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(userRole as UserRoles);

  const isRegularUser = () => userRole === UserRoles.USER;


  const getDashboardLink = (): string =>
    userRole === UserRoles.ADMIN
      ? "/admin/dashboard"
      : userRole === UserRoles.SUPER_ADMIN
      ? "/super-admin/dashboard"
      : "/bookings";
  
      const getProfileLink = (): string =>
    userRole === UserRoles.ADMIN
      ? "/admin/profile"
      : userRole === UserRoles.SUPER_ADMIN
      ? "/super-admin/profile"
      : "/profile";
  
  const getRoleLabel = (): string =>
    userRole === UserRoles.ADMIN
      ? "Manager"
      : userRole === UserRoles.SUPER_ADMIN
      ? "Super Admin"
      : userRole === UserRoles.USER
      ? "User"
      : "Guest";

    const getRoleIcon = (role: UserRoles) => {
    switch (role) {
      case UserRoles.ADMIN:
        return Building2 ;
      case UserRoles.SUPER_ADMIN:
        return Shield ;
      default:
        return User ;
    }
  };    

  return {
    headerNavLinks: getHeaderNavigation(),
    sidebarNavLinks: getSidebarNavigation(),
    hasSidebarNavigation: hasSidebarNavigation(),
    isRegularUser: isRegularUser(),
    getDashboardLink,
    getProfileLink  ,
    getRoleLabel,
    userRole,
    getRoleIcon
  };
};
