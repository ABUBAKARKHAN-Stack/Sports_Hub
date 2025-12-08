// app/admin/facilities/[id]/FacilityDetailsView.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useFacility } from '@/context/admin/FacilityContext';
import { FacilityStatusEnum } from '@/types/main.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  ArrowLeft,
  Eye,
  Settings,
  Star,
  PhoneCall,
  Image as ImageIcon,
  Clock as ClockIcon,
  User,
  AlertCircle,
  Play,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  ArrowRight,
  Pencil,
  Grid3X3,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Masonry from 'react-masonry-css';
import FacilitySkeleton from '@/components/shared/facilities/FacilitySkeleton';
import FacilityError from '@/components/shared/facilities/FacilityError';

interface FacilityDetailsViewProps {
  id: string;
}

const FacilityDetailsView: React.FC<FacilityDetailsViewProps> = ({ id }) => {
  const { state, getFacilityById } = useFacility();
  const [activeTab, setActiveTab] = useState('details');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getFacilityById(id);
    }
  }, [id]);

  const facility = state.currentFacility;

  const getStatusConfig = (status: FacilityStatusEnum) => {
    const configs = {
      [FacilityStatusEnum.PENDING]: {
        icon: Clock,
        variant: 'outline' as const,
        className: 'border-amber-200 bg-amber-50 text-amber-700',
        label: 'Pending Review',
        action: 'Approve Facility',
        adminMessage: 'This facility is awaiting approval.',
      },
      [FacilityStatusEnum.APPROVED]: {
        icon: CheckCircle,
        variant: 'outline' as const,
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        label: 'Active',
        action: 'Manage Facility',
        adminMessage: 'This facility is active and visible to users.',
      },
      [FacilityStatusEnum.REJECTED]: {
        icon: XCircle,
        variant: 'outline' as const,
        className: 'border-rose-200 bg-rose-50 text-rose-700',
        label: 'Rejected',
        action: 'Review Again',
        adminMessage: 'This facility application was rejected.',
      },
      [FacilityStatusEnum.SUSPENDED]: {
        icon: Shield,
        variant: 'outline' as const,
        className: 'border-gray-200 bg-gray-50 text-gray-700',
        label: 'Suspended',
        action: 'Reactivate',
        adminMessage: 'This facility is temporarily suspended.',
      },
    };
    return configs[status];
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'hh:mm a');
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageDialogOpen(true);
  };

  const handlePrevImage = () => {
    if (selectedImageIndex === null || !facility?.gallery?.images) return;
    setSelectedImageIndex(
      selectedImageIndex === 0
        ? facility.gallery.images.length - 1
        : selectedImageIndex - 1
    );
  };

  const handleNextImage = () => {
    if (selectedImageIndex === null || !facility?.gallery?.images) return;
    setSelectedImageIndex(
      selectedImageIndex === facility.gallery.images.length - 1
        ? 0
        : selectedImageIndex + 1
    );
  };

  const masonryBreakpointCols = {
    default: 2,
    1100: 2,
    700: 1,
    500: 1,
  };

  if (state.loading && !facility) {
    return <FacilitySkeleton />
  }

  if (!facility && !state.loading) {
    return <FacilityError />
  }

  if (!facility) return null;

  const statusConfig = getStatusConfig(facility.status);
  const StatusIcon = statusConfig?.icon || Shield;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/facilities">
            <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Go back to facilities">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{facility.name}</h1>
              <Badge
                variant={statusConfig?.variant}
                className={cn("gap-1.5 font-medium", statusConfig?.className)}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig?.label}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500">Admin View</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/facilities/${id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/admin/services?facility=${id}`}>
            <Button className="gap-2">
              <Settings className="h-4 w-4" />
              Manage Services
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" className="gap-2">
            <Eye className="h-4 w-4" />
            Facility Details
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Settings className="h-4 w-4" />
            Services
          </TabsTrigger>
        </TabsList>

        {/* Details Tab with Masonry Layout */}
        <TabsContent value="details" className="space-y-6">
          {/* Masonry Grid Container */}
          <Masonry
            breakpointCols={masonryBreakpointCols}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
          >
            {/* Basic Information Card */}
            <div className="mb-4 break-inside-avoid">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Facility Name</label>
                      <p className="text-sm font-medium">{facility.name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={statusConfig?.variant}
                          className={cn("gap-1", statusConfig?.className)}
                        >
                          {statusConfig?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {facility.description || 'No description provided'}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Facility ID</label>
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded block truncate">
                        {facility._id.toString()}
                      </code>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Admin ID</label>
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded block truncate">
                        {facility.adminId.toString()}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Card */}
            <div className="mb-4 break-inside-avoid">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneCall className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Phone className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{facility.contact.phone || 'Not provided'}</p>
                        <p className="text-xs text-gray-500">Phone Number</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{facility.contact.email || 'Not provided'}</p>
                        <p className="text-xs text-gray-500">Email Address</p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/facilities/${id}/edit`}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      Update Contact Info
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Location Information Card */}
            <div className="mb-4 break-inside-avoid">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium">{facility.location.address || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <p className="text-sm font-medium">{facility.location.city || 'Not provided'}</p>
                    </div>
                    {facility.location.coordinates && (
                      <div className="space-y-2 pt-2 border-t">
                        <label className="text-sm font-medium text-gray-500">Coordinates</label>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {facility.location.coordinates.lat.toFixed(6)}, {facility.location.coordinates.lng.toFixed(6)}
                          </code>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Latitude and longitude for mapping purposes
                        </div>
                      </div>
                    )}
                  </div>
                  <Link href={`/admin/facilities/${id}/edit`}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      Update Location
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Operating Hours Card */}
            <div className="mb-4 break-inside-avoid">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5" />
                    Operating Hours
                  </CardTitle>
                  <CardDescription>
                    {facility.openingHours?.filter(h => !h.isClosed).length || 0} days open per week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {facility.openingHours && facility.openingHours.length > 0 ? (
                    <div className="space-y-2">
                      {facility.openingHours.map((schedule, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center justify-between py-2 px-3 rounded-lg",
                            schedule.isClosed
                              ? "bg-gray-50 text-gray-600"
                              : "bg-emerald-50 text-emerald-900"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                schedule.isClosed ? "bg-gray-400" : "bg-emerald-500"
                              )}
                            />
                            <span className="text-sm font-medium min-w-28">{schedule.day}</span>
                          </div>
                          {schedule.isClosed ? (
                            <Badge variant="outline" className="bg-white">
                              Closed
                            </Badge>
                          ) : (
                            <span className="text-sm font-medium">
                              {formatTime(schedule.openingTime)} - {formatTime(schedule.closingTime)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                      <ClockIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-900">No Operating Hours</p>
                      <p className="text-xs text-gray-500 mt-1">Hours have not been configured</p>
                    </div>
                  )}
                  <Link href={`/admin/facilities/${id}/edit`} className="mt-4 block">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      Update Hours
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

          </Masonry>
          {/* Media Gallery Card - Full Width */}
          <div className="mb-4 break-inside-avoid col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Media Gallery
                </CardTitle>
                <CardDescription>
                  Images and videos showcasing the facility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Images Carousel */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-lg">Facility Images</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {facility.gallery?.images?.length || 0} image(s) available
                        </p>
                      </div>
                      {facility.gallery?.images && facility.gallery.images.length > 0 && (
                        <Link href={`/admin/facilities/${id}/edit`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Edit className="h-3 w-3" />
                            Manage
                          </Button>
                        </Link>
                      )}
                    </div>

                    {facility.gallery?.images && facility.gallery.images.length > 0 ? (
                      <div className="space-y-4">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {facility.gallery.images.map((imageUrl, index) => (
                              <CarouselItem key={index}>
                                <div
                                  className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer group"
                                  onClick={() => handleImageClick(index)}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`Facility image ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading={index === 0 ? "eager" : "lazy"}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full">
                                      <Eye className="h-4 w-4 text-gray-700" />
                                    </div>
                                  </div>
                                  <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {index + 1} / {facility.gallery.images.length}
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-2 h-8 w-8" />
                          <CarouselNext className="right-2 h-8 w-8" />
                        </Carousel>

                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-4 gap-2">
                          {facility.gallery.images.slice(0, 8).map((imageUrl, index) => (
                            <button
                              key={index}
                              onClick={() => handleImageClick(index)}
                              className="relative aspect-square rounded-md overflow-hidden border border-gray-200 hover:border-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                              aria-label={`View image ${index + 1}`}
                            >
                              <img
                                src={imageUrl}
                                alt={`Facility thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              {index === 7 && facility.gallery.images.length > 8 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">
                                    +{facility.gallery.images.length - 8}
                                  </span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Images</h3>
                        <p className="text-gray-500 mt-1 mb-4">Upload images to showcase the facility</p>
                        <Link href={`/admin/facilities/${id}/edit`}>
                          <Button size="sm">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Upload Images
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Video Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-lg">Introductory Video</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Facility tour and introduction video
                        </p>
                      </div>
                      {facility.gallery?.introductoryVideo && (
                        <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Play className="h-3 w-3" />
                              Play
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Facility Tour Video</DialogTitle>
                              <DialogDescription>
                                {facility.name} • Introductory Video
                              </DialogDescription>
                            </DialogHeader>
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                              <video
                                src={facility.gallery.introductoryVideo}
                                controls
                                className="w-full h-full"
                                preload="metadata"
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    {facility.gallery?.introductoryVideo ? (
                      <div className="space-y-4">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                          <video
                            src={facility.gallery.introductoryVideo}
                            className="w-full h-full object-cover opacity-50"
                            preload="metadata"
                          />
                          <button
                            onClick={() => setIsVideoDialogOpen(true)}
                            className="absolute inset-0 flex items-center justify-center group"
                            aria-label="Play video"
                          >
                            <div className="h-20 w-20 rounded-full bg-white/90 hover:bg-white transition-all flex items-center justify-center group-hover:scale-110 ">
                              <Play className="h-10 w-10 text-black ml-1" />
                            </div>
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
                            <p className="text-white font-medium">Facility Introduction</p>
                            <p className="text-white/80 text-sm">Tour and overview</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => setIsVideoDialogOpen(true)}
                          >
                            <Play className="h-4 w-4" />
                            Play Video
                          </Button>
                          <Link href={`/admin/facilities/${id}/edit`}>
                            <Button variant="outline" className="gap-2 w-full">
                              <Edit className="h-4 w-4" />
                              Change Video
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <Play className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Video</h3>
                        <p className="text-gray-500 mt-1 mb-4">Add a video tour to better showcase the facility</p>
                        <Link href={`/admin/facilities/${id}/edit`}>
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Add Video
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Viewer Dialog */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent showCloseButton={false} className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
              {selectedImageIndex !== null && facility?.gallery?.images?.[selectedImageIndex] && (
                <>
                  <DialogHeader className="sr-only">
                    <DialogTitle>Facility Image Viewer</DialogTitle>
                    <DialogDescription>
                      Viewing image {selectedImageIndex + 1} of {facility.gallery.images.length}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="relative h-[70vh] w-full">
                    <img
                      src={facility.gallery.images[selectedImageIndex]}
                      alt={`Facility image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />

                    {/* Navigation */}
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
                    </button>

                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 right-0 backdrop-blur-3xl  p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-black">
                          <h3 className="font-medium">{facility.name}</h3>
                          <p className="text-sm text-black/80">
                            Image {selectedImageIndex + 1} of {facility.gallery.images.length}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={facility.gallery.images[selectedImageIndex]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-black/50 hover:bg-black/80 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open
                          </a>
                          <button
                            onClick={() => setIsImageDialogOpen(false)}
                            className="bg-black/50 hover:bg-black/80 text-white size-9 rounded-lg flex items-center justify-center transition-colors"
                            aria-label="Close viewer"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="p-4 bg-gray-100 border-t">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {facility.gallery.images.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={cn(
                            "relative h-20 w-32 rounded overflow-hidden shrink-0 border-2 transition-all focus:outline-none focus:ring-2 focus:ring-green-500",
                            selectedImageIndex === index
                              ? "border-green-500"
                              : "border-transparent hover:border-gray-400"
                          )}
                          aria-label={`View image ${index + 1}`}
                        >
                          <img
                            src={imageUrl}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Services Tab*/}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Facility Services
                  </CardTitle>
                  <CardDescription>
                    {facility.services?.length || 0} service(s) registered
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/services?facility=${id}`}>
                    <Button variant="outline" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View All
                    </Button>
                  </Link>
                  <Link href={`/admin/services/new?facility=${id}`}>
                    <Button className="gap-2">
                      <Settings className="h-4 w-4" />
                      Add Service
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {facility.services && facility.services.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {facility.services.slice(0, 6).map((service: any, index) => (
                      <Card
                        key={service._id}
                        className="border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-md group"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800 group-hover:text-green-700 transition-colors">
                                <div className="h-2 w-2 rounded-full bg-green-500 shrink-0"></div>
                                <span className="truncate">{service.title || `Service ${index + 1}`}</span>
                              </CardTitle>
                              {service.price && service.duration && (
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                    <span className="font-bold">PKR {service.price}</span>
                                  </span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-600">{service.duration} min</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs font-normal">
                              #{index + 1}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {service._id && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Service ID:</span>
                                <code className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                  {service._id.toString().slice(-8)}
                                </code>
                              </div>
                            )}
                            <div className="flex gap-2 pt-2">
                              <Link
                                href={`/admin/services/${service._id}`}
                                className="flex-1"
                                aria-label={`View details for ${service.title || `service ${index + 1}`}`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-700"
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                                  Details
                                </Button>
                              </Link>
                              <Link
                                href={`/admin/services/${service._id}/edit`}
                                className="flex-1"
                                aria-label={`Edit ${service.title || `service ${index + 1}`}`}
                              >
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                                >
                                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                  Edit
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {facility.services.length > 6 && (
                    <div className="text-center flex flex-col justify-center items-center pt-6 border-t">
                      <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <div className="h-px w-8 bg-gray-300"></div>
                        Showing {Math.min(6, facility.services.length)} of {facility.services.length} services
                        <div className="h-px w-8 bg-gray-300"></div>
                      </div>
                      <Link href={`/admin/services?facility=${id}`}>
                        <Button
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300 font-medium px-6"
                        >
                          <Grid3X3 className="h-4 w-4 mr-2" />
                          View All Services
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Services Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    This facility hasn't added any services. Add services to start accepting bookings.
                  </p>
                  <Link href={`/admin/services/new?facility=${id}`}>
                    <Button className="gap-2 bg-green-600 hover:bg-green-700">
                      <Settings className="h-4 w-4" />
                      Add First Service
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Total Services</p>
                  <p className="text-2xl font-bold mt-1">{facility.services?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Operating Days</p>
                  <p className="text-2xl font-bold mt-1">
                    {facility.openingHours?.filter(h => !h.isClosed).length || 0}/7
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Gallery Images</p>
                  <p className="text-2xl font-bold mt-1">
                    {facility.gallery?.images?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <Card className="border-t">
        <CardContent className="px-6 ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Registered {format(new Date(facility.createdAt), 'MMM dd, yyyy')}</span>
              </div>
              <div className="text-xs text-gray-400">
                Last updated {format(new Date(facility.updatedAt), 'MMM dd, yyyy • hh:mm a')}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/bookings?facility=${id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Bookings
                </Button>
              </Link>
              <Link href={`/admin/reviews?facility=${id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Star className="h-4 w-4" />
                  Reviews
                </Button>
              </Link>
              <Link href={`/admin/facilities/${id}/edit`}>
                <Button variant="default" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
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

export default FacilityDetailsView;