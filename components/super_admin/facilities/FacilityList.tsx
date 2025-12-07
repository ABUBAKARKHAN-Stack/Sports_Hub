'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FacilityStatusEnum } from '@/types/main.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Eye, MapPin, Phone, Mail, Calendar, Filter, MoreVertical, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useSuperAdminFacility } from '@/context/super-admin/SuperAdminFacilityContext';

const FacilityList: React.FC = () => {
  const { state, getFacilities } = useSuperAdminFacility();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  //* Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  //* Scroll to top handler
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

  //* Handle scroll to show/hide scroll top button
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

  //* Fetch facilities when filters change
  useEffect(() => {
    const params: any = {
      page: 1,
      limit: 10,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter !== 'all') params.status = statusFilter;

    getFacilities(params);
    //* Scroll to top on filter change
    setTimeout(() => {
      scrollToTop();
    }, 100);
  }, [debouncedSearch, statusFilter]);

  const handleGetFacilities = async (params: any) => {
    await getFacilities(params);
    //* Scroll to top after fetching new data
    setTimeout(() => {
      scrollToTop();
    }, 100);
  };

  const getStatusBadge = (status: FacilityStatusEnum) => {
    const variants = {
      [FacilityStatusEnum.PENDING]: {
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'Pending'
      },
      [FacilityStatusEnum.APPROVED]: {
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        label: 'Approved'
      },
      [FacilityStatusEnum.REJECTED]: {
        className: 'bg-rose-50 text-rose-700 border-rose-200',
        label: 'Rejected'
      },
      [FacilityStatusEnum.SUSPENDED]: {
        className: 'bg-gray-50 text-gray-700 border-gray-200',
        label: 'Suspended'
      },
    };
    return variants[status] || { className: 'bg-gray-50 text-gray-700 border-gray-200', label: status };
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const truncateText = (text?: string, maxLength?: number) => {
    if (!text) return "N/A"
    if (text.length <= maxLength!) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (state.loading && state.facilities.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-gray-500">Loading facilities...</p>
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
          "fixed bottom-6 bg-primary right-6 z-50 h-10 w-10 rounded-full shadow-lg transition-all duration-300",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        onClick={scrollToTop}
        title="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facilities</h1>
          <p className="text-gray-500 mt-1">View and manage all facility listings</p>
        </div>
      </div>

      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardHeader className="pb-3 border-b bg-gray-50/50">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                Facility Overview
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="hidden sm:inline">Total:</span>
                <Badge variant="secondary" className="font-medium">
                  {state.pagination.total} facilities
                </Badge>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, location, or contact..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus-visible:ring-primary/20"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={FacilityStatusEnum.PENDING}>Pending</SelectItem>
                  <SelectItem value={FacilityStatusEnum.APPROVED}>Approved</SelectItem>
                  <SelectItem value={FacilityStatusEnum.REJECTED}>Rejected</SelectItem>
                  <SelectItem value={FacilityStatusEnum.SUSPENDED}>Suspended</SelectItem>
                </SelectContent>
              </Select>
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

          {/* Facilities Table */}
          <div className="overflow-x-auto px-4" ref={tableContainerRef}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Facility</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Location</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Contact</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Services</TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Created</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.facilities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
                        <div className="rounded-full bg-gray-100 p-4">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">No facilities found</h3>
                          <p className="text-gray-500 mt-1 text-sm">
                            {debouncedSearch || statusFilter !== 'all'
                              ? 'Try adjusting your search or filters'
                              : 'No facilities have been registered yet'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  state.facilities.map((facility) => {
                    const statusInfo = getStatusBadge(facility.status);
                    return (
                      <TableRow
                        key={facility._id.toString()}
                        className="hover:bg-gray-50/50 group transition-colors"
                      >
                        <TableCell className="max-w-[250px]">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900 truncate" title={facility.name}>
                              {truncateText(facility.name, 40)}
                            </div>
                            {facility.description && (
                              <div
                                className="text-sm text-gray-500 line-clamp-1"
                                title={facility.description}
                              >
                                {truncateText(facility.description, 60)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="space-y-1">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <div
                                  className="text-sm font-medium text-gray-900 truncate"
                                  title={facility.location.city}
                                >
                                  {truncateText(facility.location.city, 20)}
                                </div>
                                <div
                                  className="text-xs text-gray-500 truncate"
                                  title={facility.location.address}
                                >
                                  {truncateText(facility.location.address, 30)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                              <span
                                className="text-sm font-medium truncate"
                                title={facility.contact.phone}
                              >
                                {facility.contact.phone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                              <span
                                className="text-xs text-gray-500 truncate"
                                title={facility.contact.email}
                              >
                                {truncateText(facility.contact.email, 25)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`font-medium text-xs px-2 py-1 ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900 font-medium flex items-center gap-1">
                            <span>{facility.services?.length || 0}</span>
                            <span className="text-gray-500 font-normal text-xs">services</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {formatDate(facility.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            {/* Desktop Actions */}
                            <div className="hidden sm:flex gap-1">
                              <Link href={`/super-admin/facilities/${facility._id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
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
                                    <Link href={`/super-admin/facilities/${facility._id}`} className="cursor-pointer">
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
                facilities
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGetFacilities({ page: state.pagination.page - 1 })}
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
                              onClick={() => handleGetFacilities({ page })}
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
                          onClick={() => handleGetFacilities({ page })}
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
                  onClick={() => handleGetFacilities({ page: state.pagination.page + 1 })}
                  disabled={state.pagination.page === state.pagination.totalPages || state.loading}
                  className="h-8 gap-1"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Loading overlay for table data */}
          {state.loading && state.facilities.length > 0 && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityList;