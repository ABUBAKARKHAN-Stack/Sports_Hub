'use client';

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
import {
    Loader2,
    Calendar,
    Clock,
    Building,
    AlertCircle,
    ArrowLeft,
    Save,
    CalendarDays,
    Info,
    MapPin
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToasts } from '@/hooks/toastNotifications';
import { useService } from '@/context/admin/ServiceContext';
import { useFacility } from '@/context/admin/FacilityContext';

// Schema for timeslot validation
const createTimeSlotSchema = (selectedService: any) => {
    return z.object({
        facilityId: z.string().min(1, "Facility is required"),
        serviceId: z.string().min(1, "Service is required"),
        date: z.string().min(1, "Date is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
        isActive: z.boolean().default(true),
    }).refine(data => {
        // Validate that end time is after start time
        const start = new Date(`2000-01-01T${data.startTime}`);
        const end = new Date(`2000-01-01T${data.endTime}`);
        return end > start;
    }, {
        message: "End time must be after start time",
        path: ["endTime"]
    }).refine(data => {
        // Validate duration matches service duration
        if (!selectedService || !selectedService.duration) return true;

        const start = new Date(`2000-01-01T${data.startTime}`);
        const end = new Date(`2000-01-01T${data.endTime}`);
        const slotDuration = (end.getTime() - start.getTime()) / (1000 * 60); // in minutes
        const serviceDuration = selectedService.duration;

        // Allow ±1 minute tolerance for calculation rounding
        return Math.abs(slotDuration - serviceDuration) <= 1;
    }, {
        message: `Time slot duration must match service duration (${selectedService?.duration} minutes)`,
        path: ["endTime"]
    });
};

type TimeSlotFormData = z.infer<ReturnType<typeof createTimeSlotSchema>>;

interface TimeSlotFormProps {
    initialData?: Partial<TimeSlotFormData>;
    onSubmit: (data: TimeSlotFormData) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
    onSuccess?: () => void;
    goBackUrl?: string;
    isBulkMode?: boolean;
    bulkData?: Partial<TimeSlotFormData>[];
}

const defaultFormValues: any = {
    facilityId: '',
    serviceId: '',
    date: '',
    startTime: '',
    endTime: '',
    isActive: true,
};

export default function TimeSlotForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    onSuccess,
    goBackUrl,
    isBulkMode = false,
    bulkData = []
}: TimeSlotFormProps) {
    const [formError, setFormError] = useState<string | null>(null);
    const [selectedFacilityServices, setSelectedFacilityServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [servicesLoading, setServicesLoading] = useState(false);
    const router = useRouter();
    const { errorToast } = useToasts();
    const { state: serviceState } = useService();
    const { state: facilityState } = useFacility();

    const isEditMode = !!initialData;

    // Memoize schema to prevent infinite loops in resolver
    const schema = useMemo(() => createTimeSlotSchema(selectedService), [selectedService]);

    // Initialize form
    const form = useForm<TimeSlotFormData>({
        resolver: zodResolver(schema) as any,
        defaultValues: defaultFormValues,
        mode: 'onChange',
    });

    // Watch form values
    const selectedFacilityId = form.watch('facilityId');
    const selectedServiceId = form.watch('serviceId');
    const startTime = form.watch('startTime');
    const endTime = form.watch('endTime');

    // Get current selected service
    useEffect(() => {
        if (selectedServiceId && selectedFacilityServices.length > 0) {
            const service = selectedFacilityServices.find(s => s._id === selectedServiceId);
            setSelectedService(service || null);
        } else {
            setSelectedService(null);
        }
    }, [selectedServiceId, selectedFacilityServices]);

    // Update validation when service changes
    useEffect(() => {
        form.trigger();
    }, [selectedService, form]);

    // Load services for selected facility
    useEffect(() => {
        const loadFacilityServices = async () => {
            if (!selectedFacilityId) {
                setSelectedFacilityServices([]);
                setSelectedService(null);
                return;
            }

            setServicesLoading(true);
            try {
                const services = serviceState.services.filter(
                    service => service.facilityId?._id?.toString() === selectedFacilityId
                );
                setSelectedFacilityServices(services);
            } catch (error) {
                console.error('Failed to load services:', error);
                errorToast('Failed to load services for selected facility');
            } finally {
                setServicesLoading(false);
            }
        };

        loadFacilityServices();
    }, [selectedFacilityId, serviceState.services]);

    // Initialize form with data
    useEffect(() => {
        if (initialData) {
            form.reset({
                ...defaultFormValues,
                ...initialData,
            });
        }
    }, [initialData, form]);

    // Auto-calculate end time based on start time and service duration
    // Dependencies fixed to prevent infinite loop
    useEffect(() => {
        if (startTime && selectedService?.duration) {
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(start.getTime() + selectedService.duration * 60000);
            const requiredEndTimeStr = end.toTimeString().slice(0, 5);

            const currentEndTime = form.getValues('endTime');

            if (currentEndTime !== requiredEndTimeStr) {
                form.setValue('endTime', requiredEndTimeStr, {
                    shouldValidate: true,
                    shouldDirty: true
                });
            }
        }
    }, [startTime, selectedService?.duration]);

    // Generate time steps based on Service Duration
    const timeOptions = useMemo(() => {
        const times = [];
        const step = selectedService?.duration > 0 ? selectedService.duration : 30;

        for (let minutes = 0; minutes < 24 * 60; minutes += step) {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;

            if (h >= 24) break;

            const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            times.push(timeString);
        }
        return times;
    }, [selectedService?.duration]);

    const handleSubmit = async (data: any) => {
        try {
            setFormError(null);

            if (isBulkMode && bulkData.length === 0) {
                throw new Error("No timeslots added for bulk creation");
            }

            if (selectedService?.duration) {
                const start = new Date(`2000-01-01T${data.startTime}`);
                const end = new Date(`2000-01-01T${data.endTime}`);
                const slotDuration = (end.getTime() - start.getTime()) / (1000 * 60);
                const serviceDuration = selectedService.duration;

                if (Math.abs(slotDuration - serviceDuration) > 1) {
                    throw new Error(`Time slot duration must be exactly ${serviceDuration} minutes`);
                }
            }

            await onSubmit(data);

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

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const calculateDuration = () => {
        if (!startTime || !endTime) return null;

        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.round(diffMs / 60000);

        return {
            minutes: diffMins,
            hours: Math.floor(diffMins / 60),
            remainingMinutes: diffMins % 60
        };
    };

    const duration = calculateDuration();
    const isFormValid = form?.formState?.isValid;

    return (
        <div className="space-y-6">
            <div>
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
            </div>

            {formError && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">{formError}</p>
                    </div>
                </div>
            )}

            {isBulkMode && (
                <Badge variant="secondary" className="px-3 py-1">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Bulk Creation Mode ({bulkData.length} timeslots)
                </Badge>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

                    {/* --- SECTION 1: FACILITY & SERVICE --- */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Facility & Service
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Facility Selection */}
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
                                                        <SelectValue placeholder={facilityState.loading ? "Loading..." : "Select a facility"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {facilityState.facilities.length === 0 ? (
                                                        <SelectItem value="none" disabled>No facilities found</SelectItem>
                                                    ) : (
                                                        facilityState.facilities.map(facility => (
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

                                {/* Service Selection */}
                                <FormField
                                    control={form.control}
                                    name="serviceId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={!selectedFacilityId || servicesLoading || isLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder={servicesLoading ? "Loading..." : "Select a service"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {selectedFacilityServices.length === 0 ? (
                                                        <SelectItem value="none" disabled>No services available</SelectItem>
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


                            {/* ---  NO FACILITIES MESSAGE --- */}
                            {facilityState.facilities.length === 0 && !facilityState.loading && (
                                <div className="flex items-start gap-2 mt-2 p-3 bg-amber-50 text-amber-800 rounded-md text-sm border border-amber-100">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="font-medium">No Facilities Found</p>
                                        <p className="text-xs text-amber-700">
                                            You haven&apos;t created any facilities yet. Please go to the <strong>Facilities</strong> page and create one (e.g., "Main Hall" or "Tennis Court") before adding time slots.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* --- NO SERVICES MESSAGES --- */}
                            {selectedFacilityId && selectedFacilityServices.length === 0 && !servicesLoading && (
                                <div className="flex w-full items-start gap-2 mt-2 p-3 bg-amber-50 text-amber-800 rounded-md text-sm border border-amber-100">
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="font-medium">No Services Available</p>
                                        <p className="text-xs text-amber-700">
                                            This facility doesn&apos;t have any services yet. Time slots rely on services (like "1 Hour Booking").
                                            <br />
                                            Please go to the <strong>Services</strong> page to add services for this facility.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedService && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-blue-900">{selectedService.title}</h4>
                                            <p className="text-sm text-blue-800">
                                                Duration: <strong>{selectedService.duration} mins</strong>.
                                                Time slots are generated in {selectedService.duration}-minute steps.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* --- SECTION 2: DATE & TIME --- */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Date & Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date *</FormLabel>
                                            <FormControl>
                                                <Input type="date" min={getTodayDate()} {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" /> Start Time *
                                                </div>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={isLoading || !selectedService}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Select start time" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-[250px]">
                                                    {timeOptions.map(time => (
                                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {!selectedService && (
                                                <p className="text-[0.8rem] text-muted-foreground mt-1">Select a service first.</p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" /> End Time *
                                                </div>
                                            </FormLabel>
                                            <Select
                                                value={field.value}
                                                disabled={true}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full bg-gray-50'>
                                                        <SelectValue placeholder="Auto-calculated" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {field.value && (
                                                        <SelectItem value={field.value}>{field.value}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[0.8rem] text-muted-foreground mt-1">
                                                Auto-calculated based on service duration.
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {duration && selectedService && (
                                <div className={`p-3 rounded-md ${Math.abs(duration.minutes - selectedService.duration) <= 1 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                                    <div className="flex items-center gap-2">
                                        <Info className={`h-4 w-4 ${Math.abs(duration.minutes - selectedService.duration) <= 1 ? 'text-green-600' : 'text-amber-600'}`} />
                                        <span className={`text-sm ${Math.abs(duration.minutes - selectedService.duration) <= 1 ? 'text-green-700' : 'text-amber-700'}`}>
                                            {Math.abs(duration.minutes - selectedService.duration) <= 1
                                                ? `✓ Perfect! This is a ${duration.minutes} minute slot.`
                                                : `⚠ Duration mismatch.`
                                            }
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {isEditMode && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle>Timeslot Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Timeslot Status</FormLabel>
                                                <p className="text-sm text-gray-500">
                                                    {field.value ? "Active" : "Inactive"}
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleGoBack} disabled={isLoading} className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Go Back
                        </Button>
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>Reset</Button>
                            {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>}
                            <Button type="submit" disabled={isLoading || !isFormValid} className="gap-2 min-w-[150px]">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {isEditMode ? 'Update Timeslot' : 'Create Timeslot'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}