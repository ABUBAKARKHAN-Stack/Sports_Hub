'use client';

import React, { useEffect, useState } from 'react';
import { useTimeSlot } from '@/context/admin/TimeSlotContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Calendar,
    Clock,
    Edit,
    ArrowLeft,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Info,
    Building,
    DollarSign,
    Package,
    Eye,
    Link as LinkIcon,
    ExternalLink,
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    User,
    Mail,
    CheckSquare,
    XSquare,
    TrendingUp,
    BarChart,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import ServiceSkeleton from '@/components/shared/services/ServiceSkeleton';
import ServiceError from '@/components/shared/services/ServiceError';

interface TimeSlotDetailsViewProps {
    id: string;
}

interface Facility {
    _id: string;
    name: string;
}

interface Service {
    _id: string;
    description: string;
    price: number;
    duration: number;
    title?: string;
}

interface CreatedBy {
    _id: string;
    email: string;
    name?: string;
}

interface TimeSlot {
    _id: string;
    facilityId: Facility;
    serviceId: Service;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    bookedCount: number;
    isActive: boolean;
    createdBy: CreatedBy;
    createdAt: string;
    updatedAt: string;
}

const TimeSlotDetailsView: React.FC<TimeSlotDetailsViewProps> = ({ id }) => {
    const { state, getTimeSlotById } = useTimeSlot();
    const [activeTab, setActiveTab] = useState('details');
    const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);

    useEffect(() => {
        if (id) {
            getTimeSlotById(id);
        }
    }, [id]);

    useEffect(() => {
        if (state.currentTimeslot) {
            setTimeSlot(state.currentTimeslot);
        }
    }, [state.currentTimeslot]);

    const getStatusConfig = (isBooked: boolean, isActive: boolean, date: string) => {
        const slotDate = parseISO(date);
        const isPastSlot = isPast(slotDate);
        const isTodaySlot = isToday(slotDate);

        if (isPastSlot) {
            return {
                icon: XCircle,
                variant: 'secondary' as const,
                className: 'bg-gray-100 text-gray-800 border-gray-200',
                label: 'Expired',
                adminMessage: 'This time slot has passed and is no longer available.',
            };
        }

        if (!isActive) {
            return {
                icon: XCircle,
                variant: 'destructive' as const,
                className: 'bg-red-100 text-red-800 border-red-200',
                label: 'Inactive',
                adminMessage: 'This time slot is currently inactive.',
            };
        }

        if (isBooked) {
            return {
                icon: CheckSquare,
                variant: 'default' as const,
                className: 'bg-blue-100 text-blue-800 border-blue-200',
                label: 'Booked',
                adminMessage: 'This time slot has been booked.',
            };
        }

        return {
            icon: CheckCircle,
            variant: 'default' as const,
            className: 'bg-green-100 text-green-800 border-green-200',
            label: 'Available',
            adminMessage: 'This time slot is available for booking.',
        };
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
        }).format(amount);
    };


    const formatDate = (dateString: string) => {
        const date = parseISO(dateString);
        return {
            full: format(date, 'EEEE, MMMM do, yyyy'),
            relative: format(date, 'MMM dd, yyyy'),
            day: format(date, 'EEEE'),
            isToday: isToday(date),
            isPast: isPast(date),
        };
    };

    const calculateDuration = (startTime: string, endTime: string) => {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        
        const durationMinutes = endTotalMinutes - startTotalMinutes;
        
        if (durationMinutes < 60) {
            return `${durationMinutes} minutes`;
        }
        
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        if (minutes === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        }
        
        return `${hours}h ${minutes}m`;
    };

    const getTimeSlotType = (date: string, startTime: string) => {
        const slotDateTime = parseISO(`${date}T${startTime}`);
        const hour = slotDateTime.getHours();
        
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        if (hour < 21) return 'Evening';
        return 'Night';
    };

    if (state.loading && !timeSlot) {
        return <ServiceSkeleton />;
    }

    if (!timeSlot && !state.loading) {
        return <ServiceError />;
    }

    if (!timeSlot) return null;

    const dateInfo = formatDate(timeSlot.date);
    const statusConfig = getStatusConfig(timeSlot.isBooked, timeSlot.isActive, timeSlot.date);
    const StatusIcon = statusConfig?.icon || CheckCircle;
    const duration = calculateDuration(timeSlot.startTime, timeSlot.endTime);
    const timeSlotType = getTimeSlotType(timeSlot.date, timeSlot.startTime);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Link href="/admin/timeslots">
                        <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Go back to time slots">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Time Slot Details
                            </h1>
                            <Badge
                                variant={statusConfig?.variant}
                                className={cn("gap-1.5 font-medium", statusConfig?.className)}
                            >
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig?.label}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <Badge variant="outline" className="font-normal">
                                <Clock className="h-4 w-4" />
                                {timeSlotType} Slot
                            </Badge>
                            <span className="text-sm text-gray-500">
                                Slot ID: {timeSlot._id.toString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/time-slots/${id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Slot
                        </Button>
                    </Link>
                    <Link href={`/admin/bookings?timeSlot=${id}`}>
                        <Button size="sm" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            View Bookings
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full max-w-md">
                    <TabsTrigger value="details" className="flex-1 gap-2">
                        <Info className="h-4 w-4" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="related" className="flex-1 gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Related Info
                    </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Time & Date Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Time & Date</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-700">Slot Date</p>
                                            <p className="text-xl font-bold text-gray-900 mt-1">
                                                {dateInfo.full}
                                            </p>
                                            {dateInfo.isToday && (
                                                <Badge className="mt-2 bg-blue-500 text-white text-xs">
                                                    Today
                                                </Badge>
                                            )}
                                            {dateInfo.isPast && (
                                                <Badge className="mt-2 bg-gray-500 text-white text-xs">
                                                    Past Date
                                                </Badge>
                                            )}
                                        </div>
                                        <CalendarIcon className="h-8 w-8 text-blue-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600">Start Time</label>
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                            <ClockIcon className="h-4 w-4 text-gray-500" />
                                            <span className="font-mono font-medium">{timeSlot.startTime}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600">End Time</label>
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                            <ClockIcon className="h-4 w-4 text-gray-500" />
                                            <span className="font-mono font-medium">{timeSlot.endTime}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Duration</label>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium">{duration}</span>
                                        <Badge variant="outline">
                                            {timeSlotType}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status & Booking Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Status & Booking</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Booking Status</span>
                                        <Badge
                                            variant={statusConfig?.variant}
                                            className={cn("gap-1", statusConfig?.className)}
                                        >
                                            <StatusIcon className="h-3 w-3" />
                                            {statusConfig?.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Active Status</span>
                                        <Badge variant={timeSlot.isActive ? "default" : "destructive"}>
                                            {timeSlot.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Booked Count</span>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{timeSlot.bookedCount}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Admin Message</label>
                                    <Alert className="bg-gray-50 border-gray-200">
                                        <Info className="h-4 w-4" />
                                        <AlertDescription className="text-sm">
                                            {statusConfig?.adminMessage}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Service Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Service Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {timeSlot.serviceId ? (
                                    <>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <div className="flex items-start gap-3">
                                                <Package className="h-5 w-5 text-gray-600 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {timeSlot.serviceId.title || 'Service'}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {timeSlot.serviceId.description || 'No description'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-600">Price</label>
                                                <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-100">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    <span className="font-bold text-green-700">
                                                        {formatCurrency(timeSlot.serviceId.price)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-600">Duration</label>
                                                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-100">
                                                    <Clock className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">{timeSlot.serviceId.duration} min</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link href={`/admin/services/${timeSlot.serviceId._id}`}>
                                            <Button variant="outline" size="sm" className="w-full gap-2">
                                                <Eye className="h-4 w-4" />
                                                View Service Details
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                        <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-900">No Service Assigned</p>
                                        <p className="text-xs text-gray-500">Assign a service to this time slot</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Facility Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Facility</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {timeSlot.facilityId ? (
                                    <>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                            <Building className="h-5 w-5 text-gray-600" />
                                            <div>
                                                <p className="font-medium">{timeSlot.facilityId.name}</p>
                                                <p className="text-xs text-gray-500">Facility Name</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">Facility ID</label>
                                            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded block truncate">
                                                {timeSlot.facilityId._id}
                                            </code>
                                        </div>
                                        <Link href={`/admin/facilities/${timeSlot.facilityId._id}`}>
                                            <Button variant="outline" size="sm" className="w-full gap-2">
                                                <Eye className="h-4 w-4" />
                                                View Facility Details
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                        <Building className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-900">No Facility Assigned</p>
                                        <p className="text-xs text-gray-500">Assign a facility to this time slot</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Creator Information Card */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Created By</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {timeSlot.createdBy.name || 'Admin User'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">{timeSlot.createdBy.email}</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline">Creator</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Related Info Tab */}
                <TabsContent value="related" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Statistics Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Slot Statistics</CardTitle>
                                <CardDescription>Key metrics for this time slot</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <BarChart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-blue-700">Booking Status</p>
                                        <p className="text-lg font-bold mt-1">
                                            {timeSlot.isBooked ? 'Booked' : 'Available'}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                                        <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-green-700">Booked Count</p>
                                        <p className="text-lg font-bold mt-1">{timeSlot.bookedCount}</p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                                        <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-purple-700">Duration</p>
                                        <p className="text-lg font-bold mt-1">{duration.split(' ')[0]}</p>
                                    </div>
                                    <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                                        <TrendingUp className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-amber-700">Slot Type</p>
                                        <p className="text-lg font-bold mt-1">{timeSlotType}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Timeline</CardTitle>
                                <CardDescription>Creation and update history</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Created</p>
                                                <p className="text-xs text-gray-500">
                                                    {format(new Date(timeSlot.createdAt), 'MMM dd, yyyy • hh:mm a')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Edit className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Last Updated</p>
                                                <p className="text-xs text-gray-500">
                                                    {format(new Date(timeSlot.updatedAt), 'MMM dd, yyyy • hh:mm a')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                                <CardDescription>Manage this time slot</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Link href={`/admin/time-slots/${id}/edit`}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <Edit className="h-4 w-4" />
                                            Edit Time Slot
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/bookings/new?timeSlot=${id}`}>
                                        <Button className="w-full gap-2" disabled={timeSlot.isBooked || !timeSlot.isActive}>
                                            <Calendar className="h-4 w-4" />
                                            {timeSlot.isBooked ? 'Already Booked' : 'Create Booking'}
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/bookings?timeSlot=${id}`}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <Eye className="h-4 w-4" />
                                            View Related Bookings
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/services/${timeSlot.serviceId._id}`}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <Package className="h-4 w-4" />
                                            Go to Service
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Footer Actions */}
            <Card className="border">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    Slot Date: {dateInfo.relative} • {timeSlot.startTime} - {timeSlot.endTime}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Created {format(new Date(timeSlot.createdAt), 'MMM dd, yyyy')} • 
                                Last updated {format(new Date(timeSlot.updatedAt), 'MMM dd, yyyy • hh:mm a')}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href={`/admin/time-slots?date=${timeSlot.date.split('T')[0]}`}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Same Day Slots
                                </Button>
                            </Link>
                            <Link href={`/admin/time-slots?facility=${timeSlot.facilityId._id}`}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Building className="h-4 w-4" />
                                    Facility Slots
                                </Button>
                            </Link>
                            <Link href={`/admin/time-slots/${id}/edit`}>
                                <Button size="sm" className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Slot
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Error Alert */}
            {state.error && (
                <Alert variant="destructive">
                    <AlertTitle className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Error
                    </AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default TimeSlotDetailsView;