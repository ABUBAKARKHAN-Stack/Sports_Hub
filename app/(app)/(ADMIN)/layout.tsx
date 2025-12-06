import { FacilityProvider } from '@/context/admin/FacilityContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <FacilityProvider>
        {children}
      </FacilityProvider>
  );
}
