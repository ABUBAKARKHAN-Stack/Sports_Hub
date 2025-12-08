"use client";

import { useState } from "react";
import { FacilityProvider } from '@/context/admin/FacilityContext';
import Sidebar from '@/components/layout/Header/Sidebar';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ServiceProvider } from "@/context/admin/ServiceContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <FacilityProvider>
      <ServiceProvider>
        <div className="flex min-h-screen">
          {/* Only render ONE Sidebar component */}
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />

          {/* Mobile Sidebar Toggle Button (only on small screens) */}
          <div className="lg:hidden fixed top-20 left-4 z-40">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileSidebarOpen(true)}
              className="bg-white shadow-md"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Main Content */}
          <main className="flex-1 w-full p-4 lg:p-6 lg:ml-0">
            {children}
          </main>
        </div>
      </ServiceProvider>
    </FacilityProvider>
  );
}