'use client';

import React, { useEffect, useState } from 'react';
import { useFacility } from '@/context/admin/FacilityContext';
import { FacilityStatusEnum,  } from '@/types/main.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Eye,
  Settings,
  Star,
  PhoneCall,
  Image as ImageIcon,
  Clock as ClockIcon,
  FileText,
  User,
  AlertCircle,
  Play,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';
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
} from '@/components/ui/dialog';
import {CldVideoPlayer, CldImage} from'next-cloudinary'

interface FacilityDetailsViewProps {
  id: string;
}

const FacilityDetailsView: React.FC<FacilityDetailsViewProps> = ({ id }) => {
  const { state, getFacilityById, updateFacilityStatus } = useFacility();
  const [activeTab, setActiveTab] = useState('details');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

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
        label: 'Pending',
        action: 'Approve Facility',
        adminMessage: 'This facility is awaiting approval.',
      },
      [FacilityStatusEnum.APPROVED]: {
        icon: CheckCircle,
        variant: 'outline' as const,
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        label: 'Approved',
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

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd MMM yyyy');
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
            The facility you're looking for doesn't exist.
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
  return (
    <div className=" space-y-6">
      {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/facilities">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{facility.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={statusConfig?.variant}
                className={cn("gap-1.5 font-medium", statusConfig?.className)}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig?.label}
              </Badge>
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
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Facility Name</label>
                  <p className="text-sm font-medium mt-1">{facility.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-600 mt-1">
                    {facility.description || 'No description provided'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Admin ID</label>
                    <p className="text-sm font-mono text-gray-600 mt-1">
                      {facility.adminId.toString().slice(-8)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Facility ID</label>
                    <p className="text-sm font-mono text-gray-600 mt-1">
                      {facility._id.toString().slice(-8)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{facility.contact.phone || 'Not provided'}</p>
                      <p className="text-xs text-gray-500">Phone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{facility.contact.email || 'Not provided'}</p>
                      <p className="text-xs text-gray-500">Email</p>
                    </div>
                  </div>
                </div>
                <Link href={`/admin/facilities/${id}/edit`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Contact Info
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Location Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm font-medium mt-1">{facility.location.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <p className="text-sm font-medium mt-1">{facility.location.city || 'Not provided'}</p>
                  </div>
                  {facility.location.coordinates && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Coordinates</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {facility.location.coordinates.lat.toFixed(6)}, {facility.location.coordinates.lng.toFixed(6)}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
                <Link href={`/admin/facilities/${id}/edit`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Location
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Operating Hours Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Operating Hours
                </CardTitle>
                <CardDescription>
                  {facility.openingHours?.filter(h => !h.isClosed).length || 0} days open
                </CardDescription>
              </CardHeader>
              <CardContent>
                {facility.openingHours && facility.openingHours.length > 0 ? (
                  <div className="space-y-2">
                    {facility.openingHours.map((schedule, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center justify-between py-2 px-3 rounded",
                          schedule.isClosed
                            ? "bg-gray-50"
                            : "bg-emerald-50"
                        )}
                      >
                        <span className="text-sm font-medium">{schedule.day}</span>
                        {schedule.isClosed ? (
                          <Badge variant="outline" className="text-xs">
                            Closed
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-600">
                            {formatTime(schedule.openingTime)} - {formatTime(schedule.closingTime)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <ClockIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No operating hours set</p>
                  </div>
                )}
                <Link href={`/admin/facilities/${id}/edit`} className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Hours
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Gallery Information Card with Carousel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Gallery & Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images Section with Carousel */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-lg">Facility Images</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {facility.gallery?.images?.length || 0} images available
                      </p>
                    </div>
                    {facility.gallery?.images && facility.gallery.images.length > 0 && (
                      <Badge variant="secondary">
                        {facility.gallery.images.length} images
                      </Badge>
                    )}
                  </div>
                  
                  {facility.gallery?.images && facility.gallery.images.length > 0 ? (
                    <div className="space-y-4">
                      {/* Main Carousel */}
                      <Carousel className="w-full">
                        <CarouselContent>
                          {facility.gallery.images.map((imageUrl, index) => (
                            <CarouselItem key={index}>
                              <div 
                                className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer group"
                                onClick={() => handleImageClick(index)}
                              >
                                {/* Using next/image for optimization */}
                                <Image
                                  src={imageUrl}
                                  alt={`Facility image ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  priority={index === 0}
                                />
                                {/* Overlay with view icon */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-3 rounded-full">
                                    <Eye className="h-5 w-5 text-gray-700" />
                                  </div>
                                </div>
                                {/* Image indicator */}
                                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  Image {index + 1} of {facility.gallery.images.length}
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>

                      {/* Thumbnail Grid */}
                      <div className="grid grid-cols-4 gap-2">
                        {facility.gallery.images.slice(0, 8).map((imageUrl, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                            onClick={() => handleImageClick(index)}
                          >
                            <Image
                              src={imageUrl}
                              alt={`Facility thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="100px"
                            />
                            {index === 7 && facility.gallery.images.length > 8 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  +{facility.gallery.images.length - 8}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No Images</h3>
                      <p className="text-gray-500 mt-1 mb-4">Upload images to showcase your facility</p>
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
                        Facility tour and introduction
                      </p>
                    </div>
                    {facility.gallery?.introductoryVideo && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        Video Available
                      </Badge>
                    )}
                  </div>
                  
                  {facility.gallery?.introductoryVideo ? (
                    <div className="space-y-4">
                      {/* Video Player */}
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm mx-auto mb-4">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                            <p className="text-white/90 font-medium">Facility Tour Video</p>
                            <p className="text-white/70 text-sm mt-1">Click to play</p>
                          </div>
                        </div>
                        
                        {/* Video Thumbnail */}
                        <div className="absolute inset-0 opacity-40">
                          <div className="h-full w-full bg-gradient-to-br from-blue-900/30 to-purple-900/30" />
                        </div>
                        
                        {/* Play Button Overlay */}
                        <a
                          href={facility.gallery.introductoryVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors"
                        >
                          <div className="h-20 w-20 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center justify-center group">
                            <Play className="h-10 w-10 text-black group-hover:scale-110 transition-transform" />
                          </div>
                        </a>
                        
                        {/* Video Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <p className="text-white font-medium">Facility Introduction</p>
                          <p className="text-white/80 text-sm">Get to know our facility</p>
                        </div>
                      </div>

                      {/* Video Actions */}
                      <div className="flex gap-2">
                        <a
                          href={facility.gallery.introductoryVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full gap-2">
                            <Play className="h-4 w-4" />
                            Play Video
                          </Button>
                        </a>
                        <Link href={`/admin/facilities/${id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2">
                            <Edit className="h-4 w-4" />
                            Change Video
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <Play className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No Video</h3>
                      <p className="text-gray-500 mt-1 mb-4">Add a video tour to attract more visitors</p>
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

          {/* Image Viewer Dialog */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
              {selectedImageIndex !== null && facility?.gallery?.images?.[selectedImageIndex] && (
                <>
                  <DialogHeader className="sr-only">
                    <DialogTitle>Facility Image Viewer</DialogTitle>
                    <DialogDescription>
                      Viewing image {selectedImageIndex + 1} of {facility.gallery.images.length}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="relative aspect-video w-full bg-black">
                    <Image
                      src={facility.gallery.images[selectedImageIndex]}
                      alt={`Facility image ${selectedImageIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                    
                    {/* Navigation Buttons */}
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
                    </button>
                    
                    {/* Close Button */}
                    <button
                      onClick={() => setIsImageDialogOpen(false)}
                      className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                      aria-label="Close viewer"
                    >
                      <XCircle className="h-6 w-6 text-white" />
                    </button>
                    
                    {/* Image Info */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="bg-black/70 text-white px-3 py-2 rounded-lg">
                        <p className="font-medium">
                          Image {selectedImageIndex + 1} of {facility.gallery.images.length}
                        </p>
                        <p className="text-sm text-white/80 mt-1">
                          {facility.name} • {formatDate(facility.createdAt)}
                        </p>
                      </div>
                      <a
                        href={facility.gallery.images[selectedImageIndex]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                        Open Full Size
                      </a>
                    </div>
                  </div>
                  
                  {/* Thumbnails Strip */}
                  <div className="p-4 bg-gray-900">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {facility.gallery.images.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={cn(
                            "relative h-16 w-16 rounded overflow-hidden flex-shrink-0 border-2 transition-all",
                            selectedImageIndex === index
                              ? "border-blue-500 ring-2 ring-blue-500/30"
                              : "border-transparent hover:border-gray-400"
                          )}
                          aria-label={`View image ${index + 1}`}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Facility Services
                  </CardTitle>
                  <CardDescription>
                    Manage services offered by this facility
                  </CardDescription>
                </div>
                <Link href={`/admin/services?facility=${id}`}>
                  <Button className="gap-2">
                    <Settings className="h-4 w-4" />
                    Manage All Services
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {facility.services && facility.services.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {facility.services.slice(0, 6).map((serviceId, index) => (
                      <Card key={index} className="border">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            Service {index + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-xs text-gray-500">
                              ID: {serviceId.toString().slice(-8)}
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/admin/services/${serviceId}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                              <Link href={`/admin/services/${serviceId}/edit`}>
                                <Button variant="outline" size="sm">
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
                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-500">
                        Showing 6 of {facility.services.length} services
                      </p>
                      <Link href={`/admin/services?facility=${id}`}>
                        <Button variant="link" className="mt-2">
                          View all services →
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Services</h3>
                  <p className="text-gray-500 mt-1 mb-6">
                    This facility hasn't added any services yet.
                  </p>
                  <Link href={`/admin/services/new?facility=${id}`}>
                    <Button className="gap-2">
                      <Settings className="h-4 w-4" />
                      Add First Service
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Total Services</p>
                  <p className="text-2xl font-bold mt-1">{facility.services?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-5 w-5 text-green-600" />
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
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="h-5 w-5 text-purple-600" />
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

      {/* Facility Metadata */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3">Registration Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm font-medium">{formatDate(facility.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="text-sm font-medium">{formatDate(facility.updatedAt)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Facility Admin</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Admin ID</p>
                  <p className="text-xs text-gray-500">{facility.adminId.toString().slice(-8)}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link href={`/admin/bookings?facility=${id}`}>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Calendar className="h-4 w-4" />
                    View Bookings
                  </Button>
                </Link>
                <Link href={`/admin/reviews?facility=${id}`}>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Star className="h-4 w-4" />
                    View Reviews
                  </Button>
                </Link>
              </div>
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

 