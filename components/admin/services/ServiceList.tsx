'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useService } from '@/context/admin/ServiceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Loader2, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Filter, 
  MoreVertical, 
  ChevronUp,
  Clock,
  Users,
  DollarSign,
  Tag,
  Building
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const ServiceList: React.FC = () => {
  const { state, getServices, deleteService, updateServiceStatus } = useService();
  const [facilities, setFacilities] = useState<Array<{_id: string, name: string}>>([]);

  const [search, setSearch] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Fetch facilities for filter dropdown
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch('/api/admin/facilities?limit=100');
        const data = await res.json();
        if (data.success) {
          setFacilities(data.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
      }
    };
    fetchFacilities();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Scroll to top handler
  const scrollToTop = () => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll to show/hide scroll top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch services when filters change
  useEffect(() => {
    const params: any = {
      page: 1,
      limit: 10,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (facilityFilter !== 'all') params.facilityId = facilityFilter;
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (statusFilter !== 'all') params.isActive = statusFilter === 'active';

    getServices(params);
    setTimeout(() => {
      scrollToTop();
    }, 100);
  }, [debouncedSearch, facilityFilter, categoryFilter, statusFilter]);

  const handleGetServices = async (params: any) => {
    await getServices(params);
    setTimeout(() => {
      scrollToTop();
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await updateServiceStatus(id, !currentStatus);
    } catch (error) {
      console.error('Failed to update service status:', error);
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const truncateText = (text?: string, maxLength: number = 50) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours}h`;
  };

  // Extract unique categories
  const categories = Array.from(new Set(state.services.map(s => s.category)));

  if (state.loading && state.services.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-gray-500">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={headerRef}>
      {/* Scroll to Top Button */}
      <Button
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full shadow-lg transition-all duration-300",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        onClick={scrollToTop}
        title="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-gray-500 mt-1">Manage services across your facilities</p>
        </div>
        <Link href="/admin/services/create">
          <Button className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardHeader className="pb-3 border-b bg-gray-50/50">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                Service Management
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="hidden sm:inline">Total:</span>
                <Badge variant="secondary" className="font-medium">
                  {state.pagination.total} services
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, description, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            <div className='flex items-center justify-start sm:justify-end gap-x-3'>
                
              <Select  value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger className="bg-white w-full sm:w-fit border-gray-200">
                  <SelectValue placeholder="Filter by facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilities.map(facility => (
                    <SelectItem key={facility._id} value={facility._id}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white sm:w-fit w-full border-gray-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Error Message */}
          {state.error && (
            <div className="m-6 mb-0 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-3">
              <div className="h-2 w-2 bg-rose-500 rounded-full shrink-0"></div>
              <span className="text-sm">{state.error}</span>
            </div>
          )}

          {/* Services Table */}
          <div className="overflow-x-auto px-4" ref={tableContainerRef}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Service</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Facility</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Category</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Details</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Created</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
                        <div className="rounded-full bg-gray-100 p-4">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">No services found</h3>
                          <p className="text-gray-500 mt-1 text-sm">
                            {debouncedSearch || facilityFilter !== 'all' || categoryFilter !== 'all'
                              ? 'Try adjusting your search or filters'
                              : 'Get started by adding your first service'}
                          </p>
                        </div>
                        {!debouncedSearch && facilityFilter === 'all' && categoryFilter === 'all' && (
                          <Link href="/admin/services/create">
                            <Button variant="outline" className="gap-2">
                              <Plus className="h-4 w-4" />
                              Add First Service
                            </Button>
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  state.services.map((service) => (
                    <TableRow
                      key={service._id.toString()}
                      className="hover:bg-gray-50/50 group transition-colors"
                    >
                      <TableCell className="max-w-[250px]">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 truncate" title={service.title}>
                            {truncateText(service.title, 30)}
                          </div>
                          {service.description && (
                            <div
                              className="text-sm text-gray-500 line-clamp-1"
                              title={service.description}
                            >
                              {truncateText(service.description, 50)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="max-w-[150px]">
                        <div className="flex items-start gap-2">
                          <Building className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {service.facilityId?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          <Tag className="h-3 w-3 mr-1" />
                          {service.category}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span className="text-sm font-medium">
                              PKR {service.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatDuration(service.duration)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {service.capacity} capacity
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.isActive}
                            onCheckedChange={() => handleStatusToggle(service._id.toString(), service.isActive)}
                            disabled={state.loading}
                          />
                          <Badge
                            variant={service.isActive ? "default" : "secondary"}
                            className={`font-medium text-xs px-2 py-1 ${
                              service.isActive 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {service.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {formatDate(service.createdAt)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {/* Desktop Actions */}
                          <div className="hidden sm:flex gap-1">
                            <Link href={`/admin/services/${service._id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/services/${service._id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Edit service"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              onClick={() => handleDelete(service._id.toString())}
                              disabled={state.loading}
                              title="Delete service"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Mobile Actions Dropdown */}
                          <div className="sm:hidden">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/services/${service._id}`} className="cursor-pointer">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/services/${service._id}/edit`} className="cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Service
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                                  onClick={() => handleDelete(service._id.toString())}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {state.pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t bg-gray-50/50">
              <div className="text-sm text-gray-500">
                Showing{' '}
                <span className="font-medium text-gray-900">
                  {(state.pagination.page - 1) * state.pagination.limit + 1}-
                  {Math.min(state.pagination.page * state.pagination.limit, state.pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium text-gray-900">{state.pagination.total}</span>{' '}
                services
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGetServices({ page: state.pagination.page - 1 })}
                  disabled={state.pagination.page === 1 || state.loading}
                  className="h-8 gap-1"
                >
                  Previous
                </Button>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: state.pagination.totalPages }, (_, i) => i + 1)
                    .filter(page =>
                      page === 1 ||
                      page === state.pagination.totalPages ||
                      (page >= state.pagination.page - 1 && page <= state.pagination.page + 1)
                    )
                    .map((page, index, array) => {
                      if (index > 0 && page > array[index - 1] + 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <span className="px-1 text-gray-400">...</span>
                            <Button
                              variant={state.pagination.page === page ? "default" : "outline"}
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleGetServices({ page })}
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        );
                      }
                      return (
                        <Button
                          key={page}
                          variant={state.pagination.page === page ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0 min-w-8"
                          onClick={() => handleGetServices({ page })}
                        >
                          {page}
                        </Button>
                      );
                    })}
                </div>
                <div className="sm:hidden text-sm text-gray-600 px-3">
                  Page {state.pagination.page} of {state.pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGetServices({ page: state.pagination.page + 1 })}
                  disabled={state.pagination.page === state.pagination.totalPages || state.loading}
                  className="h-8 gap-1"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Loading overlay for table data */}
          {state.loading && state.services.length > 0 && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceList;