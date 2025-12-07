"use client"
import { useFacility } from '@/context/admin/FacilityContext'
import React, { useEffect } from 'react'
import FacilityForm from './FacilityForm'

const UpdateFacility = ({ id }: { id: string }) => {
    const { getFacilityById, state, updateFacility } = useFacility()

    useEffect(() => {
        getFacilityById(id)
    }, [id])

    const handleSubmit = async (formData: FormData) => {
        // Add the ID to the form data for backend
        formData.append('id', id);
        await updateFacility(id, formData as any)
    }

    // Transform the data to match the form's expected structure
    const transformInitialData = () => {
        if (!state.currentFacility) return undefined;
        
        const data = state.currentFacility;
        return {
            name: data.name || '',
            description: data.description || null,
            location: {
                address: data.location?.address || '',
                city: data.location?.city || '',
                coordinates: {
                    lat: data.location?.coordinates?.lat || 0,
                    lng: data.location?.coordinates?.lng || 0
                }
            },
            contact: {
                phone: data.contact?.phone || '',
                email: data.contact?.email || ''
            },
            openingHours: data.openingHours?.map((hour: any) => ({
                day: hour.day,
                openingTime: hour.openingTime || '09:00',
                closingTime: hour.closingTime || '17:00',
                isClosed: hour.isClosed || false
            })) || [],
            gallery: {
                images: data.gallery?.images || [],
                introductoryVideo: data.gallery?.introductoryVideo || null
            }
        };
    };

    console.log('Current facility:', state.currentFacility);

    return (
        <FacilityForm
            onSubmit={handleSubmit}
            initialData={transformInitialData()}
            isLoading={state.loading}
        />
    )
}

export default UpdateFacility