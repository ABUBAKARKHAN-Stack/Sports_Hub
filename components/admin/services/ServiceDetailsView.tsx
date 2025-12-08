'use client';

import React, { useEffect, useState } from 'react';
import { useService } from '@/context/admin/ServiceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Clock,
    Edit,
    ArrowLeft,
    Eye,
    DollarSign,
    Calendar,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Info,
    Image as ImageIcon,
    Video,
    Clock as ClockIcon,
    BarChart,
    TrendingUp,
    Package,
    CheckSquare,
    XSquare,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Building,
    MoreVertical,
    Link as LinkIcon,
    Eye as EyeIcon,
    Upload,
    Maximize2,
    Tag,
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
} from '@/components/ui/dialog';
import Masonry from 'react-masonry-css';
import ServiceSkeleton from '@/components/shared/services/ServiceSkeleton';
import ServiceError from '@/components/shared/services/ServiceError';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ServiceDetailsViewProps {
    id: string;
}

interface Facility {
    _id: string;
    name: string;
}

interface Service {
    _id: string;
    title: string;
    description: string;
    facilityId: Facility;
    price: number;
    duration: number;
    capacity: number;
    category: string;
    isActive: boolean;
    images: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const ServiceDetailsView: React.FC<ServiceDetailsViewProps> = ({ id }) => {
    const { state, getServiceById } = useService();
    const [activeTab, setActiveTab] = useState('details');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    useEffect(() => {
        if (id) {
            getServiceById(id);
        }
    }, [id]);

    const service = state.currentService;

    const getStatusConfig = (isActive: boolean) => {
        if (isActive) {
            return {
                icon: CheckCircle,
                variant: 'default' as const,
                className: 'bg-green-500 hover:bg-green-600 text-white',
                label: 'Active',
                adminMessage: 'This service is active and bookable.',
            };
        } else {
            return {
                icon: XCircle,
                variant: 'destructive' as const,
                className: 'bg-gray-500 hover:bg-gray-600 text-white',
                label: 'Inactive',
                adminMessage: 'This service is currently inactive.',
            };
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return `${hours}h ${mins}m`;
    };

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsImageDialogOpen(true);
    };

    const handlePrevImage = () => {
        if (selectedImageIndex === null || !service?.images) return;
        setSelectedImageIndex(
            selectedImageIndex === 0
                ? service.images.length - 1
                : selectedImageIndex - 1
        );
    };

    const handleNextImage = () => {
        if (selectedImageIndex === null || !service?.images) return;
        setSelectedImageIndex(
            selectedImageIndex === service.images.length - 1
                ? 0
                : selectedImageIndex + 1
        );
    };

    const masonryBreakpointCols = {
        default: 3,
        1100: 2,
        700: 1,
        500: 1,
    };

    if (state.loading && !service) {
        return <ServiceSkeleton />;
    }

    if (!service && !state.loading) {
        return <ServiceError />;
    }

    if (!service) return null;

    const statusConfig = getStatusConfig(service.isActive);
    const StatusIcon = statusConfig?.icon || CheckCircle;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Link href="/admin/services">
                        <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Go back to services">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{service.title}</h1>
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
                                <Tag className="h-4 w-4" />
                                {service.category}
                            </Badge>
                            <span className="text-sm text-gray-500">Service ID: {service._id.toString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/services/${id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                    <Link href={`/admin/bookings?service=${id}`}>
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
                    <TabsTrigger value="media" className="flex-1 gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Media
                    </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6">
                    <Masonry
                        breakpointCols={masonryBreakpointCols}
                        className="flex -ml-4 w-auto"
                        columnClassName="pl-4 bg-clip-padding"
                    >
                        {/* Basic Information Card */}
                        <Card className='mb-4'>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Service Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Title</label>
                                    <p className="font-medium">{service.title}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Description</label>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {service.description || 'No description provided'}
                                    </p>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 space-x-1">
                                        <label className="text-sm font-medium text-gray-600">Category</label>
                                        <Badge variant="secondary">{service.category}</Badge>
                                    </div>
                                    <div className="space-y-2 space-x-1">
                                        <label className="text-sm font-medium text-gray-600">Status</label>
                                        <Badge
                                            variant={statusConfig?.variant}
                                            className={cn("gap-1", statusConfig?.className)}
                                        >
                                            {statusConfig?.label}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing & Capacity Card */}
                        <Card className='mb-4'>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Pricing & Capacity</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Price</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                                {formatCurrency(service.price)}
                                            </p>
                                        </div>
                                        <DollarSign className="h-8 w-8 text-gray-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600">Duration</label>
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{formatTime(service.duration)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600">Capacity</label>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{service.capacity} people</span>
                                        </div>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Facility Information Card */}
                        <Card className='mb-4'>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Facility</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {service.facilityId ? (
                                    <>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                            <Building className="h-5 w-5 text-gray-600" />
                                            <div>
                                                <p className="font-medium">{service.facilityId.name}</p>
                                                <p className="text-xs text-gray-500">Facility Name</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">Facility ID</label>
                                            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded block truncate">
                                                {service.facilityId._id}
                                            </code>
                                        </div>
                                        <Link href={`/admin/facilities/${service.facilityId._id}`}>
                                            <Button variant="outline" size="sm" className="w-full gap-2">
                                                <Eye className="h-4 w-4" />
                                                View Facility Details
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                                        <Building className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-900">No Facility Assigned</p>
                                        <p className="text-xs text-gray-500">Assign a facility to this service</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Stats Card */}
                        <Card className='mb-4'>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-gray-600 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-gray-600">Bookings</p>
                                        <p className="text-lg font-bold mt-1">0</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-gray-600 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-gray-600">Revenue</p>
                                        <p className="text-lg font-bold mt-1">{formatCurrency(0)}</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Users className="h-5 w-5 text-gray-600 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-gray-600">Capacity</p>
                                        <p className="text-lg font-bold mt-1">{service.capacity}</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <ClockIcon className="h-5 w-5 text-gray-600 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-gray-600">Duration</p>
                                        <p className="text-lg font-bold mt-1">{service.duration}m</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline Card */}
                        <Card className='mb-4'>
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Current Status</label>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={statusConfig?.variant}
                                            className={cn("gap-1", statusConfig?.className)}
                                        >
                                            <StatusIcon className="h-3 w-3" />
                                            {statusConfig?.label}
                                        </Badge>
                                        <p className="text-xs text-gray-600">{statusConfig?.adminMessage}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Created</span>
                                        <span className="text-sm font-medium">
                                            {format(new Date(service.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Last Updated</span>
                                        <span className="text-sm font-medium">
                                            {format(new Date(service.updatedAt), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Masonry>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold">Service Images</CardTitle>
                                    <CardDescription>
                                        {service.images?.length || 0} image{service.images?.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                                {service.images && service.images.length > 0 && (
                                    <Link href={`/admin/services/${id}/edit`}>
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <Upload className="h-4 w-4" />
                                            Upload More
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {service.images && service.images.length > 0 ? (
                                <div className="space-y-6">
                                    {/* Main Carousel */}
                                    <Carousel className="w-full">
                                        <CarouselContent>
                                            {service.images.map((imageUrl, index) => (
                                                <CarouselItem key={index}>
                                                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden border bg-gray-100">
                                                        <img
                                                            src={imageUrl}
                                                            alt={`${service.title} - Image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                                        <button
                                                            onClick={() => handleImageClick(index)}
                                                            className="absolute inset-0 flex items-center justify-center group"
                                                        >
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm p-3 rounded-full">
                                                                <Maximize2 className="h-6 w-6 text-white" />
                                                            </div>
                                                        </button>
                                                        <div className="absolute bottom-4 left-4 text-white">
                                                            <p className="text-sm font-medium">Image {index + 1}</p>
                                                            <p className="text-xs opacity-75">
                                                                {service.images.length} total
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-2" />
                                        <CarouselNext className="right-2" />
                                    </Carousel>

                                    {/* Thumbnail Grid */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-3">All Images</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {service.images.map((imageUrl, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleImageClick(index)}
                                                    className="relative aspect-square rounded-md overflow-hidden border hover:border-gray-400 transition-colors group"
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                    {index === 5 && service.images.length > 6 && (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                            <span className="text-white text-sm font-medium">
                                                                +{service.images.length - 6}
                                                            </span>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        {service.images.length > 6 && (
                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                Click on any image to view full size
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                    <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Images</h3>
                                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                        Upload images to showcase this service to potential customers
                                    </p>
                                    <Link href={`/admin/services/${id}/edit`}>
                                        <Button className="gap-2">
                                            <Upload className="h-4 w-4" />
                                            Upload Images
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Image Viewer Dialog */}
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                    {selectedImageIndex !== null && service?.images?.[selectedImageIndex] && (
                        <>
                            <div className="relative aspect-[16/9] bg-black">
                                <img
                                    src={service.images[selectedImageIndex]}
                                    alt={`${service.title} - Image ${selectedImageIndex + 1}`}
                                    className="w-full h-full object-contain"
                                />
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-5 w-5 text-white" />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-5 w-5 text-white" />
                                </button>
                                <div className="absolute top-4 right-4">
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={service.images[selectedImageIndex]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                                            title="Open in new tab"
                                        >
                                            <ExternalLink className="h-4 w-4 text-white" />
                                        </a>
                                        <button
                                            onClick={() => setIsImageDialogOpen(false)}
                                            className="h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                                            aria-label="Close viewer"
                                        >
                                            <XCircle className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-sm font-medium">
                                        {service.title} - Image {selectedImageIndex + 1} of {service.images.length}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-100 border-t">
                                <p className="text-sm font-medium text-gray-700 mb-2">All Images</p>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {service.images.map((imageUrl, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={cn(
                                                "relative h-20 w-32 rounded overflow-hidden shrink-0 border-2 transition-all",
                                                selectedImageIndex === index
                                                    ? "border-blue-500"
                                                    : "border-transparent hover:border-gray-400"
                                            )}
                                            aria-label={`View image ${index + 1}`}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
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

            {/* Footer Actions */}
            <Card className="border">
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>Created {format(new Date(service.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Last updated {format(new Date(service.updatedAt), 'MMM dd, yyyy • hh:mm a')}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href={`/admin/bookings?service=${id}`}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Calendar className="h-4 w-4" />
                                    View Bookings
                                </Button>
                            </Link>
                            {service.facilityId && (
                                <Link href={`/admin/services?facility=${service.facilityId._id}`}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Building className="h-4 w-4" />
                                        All Services
                                    </Button>
                                </Link>
                            )}
                            <Link href={`/admin/services/${id}/edit`}>
                                <Button size="sm" className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Service
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

export default ServiceDetailsView;