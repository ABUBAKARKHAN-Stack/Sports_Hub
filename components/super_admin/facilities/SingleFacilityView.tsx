'use client';

import React, { useEffect, useState } from 'react';
import { useFacility } from '@/context/admin/FacilityContext';
import { FacilityStatusEnum, type IFacility } from '@/types/main.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Loader2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  ArrowLeft,
  ExternalLink,
  FileText,
  Activity,
  Settings,
  Globe,
  Star,
  PhoneCall,
  Video,
  Image as ImageIcon,
  Clock as ClockIcon,
  Map,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SingleFacilityViewProps {
  id: string;
}

const SingleFacilityView: React.FC<SingleFacilityViewProps> = ({ id }) => {
  const { state, getFacilityById, updateFacilityStatus } = useFacility();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      getFacilityById(id);
    }
  }, [id]);

  

  const facility = state.currentFacility;
  console.log(facility);
  

  const getStatusConfig = (status: FacilityStatusEnum) => {
    const configs = {
      [FacilityStatusEnum.PENDING]: {
        icon: Clock,
        variant: 'outline' as const,
        className: 'border-amber-200 bg-amber-50 text-amber-700',
        label: 'Pending Review',
        description: 'Facility is awaiting approval',
        action: 'Approve Facility',
        actionVariant: 'default' as const,
      },
      [FacilityStatusEnum.APPROVED]: {
        icon: CheckCircle,
        variant: 'outline' as const,
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        label: 'Active',
        description: 'Facility is approved and active',
        action: 'Suspend Facility',
        actionVariant: 'destructive' as const,
      },
      [FacilityStatusEnum.REJECTED]: {
        icon: XCircle,
        variant: 'outline' as const,
        className: 'border-rose-200 bg-rose-50 text-rose-700',
        label: 'Rejected',
        description: 'Facility application was rejected',
        action: 'Review Again',
        actionVariant: 'outline' as const,
      },
      [FacilityStatusEnum.SUSPENDED]: {
        icon: Shield,
        variant: 'outline' as const,
        className: 'border-gray-200 bg-gray-50 text-gray-700',
        label: 'Suspended',
        description: 'Facility is temporarily suspended',
        action: 'Reactivate',
        actionVariant: 'default' as const,
      },
    };
    return configs[status];
  };

  const handleStatusUpdate = async (newStatus: FacilityStatusEnum) => {
    if (facility && confirm(`Are you sure you want to ${newStatus.toLowerCase()} this facility?`)) {
      try {
        await updateFacilityStatus(facility._id.toString(), newStatus);
      } catch (error) {
        console.error('Failed to update facility status:', error);
      }
    }
  };

  const getNextStatusAction = (currentStatus: FacilityStatusEnum) => {
    switch (currentStatus) {
      case FacilityStatusEnum.PENDING:
        return { status: FacilityStatusEnum.APPROVED, action: 'Approve' };
      case FacilityStatusEnum.APPROVED:
        return { status: FacilityStatusEnum.SUSPENDED, action: 'Suspend' };
      case FacilityStatusEnum.SUSPENDED:
        return { status: FacilityStatusEnum.APPROVED, action: 'Reactivate' };
      case FacilityStatusEnum.REJECTED:
        return { status: FacilityStatusEnum.PENDING, action: 'Review Again' };
      default:
        return { status: FacilityStatusEnum.APPROVED, action: 'Approve' };
    }
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'PPP');
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'hh:mm a');
  };

  const getDayName = (day: string) => {
    return day;
  };

  if (state.loading && !facility) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!facility && !state.loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <Building className="h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-900">Facility Not Found</h2>
          <p className="text-gray-500 max-w-md">
            The facility you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/admin/facilities">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Facilities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!facility) return null;

  const statusConfig = getStatusConfig(facility.status);
  const StatusIcon = statusConfig?.icon || Shield;
  const nextStatusAction = getNextStatusAction(facility.status);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/facilities">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{facility.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={statusConfig?.variant}
                className={cn("gap-1.5 font-medium", statusConfig?.className)}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig?.label}
              </Badge>
              <span className="text-sm text-gray-500">ID: {facility._id.toString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => handleStatusUpdate(nextStatusAction.status)}
            disabled={state.loading}
          >
            {state.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              statusConfig?.icon && <StatusIcon className="h-4 w-4" />
            )}
            {nextStatusAction.action}
          </Button>
          <Link href={`/admin/facilities/${id}/edit`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Facility
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="gallery" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="hours" className="gap-2">
                <ClockIcon className="h-4 w-4" />
                Hours
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Facility Name</label>
                      <p className="text-sm font-medium">{facility.name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Admin ID</label>
                      <p className="text-sm font-medium font-mono">{facility.adminId.toString()}</p>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-sm text-gray-600">
                        {facility.description || 'No description provided'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm font-medium">{facility.location.address || 'N/A'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <p className="text-sm font-medium">{facility.location.city || 'N/A'}</p>
                    </div>
                    {facility.location.coordinates && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Latitude</label>
                          <p className="text-sm font-medium font-mono">
                            {facility.location.coordinates.lat.toFixed(6)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Longitude</label>
                          <p className="text-sm font-medium font-mono">
                            {facility.location.coordinates.lng.toFixed(6)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  {facility.location.coordinates && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Map className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Coordinates</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <code>
                          {facility.location.coordinates.lat}, {facility.location.coordinates.lng}
                        </code>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneCall className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </label>
                      <p className="text-sm font-medium">{facility.contact.phone || 'N/A'}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <p className="text-sm font-medium">{facility.contact.email || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Services
                  </CardTitle>
                  <CardDescription>
                    {facility.services?.length || 0} service(s) associated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {facility.services && facility.services.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {facility.services.map((serviceId, index) => (
                          <Badge key={index} variant="outline" className="justify-center py-2">
                            <span className="truncate font-mono text-xs">
                              {serviceId.toString()}
                            </span>
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-3">
                        These are service IDs. Click 'Edit Facility' to manage services.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                      <Settings className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No Services</h3>
                      <p className="text-gray-500 mt-1">No services have been added yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Gallery & Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Images */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Images</h3>
                      <Badge variant="secondary">
                        {facility.gallery?.images?.length || 0} images
                      </Badge>
                    </div>
                    {facility.gallery?.images && facility.gallery.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {facility.gallery.images.map((imageUrl, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group"
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                              Image {index + 1}
                            </div>
                            <a
                              href={imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
                            >
                              <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
                        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Images</h3>
                        <p className="text-gray-500 mt-1">No images have been uploaded yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Video */}
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium">Introductory Video</h3>
                    </div>
                    {facility.gallery?.introductoryVideo ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                        <a
                          href={facility.gallery.introductoryVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors"
                        >
                          <ExternalLink className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                          Introductory Video
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                        <Video className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Video</h3>
                        <p className="text-gray-500 mt-1">No introductory video has been uploaded yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Opening Hours Tab */}
            <TabsContent value="hours" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5" />
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {facility.openingHours && facility.openingHours.length > 0 ? (
                      <div className="space-y-3">
                        {facility.openingHours.map((schedule, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex items-center justify-between p-4 border rounded-lg",
                              schedule.isClosed
                                ? "border-gray-200 bg-gray-50"
                                : "border-emerald-200 bg-emerald-50/30"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  schedule.isClosed ? "bg-gray-400" : "bg-emerald-500"
                                )}
                              />
                              <span className="font-medium min-w-28">{schedule.day}</span>
                            </div>
                            <div className="text-right">
                              {schedule.isClosed ? (
                                <Badge variant="outline" className="bg-white">
                                  Closed
                                </Badge>
                              ) : (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium">
                                    {formatTime(schedule.openingTime)} - {formatTime(schedule.closingTime)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {schedule.openingTime} - {schedule.closingTime}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
                        <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Hours Set</h3>
                        <p className="text-gray-500 mt-1">Opening hours have not been configured.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Status & Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Status</span>
                  <Badge
                    variant={statusConfig?.variant}
                    className={cn("gap-1.5", statusConfig?.className)}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig?.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{statusConfig?.description}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <span className="text-sm font-medium">Quick Actions</span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(FacilityStatusEnum.APPROVED)}
                    disabled={facility.status === FacilityStatusEnum.APPROVED || state.loading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(FacilityStatusEnum.REJECTED)}
                    disabled={facility.status === FacilityStatusEnum.REJECTED || state.loading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(FacilityStatusEnum.SUSPENDED)}
                    disabled={facility.status === FacilityStatusEnum.SUSPENDED || state.loading}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                  <Link href={`/admin/facilities/${id}/edit`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created</span>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{formatDate(facility.createdAt)}</div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(facility.createdAt), 'p')}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{formatDate(facility.updatedAt)}</div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(facility.updatedAt), 'p')}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Services Count</span>
                <Badge variant="secondary">{facility.services?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Images</span>
                <Badge variant="secondary">{facility.gallery?.images?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Opening Days</span>
                <Badge variant="secondary">
                  {facility.openingHours?.filter(h => !h.isClosed).length || 0}/7
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Admin Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  No notes have been added for this facility.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/admin/services?facility=${facility._id}`}
                className="block w-full"
              >
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  View Services
                </Button>
              </Link>
              {/* <Link
                href={`/admin/users/${facility.adminId}`}
                className="block w-full"
              >
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View Admin
                </Button>
              </Link> */}
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                View Activity Log
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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

export default SingleFacilityView;