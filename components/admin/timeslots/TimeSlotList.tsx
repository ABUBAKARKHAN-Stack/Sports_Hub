'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Calendar,
    Clock,
    Users,
    Building,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Plus,
    Grid3x3,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertCircle,
    CheckSquare,
    Square,
    Loader2,
    User,
    Tag,
    CalendarDays,
    CheckCheck,
    X
} from 'lucide-react';
import { useTimeSlot, useTimeSlotAccess } from '@/context/admin/TimeSlotContext';
import { useToasts } from '@/hooks/toastNotifications';
import { format, parseISO, isPast, isToday } from 'date-fns';
import Link from 'next/link';
import debounce from 'lodash/debounce';

interface TimeSlotListProps {
    facilityId?: string;
    serviceId?: string;
    showFilters?: boolean;
    showActions?: boolean;
    onSelect?: (timeslot: any) => void;
    mode?: 'public' | 'admin' | 'booking';
}

export default function TimeSlotList({
    facilityId,
    serviceId,
    showFilters = true,
    showActions = true,
    onSelect,
    mode = 'admin'
}: TimeSlotListProps) {
    const { state, getTimeSlots, getPublicTimeSlots, deleteTimeSlot, updateTimeSlotStatus, deleteBulkTimeSlots } = useTimeSlot();
    const { can } = useTimeSlotAccess();
    const { successToast, errorToast } = useToasts();

    const [filters, setFilters] = useState({
        date: '',
        isActive: '',
        isBooked: '',
        sortBy: 'date',
        sortOrder: 'asc' as 'asc' | 'desc',
    });

    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const lastRequestRef = useRef<{
        filters: string;
        page: number;
        limit: number;
        facilityId?: string;
        serviceId?: string;
    } | null>(null);

    // Simple filter handler
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Load timeslots with request deduplication
    const loadTimeSlots = useCallback(async (isInitial = false) => {
        const currentParams = {
            page: isInitial ? 1 : state.pagination.page,
            limit: state.pagination.limit,
            ...filters,
            ...(facilityId && { facilityId }),
            ...(serviceId && { serviceId }),
        };

        // Clean empty filters
        const cleanParams: Record<string, any> = {};
        Object.entries(currentParams).forEach(([key, value]) => {
            if (value !== '' && value !== 'all' && value !== undefined) {
                cleanParams[key] = value;
            }
        });

        // Create request signature for deduplication
        const requestSignature = JSON.stringify({
            ...cleanParams,
            page: currentParams.page
        });

        // Skip if same request is in progress
        if (lastRequestRef.current?.filters === requestSignature) {
            return;
        }

        lastRequestRef.current = {
            filters: requestSignature,
            page: currentParams.page,
            limit: currentParams.limit,
            facilityId,
            serviceId
        };

        try {
            setIsLoading(true);

            if (mode === 'public') {
                await getPublicTimeSlots(cleanParams);
            } else {
                await getTimeSlots(cleanParams);
            }
        } catch (error) {
            errorToast('Failed to load timeslots');
        } finally {
            setIsLoading(false);
        }
    }, [filters, state.pagination.page, state.pagination.limit, facilityId, serviceId, mode, getTimeSlots, getPublicTimeSlots]);

    // Force refresh timeslots (resets to page 1)
    const forceRefresh = useCallback(async () => {
        lastRequestRef.current = null;
        await loadTimeSlots(true);
    }, [loadTimeSlots]);

    // Update the page change handler to prevent immediate UI update
    const handlePageChange = useCallback((page: number) => {
        setIsLoading(true);

        const params: any = {
            page,
            limit: state.pagination.limit,
            ...filters,
            ...(facilityId && { facilityId }),
            ...(serviceId && { serviceId }),
        };

        // Clean params
        const cleanParams: Record<string, any> = {};
        Object.entries(params).forEach(([key, value]) => {
            if (value !== '' && value !== 'all' && value !== undefined) {
                cleanParams[key] = value;
            }
        });

        // Update data
        if (mode === 'public') {
            getPublicTimeSlots(cleanParams).finally(() => setIsLoading(false));
        } else {
            getTimeSlots(cleanParams).finally(() => setIsLoading(false));
        }
    }, [state.pagination.limit, filters, facilityId, serviceId, mode, getPublicTimeSlots, getTimeSlots]);

    // Load timeslots when filters change (with debounce)
    useEffect(() => {
        const debouncedLoad = debounce(() => {
            loadTimeSlots(true); // Reset to page 1 on filter change
        }, 300);

        debouncedLoad();

        return () => {
            debouncedLoad.cancel();
        };
    }, [filters, facilityId, serviceId]);

    // Load timeslots on page change
    useEffect(() => {
        if (state.pagination.page > 1) {
            loadTimeSlots();
        }
    }, [state.pagination.page]);

    // Initial load
    useEffect(() => {
        loadTimeSlots(true);

        return () => {
            lastRequestRef.current = null;
        };
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this timeslot?')) {
            return;
        }

        try {
            await deleteTimeSlot(id);
            successToast('Timeslot deleted successfully');
            await forceRefresh();
        } catch (error) {
            errorToast('Failed to delete timeslot');
        }
    };

    const handleStatusChange = async (id: string, isActive: boolean) => {
        try {
            await updateTimeSlotStatus(id, isActive);
            await forceRefresh();
        } catch (error) {
            errorToast('Failed to update timeslot status');
        }
    };

    const handleSelectAll = () => {
        if (selectedRows.length === state.timeslots.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(state.timeslots.map(t => t._id!).filter(Boolean));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (!selectedRows.length) return;

        if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} timeslots?`)) {
            return;
        }

        try {
            await deleteBulkTimeSlots(selectedRows);
            setSelectedRows([]);

            //* Force refresh with current page calculation
            const currentParams = {
                page: state.pagination.page,
                limit: state.pagination.limit,
                ...filters,
                ...(facilityId && { facilityId }),
                ...(serviceId && { serviceId }),
            };

            // Clean empty filters
            const cleanParams: Record<string, any> = {};
            Object.entries(currentParams).forEach(([key, value]) => {
                if (value !== '' && value !== 'all' && value !== undefined) {
                    cleanParams[key] = value;
                }
            });

            // Reset the last request ref
            lastRequestRef.current = null;

            // If we're on page 1, just refresh
            if (state.pagination.page === 1) {
                await loadTimeSlots(true);
            } else {
                // If we're on another page and after deletion there might be fewer pages,
                // we need to check if we should go back a page
                const totalAfterDeletion = state.pagination.total - selectedRows.length;
                const currentPageSize = state.pagination.limit;
                const totalPagesAfterDeletion = Math.ceil(totalAfterDeletion / currentPageSize);

                // If current page is greater than total pages after deletion, go to last page
                if (state.pagination.page > totalPagesAfterDeletion) {
                    await loadTimeSlots(true); // This will reset to page 1
                } else {
                    // Stay on current page
                    setIsLoading(true);
                    if (mode === 'public') {
                        await getPublicTimeSlots(cleanParams);
                    } else {
                        await getTimeSlots(cleanParams);
                    }
                    setIsLoading(false);
                }
            }
        } catch (error) {
            errorToast('Failed to delete timeslots');
        }
    };

    const formatTimeDisplay = (startTime: string, endTime: string) => {
        return `${startTime} - ${endTime}`;
    };

    const getStatusBadge = (timeslot: any) => {
        if (!timeslot.isActive) {
            return <Badge variant="secondary">Inactive</Badge>;
        }

        if (timeslot.isBooked) {
            return <Badge variant="destructive">Booked</Badge>;
        }

        if (timeslot.bookedCount > 0) {
            return <Badge variant="default">Partially Booked</Badge>;
        }

        return <Badge variant="outline">Available</Badge>;
    };

    const isTimeslotExpired = (date: string, startTime: string) => {
        try {
            const timeslotDateTime = parseISO(`${date}T${startTime}`);
            return isPast(timeslotDateTime);
        } catch (error) {
            return false;
        }
    };

    const isTimeslotToday = (date: string) => {
        try {
            return isToday(parseISO(date));
        } catch (error) {
            return false;
        }
    };

    const getFacilityName = (facilityId: any) => {
        if (typeof facilityId === 'object' && facilityId !== null && 'name' in facilityId) {
            return facilityId.name;
        }
        return 'N/A';
    };

    const getServiceInfo = (serviceId: any) => {
        if (typeof serviceId === 'object' && serviceId !== null) {
            return {
                title: 'title' in serviceId ? serviceId.title : 'N/A',
                price: 'price' in serviceId ? serviceId.price : 0,
                duration: 'duration' in serviceId ? serviceId.duration : 0
            };
        }
        return { title: 'N/A', price: 0, duration: 0 };
    };

    const allSelected = selectedRows.length === state.timeslots.length && state.timeslots.length > 0;
    const showEmptyState = !isLoading && state.timeslots.length === 0;
    const hasFilters = filters.date || filters.isActive || filters.isBooked;

    return (
        <div className="space-y-6">
            {/* Header and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Timeslots</h1>
                    <p className="text-gray-500">
                        {isLoading ? 'Loading...' : `${state.pagination.total} timeslots found`}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {can('create') && (
                        <>
                            <Button asChild>
                                <Link href="/admin/timeslots/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Timeslot
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/admin/timeslots/bulk">
                                    <Grid3x3 className="h-4 w-4 mr-2" />
                                    Bulk Create
                                </Link>
                            </Button>
                        </>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => forceRefresh()}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <Card>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Filter className="size-6" />
                                <span className="text-xl font-semibold">Filters</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className='w-full'>
                                    <label className="text-sm font-medium mb-1 block">Date</label>
                                    <Input
                                        type="date"
                                        value={filters.date}
                                        onChange={(e) => handleFilterChange('date', e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className='w-full'>
                                    <label className="text-sm font-medium mb-1 block">Status</label>
                                    <Select
                                        value={filters.isActive}
                                        onValueChange={(value) => handleFilterChange('isActive', value)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='w-full'>
                                    <label className="text-sm font-medium mb-1 block">Booking Status</label>
                                    <Select
                                        value={filters.isBooked}
                                        onValueChange={(value) => handleFilterChange('isBooked', value)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="All booking statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="false">Available</SelectItem>
                                            <SelectItem value="true">Booked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bulk Actions */}
            {selectedRows.length > 0 && can('delete') && (
                <Card className="bg-amber-50 border-amber-200">
                    <CardContent >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                <span className="font-medium">
                                    {selectedRows.length} timeslot(s) selected
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                    className="text-destructive"
                                    disabled={isLoading}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Selected
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedRows([])}
                                    disabled={isLoading}
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Timeslots Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Timeslots List</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && state.timeslots.length === 0 ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : showEmptyState ? (
                        <div className="text-center py-12">
                            <Calendar className="h-16 w-16 mx-auto text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium">No timeslots found</h3>
                            <p className="text-gray-500 mt-1">
                                {hasFilters ? 'Try changing your filters' : 'Create your first timeslot'}
                            </p>
                            {can('create') && (
                                <Button asChild className="mt-6">
                                    <Link href="/admin/timeslots/create">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Timeslot
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {can('delete') && (
                                                <TableHead className="w-12">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={handleSelectAll}
                                                        disabled={isLoading}
                                                    >
                                                        {allSelected ? (
                                                            <CheckSquare className="h-4 w-4" />
                                                        ) : (
                                                            <Square className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                            )}
                                            <TableHead className="w-1/4">Date & Time</TableHead>
                                            <TableHead>Facility</TableHead>
                                            <TableHead>Service</TableHead>
                                            <TableHead>Bookings</TableHead>
                                            <TableHead>Status</TableHead>
                                            {showActions && <TableHead className="text-right">Actions</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {state.timeslots.map((timeslot) => {
                                            const serviceInfo = getServiceInfo(timeslot.serviceId);
                                            const isExpired = isTimeslotExpired(timeslot.date.toString(), timeslot.startTime);
                                            const isTodaySlot = isTimeslotToday(timeslot.date.toString());

                                            return (
                                                <TableRow
                                                    key={timeslot._id}
                                                    className={`
                                                        ${selectedRows.includes(timeslot._id!) ? 'bg-blue-50' : ''}
                                                        ${!timeslot.isActive ? 'opacity-60' : ''}
                                                        ${onSelect ? 'cursor-pointer hover:bg-gray-50' : ''}
                                                    `}
                                                    onClick={() => onSelect && timeslot.isActive && !timeslot.isBooked && !isExpired && onSelect(timeslot)}
                                                >
                                                    {can('delete') && (
                                                        <TableCell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRows.includes(timeslot._id!)}
                                                                onChange={() => handleSelectRow(timeslot._id!)}
                                                                className="rounded border-gray-300"
                                                                onClick={(e) => e.stopPropagation()}
                                                                disabled={isLoading}
                                                            />
                                                        </TableCell>
                                                    )}
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <CalendarDays className="h-4 w-4 text-gray-400" />
                                                                <span className={`font-medium ${isTodaySlot ? 'text-blue-600' : ''}`}>
                                                                    {format(new Date(timeslot.date), 'MMM dd, yyyy')}
                                                                    {isTodaySlot && <span className="ml-1 text-xs text-blue-500">(Today)</span>}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-sm text-gray-500 pl-6">
                                                                <Clock className="h-3 w-3" />
                                                                {formatTimeDisplay(timeslot.startTime, timeslot.endTime)}
                                                            </div>
                                                            {isExpired && (
                                                                <div className="text-xs text-red-500 pl-6">
                                                                    <X className="h-3 w-3 inline mr-1" />
                                                                    Expired
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Building className="h-4 w-4 text-gray-400" />
                                                            <span className="truncate">{getFacilityName(timeslot.facilityId)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="font-medium truncate">{serviceInfo.title}</div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Tag className="h-3 w-3" />
                                                                <span>Rs {serviceInfo.price}</span>
                                                                <span>•</span>
                                                                <span>{serviceInfo.duration} min</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-gray-400" />
                                                            <div className="space-y-1">
                                                                <span className={`font-medium ${timeslot.isBooked ? 'text-red-600' : ''}`}>
                                                                    {timeslot.isBooked ? 'Booked' : `Available (${timeslot.bookedCount})`}
                                                                </span>
                                                                {timeslot.bookedCount > 0 && !timeslot.isBooked && (
                                                                    <div className="text-xs text-gray-500">
                                                                        {timeslot.bookedCount} booking(s)
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(timeslot)}
                                                    </TableCell>
                                                    {showActions && (
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                    <Button variant="ghost" size="sm" disabled={isLoading}>
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/admin/timeslots/${timeslot._id}`}>
                                                                            <Eye className="h-4 w-4 mr-2" />
                                                                            View Details
                                                                        </Link>
                                                                    </DropdownMenuItem>

                                                                    {can('edit') && (
                                                                        <DropdownMenuItem asChild>
                                                                            <Link href={`/admin/timeslots/${timeslot._id}/edit`}>
                                                                                <Edit className="h-4 w-4 mr-2" />
                                                                                Edit
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {mode === 'public' && timeslot.isActive && !timeslot.isBooked && !isExpired && (
                                                                        <DropdownMenuItem onClick={() => onSelect && onSelect(timeslot)}>
                                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                                            Book Now
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {can('edit') && (
                                                                        <DropdownMenuItem
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleStatusChange(timeslot._id!, !timeslot.isActive);
                                                                            }}
                                                                        >
                                                                            {timeslot.isActive ? (
                                                                                <>
                                                                                    <XCircle className="h-4 w-4 mr-2" />
                                                                                    Deactivate
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                                    Activate
                                                                                </>
                                                                            )}
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {can('delete') && (
                                                                        <DropdownMenuItem
                                                                            className="text-destructive"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDelete(timeslot._id!);
                                                                            }}
                                                                        >
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {state.pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-500">
                                        Showing {((state.pagination.page - 1) * state.pagination.limit) + 1} to{' '}
                                        {Math.min(state.pagination.page * state.pagination.limit, state.pagination.total)} of{' '}
                                        {state.pagination.total} timeslots
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(Math.max(1, state.pagination.page - 1))}
                                            disabled={state.pagination.page === 1 || isLoading}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <span className="text-sm">
                                            Page {state.pagination.page} of {state.pagination.totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(Math.min(state.pagination.totalPages, state.pagination.page + 1))}
                                            disabled={state.pagination.page === state.pagination.totalPages || isLoading}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}