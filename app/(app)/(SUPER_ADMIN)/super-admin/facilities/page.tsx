import React from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import FacilityList from '@/components/super_admin/facilities/FacilityList';
import ContainerLayout from '@/components/layout/ContainerLayout';
import { Building2, Users,  } from 'lucide-react';

const SuperAdminFacilityPage = () => {
  return (
    <main className='space-y-6'>
    {/* <ContainerLayout className='space-y-6'> */}
      {/* <AdminPageHeader 
        mainIcon={<Building2 className="h-6 w-6 sm:h-8 sm:w-8" />}
        mainHeading="Facilities Management"
        subIcon={<Users className="h-4 w-4" />}
        subText="Manage and oversee all facilities, their status, and services"
      /> */}
      <FacilityList />
    {/* </ContainerLayout> */}
    </main>
  );
};

export default SuperAdminFacilityPage;