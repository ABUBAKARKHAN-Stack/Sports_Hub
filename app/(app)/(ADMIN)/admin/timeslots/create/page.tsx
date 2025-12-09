'use client';

import { TimeSlotProvider, useTimeSlot } from '@/context/admin/TimeSlotContext';
import TimeSlotForm from '@/components/admin/timeslots/TimeSlotForm';
import { useRouter } from 'next/navigation';

function CreateTimeslotContent() {
  const { createTimeSlot } = useTimeSlot();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createTimeSlot(data);
    router.push('/admin/timeslots');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Timeslot</h1>
      <TimeSlotForm
        onSubmit={handleSubmit}
        goBackUrl="/admin/timeslots"
      />
    </div>
  );
}

export default function CreateTimeslotPage() {
  return (
    <TimeSlotProvider>
      <CreateTimeslotContent />
    </TimeSlotProvider>
  );
}