
"use client";

import { SuperAdminFacilityProvider } from '@/context/super-admin/SuperAdminFacilityContext';
import AdminsBaseLayout from "@/components/layout/admins/AdminsBaseLayout";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SuperAdminFacilityProvider>
     
      <AdminsBaseLayout>
        {children}
      </AdminsBaseLayout>
    </SuperAdminFacilityProvider>
  );
}