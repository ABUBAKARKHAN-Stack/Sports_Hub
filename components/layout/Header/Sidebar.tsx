"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Building, 
  ClipboardCheck, 
  CreditCard, 
  Settings, 
  Users,
  BarChart3,
  Shield,
  FileText,
  X,
  ChevronRight,
  ChevronLeft,
  User,
  LogOut,
  HelpCircle,
  Bell,
  Calendar,
  Home,
  Menu
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";

interface SidebarProps {
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface SidebarLink {
  href: string;
  label: string;
  category?: string;
  badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  className, 
  mobileOpen = false,
  onMobileClose 
}) => {
  const pathname = usePathname();
  const { session, signOut } = useAuth();
  const { sidebarNavLinks, hasSidebarNavigation } = useRoleNavigation(session?.user?.role);
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Fix hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render sidebar if user doesn't have sidebar navigation
  if (!hasSidebarNavigation || sidebarNavLinks.length === 0) {
    return null;
  }

  // Toggle collapsible sections
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  // Toggle sidebar collapse
  const toggleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Icon mapping for sidebar items
  const getIcon = useCallback((label: string) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('dashboard')) return <LayoutDashboard className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('home')) return <Home className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('facilit')) return <Building className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('service')) return <ClipboardCheck className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('booking')) return <Calendar className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('payment')) return <CreditCard className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('setting')) return <Settings className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('admin') || labelLower.includes('user')) return <Users className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('analytic')) return <BarChart3 className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('system')) return <Shield className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('audit') || labelLower.includes('report')) return <FileText className="w-5 h-5 shrink-0" />;
    if (labelLower.includes('notification')) return <Bell className="w-5 h-5 shrink-0" />;
    return <LayoutDashboard className="w-5 h-5 shrink-0" />;
  }, []);

  // Group links by category
  const groupedLinks = React.useMemo(() => {
    const links = sidebarNavLinks as unknown as SidebarLink[];
    return links.reduce((acc, link) => {
      const category = link.category || "Main";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(link);
      return acc;
    }, {} as Record<string, SidebarLink[]>);
  }, [sidebarNavLinks]);

  // Desktop Sidebar Content
  const SidebarContent = () => (
    <div className={cn(
      "hidden lg:flex flex-col bg-white border-r border-border  shadow-soft transition-all duration-300 ease-in-out h-auto overflow-hidden",
      collapsed ? "w-[70px]" : "w-64",
      className
    )}>
      {/* Logo/Brand Area - Fixed height */}
      <div className={cn(
        "border-b border-border relative min-h-20 flex items-center",
        collapsed ? "px-3 justify-center" : "px-6"
      )}>
        <div className={cn(
          "flex items-center gap-3 w-full",
          collapsed && "justify-center"
        )}>
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">
                FacilityPro
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                Management Portal
              </p>
            </div>
          )}
          
          {/* Collapse Toggle Button - Fixed position */}
          <button
            onClick={toggleCollapse}
            className={cn(
              "absolute w-6 h-6 bg-primary rounded-full border-2 border-white shadow-medium flex items-center justify-center hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 z-10",
              collapsed ? "right-[-12px]" : "right-[-12px]"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-3 h-3 text-white" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation - Fixed positioning with flex-1 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {Object.entries(groupedLinks).map(([category, links]) => {
            const isMainCategory = category === "Main";
            const showCategoryHeader = !collapsed && !isMainCategory;
            const isExpanded = expandedCategories.has(category) || isMainCategory;
            
            return (
              <div key={category} className="space-y-2">
                {/* Category Header */}
                {showCategoryHeader && (
                  <div className="px-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                        {category}
                      </h3>
                      {links.length > 1 && (
                        <button
                          onClick={() => toggleCategory(category)}
                          className="p-1 hover:bg-accent rounded transition-colors focus:outline-none focus:ring-1 focus:ring-primary shrink-0"
                          aria-label={isExpanded ? `Collapse ${category}` : `Expand ${category}`}
                        >
                          <ChevronRight className={cn(
                            "w-3 h-3 text-muted-foreground transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Links - Fixed height items */}
                {(isMainCategory || isExpanded || collapsed) && (
                  <div className="space-y-1">
                    {links.map((link) => {
                      const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                      
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 group h-[44px]",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-foreground hover:bg-accent hover:text-accent-foreground",
                            collapsed ? "justify-center px-2" : ""
                          )}
                          title={collapsed ? link.label : undefined}
                        >
                          <div className={cn(
                            "transition-colors shrink-0",
                            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                          )}>
                            {getIcon(link.label)}
                          </div>
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate min-w-0">{link.label}</span>
                              {link.badge && (
                                <span className={cn(
                                  "px-2 py-0.5 text-xs rounded-full min-w-[20px] text-center shrink-0",
                                  isActive 
                                    ? "bg-white/20 text-white" 
                                    : "bg-primary/10 text-primary"
                                )}>
                                  {link.badge}
                                </span>
                              )}
                            </>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section - Fixed positioning */}
      <div className={cn(
        "border-t border-border p-4",
        collapsed ? "min-h-[140px]" : "min-h-[160px]"
      )}>
        {!collapsed ? (
          <div className="space-y-4">
            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-medium text-sm">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email?.split('@')[0] || "user"}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-1 focus:ring-primary">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground truncate w-full text-center">Profile</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-1 focus:ring-primary">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground truncate w-full text-center">Settings</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-destructive/10 transition-colors focus:outline-none focus:ring-1 focus:ring-destructive"
              >
                <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4 text-destructive" />
                </div>
                <span className="text-xs text-muted-foreground truncate w-full text-center">Logout</span>
              </button>
            </div>
          </div>
        ) : (
          // Collapsed view - Fixed positioning
          <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex items-center gap-2 w-full justify-center">
              <button className="p-2 rounded-lg hover:bg-accent transition-colors shrink-0" title="Profile">
                <User className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-accent transition-colors shrink-0" title="Settings">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-destructive" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Sidebar Overlay
  const MobileSidebarOverlay = () => {
    if (!mounted || !mobileOpen) return null;

    return (
      <>
        {/* Overlay */}
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={onMobileClose}
          aria-hidden="true"
        />
        
        {/* Sidebar Panel */}
        <div className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 animate-in slide-in-from-left duration-300 flex flex-col">
          {/* Mobile Header */}
          <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-white min-h-[80px] flex items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shrink-0">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-foreground truncate">FacilityPro</h2>
                  <p className="text-xs text-muted-foreground truncate">Management Portal</p>
                </div>
              </div>
              <button
                onClick={onMobileClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-primary shrink-0"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {Object.entries(groupedLinks).map(([category, links]) => {
                const isMainCategory = category === "Main";
                const isExpanded = expandedCategories.has(category) || isMainCategory;
                
                return (
                  <div key={category} className="space-y-2">
                    {/* Category Header */}
                    {!isMainCategory && (
                      <div className="px-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                            {category}
                          </h3>
                          {links.length > 1 && (
                            <button
                              onClick={() => toggleCategory(category)}
                              className="p-1 hover:bg-accent rounded transition-colors focus:outline-none focus:ring-1 focus:ring-primary shrink-0"
                            >
                              <ChevronRight className={cn(
                                "w-3 h-3 text-muted-foreground transition-transform duration-200",
                                isExpanded && "rotate-90"
                              )} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Links */}
                    {(isMainCategory || isExpanded) && (
                      <div className="space-y-1">
                        {links.map((link) => {
                          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                          
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={onMobileClose}
                              className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors h-[44px]",
                                isActive
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              <div className={cn(
                                "shrink-0",
                                isActive ? "text-primary-foreground" : "text-muted-foreground"
                              )}>
                                {getIcon(link.label)}
                              </div>
                              <span className="flex-1 truncate min-w-0">{link.label}</span>
                              {link.badge && (
                                <span className={cn(
                                  "px-2 py-0.5 text-xs rounded-full min-w-[20px] text-center shrink-0",
                                  isActive 
                                    ? "bg-white/20 text-white" 
                                    : "bg-primary/10 text-primary"
                                )}>
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Bottom Section */}
          <div className="p-4 border-t border-border bg-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-medium text-sm">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-destructive shrink-0"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 text-destructive" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <SidebarContent />
      <MobileSidebarOverlay />
    </>
  );
};

export default Sidebar;