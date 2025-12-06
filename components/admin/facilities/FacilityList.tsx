'use client';

import React, { useState, useEffect } from 'react';
import { useFacility } from '@/context/admin/FacilityContext';
import { FacilityStatusEnum } from '@/types/main.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

const FacilityList: React.FC = () => {
  const { state, getFacilities, deleteFacility } = useFacility();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  //* Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  //* Fetch facilities when filters change
  useEffect(() => {
    const params: any = {
      page: 1,
      limit: 10,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    getFacilities(params);
  }, [debouncedSearch, statusFilter, getFacilities]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      try {
        await deleteFacility(id);
      } catch (error) {
        console.error('Failed to delete facility:', error);
      }
    }
  };

  const getStatusBadge = (status: FacilityStatusEnum) => {
    const variants = {
      [FacilityStatusEnum.PENDING]: 'bg-yellow-100 text-yellow-800',
      [FacilityStatusEnum.APPROVED]: 'bg-green-100 text-green-800',
      [FacilityStatusEnum.REJECTED]: 'bg-red-100 text-red-800',
      [FacilityStatusEnum.SUSPENDED]: 'bg-gray-100 text-gray-800',
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  if (state.loading && state.facilities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Facilities Management</CardTitle>
          <Link href="/admin/facilities/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Facility
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search facilities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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

        {/* Error Message */}
        {state.error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {state.error}
          </div>
        )}

        {/* Facilities Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.facilities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No facilities found
                  </TableCell>
                </TableRow>
              ) : (
                state.facilities.map((facility) => (
                  <TableRow key={facility._id.toString()}>
                    <TableCell className="font-medium">{facility.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{facility.location.address}</div>
                        <div className="text-gray-500">{facility.location.city}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{facility.contact.phone}</div>
                        <div className="text-gray-500">{facility.contact.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(facility.status)}>
                        {facility.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {facility.services?.length || 0} services
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(facility.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/facilities/${facility._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/facilities/${facility._id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(facility._id.toString())}
                          disabled={state.loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {state.facilities.length} of {state.pagination.total} facilities
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => getFacilities({ page: state.pagination.page - 1 })}
                disabled={state.pagination.page === 1 || state.loading}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {state.pagination.page} of {state.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => getFacilities({ page: state.pagination.page + 1 })}
                disabled={state.pagination.page === state.pagination.totalPages || state.loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FacilityList;