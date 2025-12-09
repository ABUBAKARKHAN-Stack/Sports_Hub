'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    Loader2,
    Calendar,
    Clock,
    Users,
    Building,
    Tag,
    AlertCircle,
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    CalendarDays,
    Copy,
    Grid3x3,
    ListChecks
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToasts } from '@/hooks/toastNotifications';
import { useService } from '@/context/admin/ServiceContext';
import { useFacility } from '@/context/admin/FacilityContext';

// --- Added Interface for Service to handle duration ---
interface Service {
    _id: string;
    title: string;
    price: number;
    duration: number;
    facilityId?: { _id: string };
}

// --- Dynamic Schema to validate Duration ---
const createBulkTimeSlotSchema = (selectedService: Service | null) => {
    return z.object({
        facilityId: z.string().min(1, "Facility is required"),
        serviceId: z.string().min(1, "Service is required"),
        startDate: z.string().min(1, "Start date is required"),
        daysOfWeek: z.array(z.number()).min(1, "Select at least one day"),
        timeSlots: z.array(z.object({
            startTime: z.string().min(1, "Start time is required"),
            endTime: z.string().min(1, "End time is required"),
        })).min(1, "Add at least one time slot")
        .superRefine((slots, ctx) => {
            if (!selectedService) return;
            
            slots.forEach((slot, index) => {
                if(!slot.startTime || !slot.endTime) return;

                const start = new Date(`2000-01-01T${slot.startTime}`);
                const end = new Date(`2000-01-01T${slot.endTime}`);
                
                // Validate Sequence
                if (end <= start) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "End time must be after start time",
                        path: ["timeSlots", index, "endTime"]
                    });
                    return;
                }

                // Validate Exact Duration
                const diffMins = Math.round((end.getTime() - start.getTime()) / 60000);
                if (Math.abs(diffMins - selectedService.duration) > 1) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Must match duration (${selectedService.duration}m)`,
                        path: ["timeSlots", index, "endTime"]
                    });
                }
            });
        }),
        isActive: z.boolean().default(true),
    });
};

type BulkTimeSlotFormData = z.infer<ReturnType<typeof createBulkTimeSlotSchema>>;

interface TimeSlotItem {
    id: string;
    startTime: string;
    endTime: string;
}

interface BulkTimeSlotFormProps {
    onSubmit: (data: any) => Promise<{ created: number; errors?: string[] }>;
    onCancel?: () => void;
    isLoading?: boolean;
    onSuccess?: () => void;
    goBackUrl?: string;
}

const defaultFormValues: any = {
    facilityId: '',
    serviceId: '',
    startDate: '',
    daysOfWeek: [],
    timeSlots: [],
    isActive: true,
};

const daysOfWeekOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
];

// Generate time options (Switched to 15 mins for better granularity)
const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            times.push(timeString);
        }
    }
    return times;
};

const timeOptions = generateTimeOptions();

export default function BulkTimeSlotForm({
    onSubmit,
    onCancel,
    isLoading = false,
    onSuccess,
    goBackUrl
}: BulkTimeSlotFormProps) {
    const [formError, setFormError] = useState<string | null>(null);
    const [selectedFacilityServices, setSelectedFacilityServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [timeSlotItems, setTimeSlotItems] = useState<TimeSlotItem[]>([
        { id: '1', startTime: '', endTime: '' }
    ]);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [todayDate, setTodayDate] = useState<string>('');

    const router = useRouter();
    const { errorToast } = useToasts();
    const { state: serviceState } = useService();
    const { state: facilityState } = useFacility();

    // Memoize schema based on selected service duration
    const schema = useMemo(() => createBulkTimeSlotSchema(selectedService), [selectedService]);

    const form = useForm<BulkTimeSlotFormData>({
        resolver: zodResolver(schema) as any,
        defaultValues: defaultFormValues,
        mode: 'onChange',
    });

    // Watch specific form values instead of all values
    const watchFacilityId = form.watch('facilityId');
    const watchServiceId = form.watch('serviceId');
    const watchStartDate = form.watch('startDate');
    const watchDaysOfWeek = form.watch('daysOfWeek');
    const watchIsActive = form.watch('isActive');

    // Set today's date on client only
    useEffect(() => {
        const today = new Date();
        setTodayDate(today.toISOString().split('T')[0]);
    }, []);

    // 1. Identify selected service object to get duration
    useEffect(() => {
        if (watchServiceId && selectedFacilityServices.length > 0) {
            const service = selectedFacilityServices.find(s => s._id === watchServiceId);
            setSelectedService(service || null);
        } else {
            setSelectedService(null);
        }
    }, [watchServiceId, selectedFacilityServices]);

    // Load services for selected facility
    useEffect(() => {
        const loadFacilityServices = async () => {
            if (!watchFacilityId) {
                setSelectedFacilityServices([]);
                form.setValue('serviceId', '');
                return;
            }

            setServicesLoading(true);
            try {
                const services = serviceState.services.filter(
                    (service: any) => service.facilityId?._id?.toString() === watchFacilityId
                ) as Service[];
                setSelectedFacilityServices(services);

                // Reset service selection if no matching service exists
                if (watchServiceId && !services.some(s => s._id === watchServiceId)) {
                    form.setValue('serviceId', '');
                }
            } catch (error) {
                console.error('Failed to load services:', error);
                errorToast('Failed to load services for selected facility');
            } finally {
                setServicesLoading(false);
            }
        };

        loadFacilityServices();
    }, [watchFacilityId, serviceState.services]);

    // Update form timeSlots when timeSlotItems change
    useEffect(() => {
        if (timeSlotItems.length > 0) {
            const validItems = timeSlotItems.filter(t => t.startTime && t.endTime);
            if (validItems.length > 0) {
                form.setValue('timeSlots', validItems);
            }
        }
    }, [timeSlotItems]);

    // Generate preview data with useMemo
    const previewDataMemo = useMemo(() => {
        if (!watchFacilityId || !watchServiceId || !watchStartDate ||
            !watchDaysOfWeek || watchDaysOfWeek.length === 0 ||
            timeSlotItems.length === 0) {
            return [];
        }

        // Only preview valid slots
        const validSlots = timeSlotItems.filter(s => s.startTime && s.endTime);
        if (validSlots.length === 0) return [];

        const preview: any[] = [];
        const date = new Date(watchStartDate);

        const dayNames = watchDaysOfWeek.map(day =>
            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
        );

        // For each timeslot, create entries for the selected date
        validSlots.forEach(slot => {
            preview.push({
                date: date.toISOString().split('T')[0],
                day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
                startTime: slot.startTime,
                endTime: slot.endTime,
                isActive: watchIsActive,
                recurringDays: dayNames.join(', ')
            });
        });

        return preview;
    }, [watchFacilityId, watchServiceId, watchStartDate,
        watchDaysOfWeek, timeSlotItems, watchIsActive]);

    // Update preview data state
    useEffect(() => {
        setPreviewData(previewDataMemo);
    }, [previewDataMemo]);

    // Helper function to calculate duration
    const calculateDuration = useCallback((startTime: string, endTime: string) => {
        if (!startTime || !endTime) return 0;
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diffMs = end.getTime() - start.getTime();
        return Math.round(diffMs / 60000);
    }, []);

    const addTimeSlot = () => {
        if (timeSlotItems.length >= 20) {
            errorToast('Maximum 20 time slots allowed');
            return;
        }

        const newId = Math.random().toString(36).substr(2, 9);
        setTimeSlotItems([
            ...timeSlotItems,
            { id: newId, startTime: '', endTime: '' }
        ]);
    };

    const removeTimeSlot = (id: string) => {
        if (timeSlotItems.length <= 1) {
            setTimeSlotItems([{ id: '1', startTime: '', endTime: '' }]);
            return;
        }
        setTimeSlotItems(timeSlotItems.filter(item => item.id !== id));
    };

    // --- Updated: Logic to Auto-Calculate End Time ---
    const updateTimeSlot = (id: string, field: keyof TimeSlotItem, value: any) => {
        setTimeSlotItems(prev => prev.map(item => {
            if (item.id !== id) return item;

            // If changing Start Time, auto-calculate End Time
            if (field === 'startTime' && selectedService?.duration) {
                const start = new Date(`2000-01-01T${value}`);
                const end = new Date(start.getTime() + selectedService.duration * 60000);
                const autoEnd = end.toTimeString().slice(0, 5);
                return { ...item, startTime: value, endTime: autoEnd };
            }

            return { ...item, [field]: value };
        }));
    };

    const toggleDayOfWeek = (day: number) => {
        const currentDays = form.getValues('daysOfWeek') || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];

        form.setValue('daysOfWeek', newDays);
    };

    const handleSubmit = async (data: BulkTimeSlotFormData) => {
        try {
            setFormError(null);

            const bulkData = {
                facilityId: data.facilityId,
                serviceId: data.serviceId,
                date: data.startDate,
                timeSlots: data.timeSlots,
                recurring: {
                    days: data.daysOfWeek
                },
            };

            await onSubmit(bulkData);

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
            setFormError(errorMessage);
            errorToast(errorMessage);
        }
    };

    const resetForm = () => {
        form.reset(defaultFormValues);
        setTimeSlotItems([{ id: '1', startTime: '', endTime: '' }]);
        setPreviewData([]);
        setFormError(null);
        setSelectedService(null);
    };

    const handleGoBack = () => {
        if (goBackUrl) {
            router.push(goBackUrl);
        } else if (onCancel) {
            onCancel();
        } else {
            router.back();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleGoBack}
                    className="gap-2 px-0 hover:bg-transparent"
                    disabled={isLoading}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </Button>

                <Badge variant="secondary" className="px-3 py-1">
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    Bulk Timeslot Creation
                </Badge>
            </div>

            {/* Form Error Alert */}
            {formError && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">{formError}</p>
                    </div>
                </div>
            )}

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    {/* Facility and Service Selection */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Facility & Service
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="facilityId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Facility *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={isLoading || facilityState.loading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder={
                                                            facilityState.loading ? "Loading facilities..." : "Select a facility"
                                                        } />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {facilityState.facilities.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No facilities available
                                                        </SelectItem>
                                                    ) : (
                                                        facilityState.facilities.map((facility: any) => (
                                                            <SelectItem key={facility._id.toString()} value={facility._id.toString()}>
                                                                {facility.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="serviceId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service *</FormLabel>
                                            <Select
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    // Clear times on service change to avoid mismatch
                                                    setTimeSlotItems([{ id: '1', startTime: '', endTime: '' }]);
                                                }}
                                                value={field.value}
                                                disabled={!watchFacilityId || servicesLoading || isLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder={
                                                            !watchFacilityId
                                                                ? "Select facility first"
                                                                : servicesLoading
                                                                    ? "Loading services..."
                                                                    : "Select a service"
                                                        } />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {selectedFacilityServices.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No services available for this facility
                                                        </SelectItem>
                                                    ) : (
                                                        selectedFacilityServices.map(service => (
                                                            <SelectItem key={service._id} value={service._id}>
                                                                {service.title} - Rs {service.price} ({service.duration} mins)
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule Settings */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                Schedule Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    min={todayDate || undefined}
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="w-full md:w-1/3"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
                                <FormLabel className="mb-3 block">Recurring Days of Week *</FormLabel>
                                <p className="text-sm text-gray-500 mb-3">
                                    Select the days of week when these time slots should recur
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {daysOfWeekOptions.map(day => {
                                        const isSelected = watchDaysOfWeek?.includes(day.value);
                                        return (
                                            <Button
                                                key={day.value}
                                                type="button"
                                                variant={isSelected ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => toggleDayOfWeek(day.value)}
                                                disabled={isLoading}
                                            >
                                                {day.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                                {form.formState.errors.daysOfWeek && (
                                    <p className="text-sm font-medium text-destructive mt-2">
                                        {form.formState.errors.daysOfWeek.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Time Slots Configuration */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Time Slots
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addTimeSlot}
                                    disabled={timeSlotItems.length >= 20 || isLoading || !selectedService}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Slot
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!selectedService ? (
                                <div className="text-center p-4 bg-gray-50 text-gray-500 rounded-md border border-dashed">
                                    Please select a service first to configure time slots.
                                </div>
                            ) : (
                                timeSlotItems.map((slot, index) => (
                                    <div key={slot.id} className="p-4 border rounded-lg space-y-4 relative bg-white">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-sm flex items-center gap-2">
                                                Time Slot #{index + 1}
                                                {/* Display Duration Badge */}
                                                {slot.startTime && slot.endTime && (
                                                    <Badge variant="outline" className="font-normal text-xs">
                                                        {calculateDuration(slot.startTime, slot.endTime)} mins
                                                    </Badge>
                                                )}
                                            </h4>
                                            {timeSlotItems.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => removeTimeSlot(slot.id)}
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium mb-1 block">Start Time *</label>
                                                <Select
                                                    value={slot.startTime}
                                                    onValueChange={(value) => updateTimeSlot(slot.id, 'startTime', value)}
                                                    disabled={isLoading}
                                                >
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[200px]">
                                                        {timeOptions.map(time => (
                                                            <SelectItem key={time} value={time}>{time}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium mb-1 block text-muted-foreground">
                                                    End Time (Auto)
                                                </label>
                                                <Input 
                                                    value={slot.endTime} 
                                                    disabled 
                                                    className="bg-gray-50 text-gray-500 border-dashed"
                                                    placeholder="--:--" 
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Display specific error for this slot if any */}
                                        {form.formState.errors.timeSlots && form.formState.errors.timeSlots[index] && (
                                            <p className="text-sm text-destructive mt-1">
                                                {(form.formState.errors.timeSlots[index] as any)?.endTime?.message}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}

                            {/* General Time Slot Error */}
                            {form.formState.errors.timeSlots && !Array.isArray(form.formState.errors.timeSlots) && (
                                <p className="text-sm font-medium text-destructive mt-2">
                                    {(form.formState.errors.timeSlots as any).message}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Preview Section */}
                    {previewData.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2">
                                    <ListChecks className="h-5 w-5" />
                                    Preview ({previewData.length} timeslots)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-3 p-3 bg-blue-50 rounded-md">
                                    <p className="text-sm text-blue-700">
                                        <strong>Note:</strong> Timeslots will be created for date <strong>{watchStartDate}</strong>
                                        {' '}and will recur on selected days: <strong>
                                            {watchDaysOfWeek?.map(day =>
                                                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
                                            ).join(', ')}
                                        </strong>
                                    </p>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">Date</th>
                                                <th className="text-left p-2">Day</th>
                                                <th className="text-left p-2">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((slot, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="p-2">{slot.date}</td>
                                                    <td className="p-2">{slot.day}</td>
                                                    <td className="p-2">{slot.startTime} - {slot.endTime}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                        <div className="flex flex-wrap gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoBack}
                                disabled={isLoading}
                                size="lg"
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Go Back
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                                disabled={isLoading}
                                size="lg"
                            >
                                Reset Form
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isLoading}
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading || previewData.length === 0}
                                size="lg"
                                className="min-w-[150px] gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        Create {previewData.length} Timeslots
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}