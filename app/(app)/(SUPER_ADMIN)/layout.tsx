"use client";

import { useState } from "react";
import { SuperAdminFacilityProvider } from '@/context/super-admin/SuperAdminFacilityContext';
import Sidebar from '@/components/layout/Header/Sidebar';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <SuperAdminFacilityProvider>
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
    </SuperAdminFacilityProvider>
  );
}

// "use client";

// import { SuperAdminFacilityProvider } from '@/context/super-admin/SuperAdminFacilityContext';
// import AdminsBaseLayout from "@/components/layout/admins/AdminsBaseLayout";

// export default function SuperAdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {

//   return (
//     <SuperAdminFacilityProvider>
     
//       <AdminsBaseLayout>
//         {children}
//       </AdminsBaseLayout>
//     </SuperAdminFacilityProvider>
//   );
// }