import FacilityDetailsView from '@/components/super_admin/facilities/FacilityDetailsView';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: "Facility Details | Super Admin Dashboard",
    description: 'View facility details',
  };
}

export default async function SingleFacilityPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main>
        <FacilityDetailsView id={id} />
    </main>
  );
}