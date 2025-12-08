"use client"
import { useFacility } from '@/context/admin/FacilityContext'
import { useService } from '@/context/admin/ServiceContext'
import React, { useEffect } from 'react'
import ServiceForm from './ServiceForm'

const UpdateService = ({ id }: { id: string }) => {
    const { getServiceById, state, updateService } = useService()

    useEffect(() => {
        getServiceById(id)
    }, [id])

    const handleSubmit = async (formData: FormData) => {
        // Add the ID to the form data for backend
        formData.append('id', id);
        await updateService(id, formData as any)
    }

    console.log('Current service:', state.currentService);
    

    // Transform the data to match the form's expected structure
    const transformInitialData = () => {
        if (!state.currentService) return undefined;
        
        const data = state.currentService;
        return {
            title: data.title || '',
            description: data.description || null,
            category: data.category || '',
            duration: data.duration || 0,
            price: data.price || 0,
            facilityId: data.facilityId._id || '',
            capacity: data.capacity || 0,
            isActive: data.isActive || false,
            images: data.images || [],
        };
    };

    return (
        <ServiceForm
            onSubmit={handleSubmit}
            initialData={transformInitialData() as any}
            isLoading={state.loading}
        />
    )
}

export default UpdateService