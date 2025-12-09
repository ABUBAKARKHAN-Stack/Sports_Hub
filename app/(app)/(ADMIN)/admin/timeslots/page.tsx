import TimeSlotList from '@/components/admin/timeslots/TimeSlotList';

export default function AdminTimeslotsPage() {
  return (
      <div className="container mx-auto py-8">
        <TimeSlotList mode="admin" />
      </div>
  );
}