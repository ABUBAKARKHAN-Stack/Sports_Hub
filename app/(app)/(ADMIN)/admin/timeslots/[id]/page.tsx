import TimeSlotDetailsView from '@/components/admin/timeslots/TimeSlotDetailsView';
import React from 'react'

const AdminTimeslotPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <div className="container mx-auto py-8">
            <TimeSlotDetailsView id={id} />
        </div>
    )
}

export default AdminTimeslotPage