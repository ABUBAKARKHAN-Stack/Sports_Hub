"use client"
import { useFacility } from '@/context/admin/FacilityContext'
import React, { useEffect } from 'react'
import FacilityForm from './FacilityForm'

const UpdateFacility = ({ id }: { id: string }) => {
    const { getFacilityById, state, updateFacility } = useFacility()

    useEffect(() => {
        getFacilityById(id)
    }, [id])

    console.log(state.currentFacility);

    const handleSubmit = async (data: any) => {
        await updateFacility(id, data)
    }

    return (
        <FacilityForm
            onSubmit={handleSubmit}
            initialData={state.currentFacility as any}
            isLoading={state.loading}
        />
    )
}

export default UpdateFacility