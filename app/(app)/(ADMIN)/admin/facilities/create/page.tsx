"use client"

import AdminPageHeader from '@/components/admin/AdminPageHeader'
import FacilityForm from '@/components/admin/facilities/FacilityForm'
import ContainerLayout from '@/components/layout/ContainerLayout'
import { useFacility } from '@/context/admin/FacilityContext'
import { Building } from 'lucide-react'

const CreateFacility = () => {
    const {
        createFacility,
        state: { loading },
    } = useFacility()
    return (

        <main className='mt-10'>
            <ContainerLayout className='space-y-6'>
                <AdminPageHeader
                    mainHeading='Create Facility'
                    subText='Fill out the form below to add a new facility.'
                    mainIcon={<Building className='h-6 w-6 sm:h-8 sm:w-8' />}
                />
                <FacilityForm onSubmit={createFacility as any} isLoading={loading}   />
            </ContainerLayout>
        </main>
    )
}

export default CreateFacility