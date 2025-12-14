import AdminsBaseLayout from '@/components/layout/admins/AdminsBaseLayout';
import AdminProvider from '@/providers/AdminProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <AdminProvider>
      <AdminsBaseLayout>
        {children}
      </AdminsBaseLayout>
    </AdminProvider>

  );
}