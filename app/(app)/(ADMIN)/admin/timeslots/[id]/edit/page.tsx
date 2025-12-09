import UpdateTimeSlot from '@/components/admin/timeslots/UpdateTimeSlot';
import React from 'react'

const EditTimeslotPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <div className="container mx-auto py-8">
            <UpdateTimeSlot id={id} />
        </div>
    )
}

export default EditTimeslotPage