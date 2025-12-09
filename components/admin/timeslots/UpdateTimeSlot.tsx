"use client"
import { useTimeSlot } from '@/context/admin/TimeSlotContext'
import TimeSlotForm from './TimeSlotForm'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const UpdateTimeSlot = ({ id }: { id: string }) => {
    const { getTimeSlotById, updateTimeSlot, state } = useTimeSlot()
    const router = useRouter();

    useEffect(() => {
        getTimeSlotById(id)
    }, [id])

    const handleSubmit = async (data: any) => {
        await updateTimeSlot(id, data)
        router.push('/admin/timeslots');

    }

    const transformInitialData = () => {
        if (!state.currentTimeslot) return undefined;

        const data = state.currentTimeslot;
        return {
            date: data.date,
            facilityId: data.facilityId._id.toString(),
            serviceId: data.serviceId._id.toString(),
            isActive: data.isActive,
            startTime: data.startTime,
            endTime: data.endTime,
        };
    };


    return (
        <TimeSlotForm
            initialData={transformInitialData() as any}
            onSubmit={handleSubmit}
            goBackUrl='/admin/timeslots'
        />
    )
}

export default UpdateTimeSlot