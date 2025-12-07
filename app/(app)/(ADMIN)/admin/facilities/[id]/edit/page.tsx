// "use "

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import UpdateFacility from "@/components/admin/facilities/UpdateFacility";
import ContainerLayout from "@/components/layout/ContainerLayout";
import { Building } from "lucide-react";


const EditFacilityPage = async ({params}: { params: Promise<{ id: string } >}) => {
  const {id} = await params
  
  return (
      <main className='space-y-6'>
            {/* <ContainerLayout className='space-y-6'> */}
                {/* <AdminPageHeader
                    mainHeading='Edit Facility'
                    subText='Fill out the form below to edit the facility.'
                    mainIcon={<Building className='h-6 w-6 sm:h-8 sm:w-8' />}
                /> */}
                <UpdateFacility id={id}   />
            {/* </ContainerLayout> */}
        </main>
  )
}

export default EditFacilityPage