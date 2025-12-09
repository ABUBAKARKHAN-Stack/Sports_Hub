'use client';

import { TimeSlotProvider, useTimeSlot } from '@/context/admin/TimeSlotContext';
import BulkTimeSlotForm from '@/components/admin/timeslots/BulkTimeSlotForm';
import { useRouter } from 'next/navigation';

function BulkCreateTimeslotContent() {
    const { createBulkTimeSlots } = useTimeSlot();
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        const result = await createBulkTimeSlots(data);
        console.log(`Created ${result.created} timeslots`);
        router.push('/admin/timeslots');
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Bulk Create Timeslots</h1>
            <BulkTimeSlotForm
                onSubmit={handleSubmit as any}
                goBackUrl="/admin/timeslots"
            />
        </div>
    );
}

export default function BulkCreateTimeslotPage() {
    return (
        <TimeSlotProvider>
            <BulkCreateTimeslotContent />
        </TimeSlotProvider>
    );
}