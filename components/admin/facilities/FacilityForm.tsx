'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Upload, MapPin, Phone, Clock, ImageIcon, VideoIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import LocationsAndSearchInput from '@/components/shared/LocationsAndSearchInput';

type FacilityFormData = {
  name: string;
  description: string | null;
  location: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
  openingHours: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    openingTime: string;
    closingTime: string;
    isClosed?: boolean;
  }[];
  gallery?: {
    images: (File | string)[];
    introductoryVideo?: File | string | null;
  };
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

// Constants for file validation
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];

const defaultFormValues: FacilityFormData = {
  name: '',
  description: null,
  location: {
    address: '',
    city: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
  contact: {
    phone: '',
    email: '',
  },
  openingHours: DAYS.map(day => ({
    day,
    openingTime: '09:00',
    closingTime: '17:00',
    isClosed: false,
  })),
  gallery: {
    images: [],
    introductoryVideo: null,
  },
};

interface FacilityFormProps {
  initialData?: Partial<FacilityFormData>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  onSuccess?: () => void;
  goBackUrl?: string;
}

// Create a custom schema for the form that handles both create and edit modes
const getFormSchema = (isEditMode: boolean) => {
  // Base schema for common validation
  const baseSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().nullable().optional(),
    location: z.object({
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      coordinates: z.object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      }).optional(),
    }),
    contact: z.object({
      phone: z.string().min(1, "Phone number is required"),
      email: z.string().email("Invalid email address"),
    }),
    openingHours: z.array(
      z.object({
        day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
        openingTime: z.string().optional(),
        closingTime: z.string().optional(),
        isClosed: z.boolean().optional(),
      })
    ).min(1, "At least one opening hour entry is required"),
  });

  // For edit mode, accept both Files and strings for existing data
  if (isEditMode) {
    return baseSchema.extend({
      gallery: z.object({
        images: z.array(
          z.union([
            z.string().url("Must be a valid URL"),
            z.instanceof(File, {
              message: "Must be a file"
            }).refine(file => file.size <= 5 * 1024 * 1024, {
              message: "Image size must be less than 5MB",
            })
          ])
        ).min(1, "At least one image is required"),
        introductoryVideo: z.union([
          z.string().url("Must be a valid URL"),
          z.instanceof(File, {
            message: "Must be a file"
          }).refine(file => file.size <= MAX_VIDEO_SIZE, {
            message: "Video size must be less than 10MB",
          }),
          z.null()
        ]).optional(),
      }).optional(),
    });
  }

  // For create mode, only accept Files
  return baseSchema.extend({
    gallery: z.object({
      images: z.array(
        z.instanceof(File, {
          message: "Must be a file"
        }).refine(file => file.size <= 5 * 1024 * 1024, {
          message: "Image size must be less than 5MB",
        })
      ).min(1, "At least one image is required"),
      introductoryVideo: z.instanceof(File, {
        message: "Must be a file"
      }).refine(file => file.size <= MAX_VIDEO_SIZE, {
        message: "Video size must be less than 10MB",
      })
        .nullable()
        .optional(),
    }).optional(),
  });
};

export default function FacilityForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  onSuccess,
  goBackUrl
}: FacilityFormProps) {
  const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
  const [introductoryVideoFile, setIntroductoryVideoFile] = useState<File | string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const router = useRouter();
  const objectUrlsRef = useRef<string[]>([]);

  // Determine if we're in edit mode
  const isEditMode = !!initialData;

  // Use the appropriate schema based on mode
  const formSchema = getFormSchema(isEditMode);

  const form = useForm<FacilityFormData>({
    resolver: zodResolver(formSchema as any),
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });

  console.log(form.formState.errors);

  const openingHours = form.watch('openingHours');

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  // Helper function to get image source URL
  const getImageSrc = (image: File | string): string => {
    if (typeof image === 'string') {
      return image; // Already a URL string
    }
    const url = URL.createObjectURL(image);
    objectUrlsRef.current.push(url); // Track for cleanup
    return url;
  };

  // Helper function to get video name
  const getVideoName = (video: File | string): string => {
    if (typeof video === 'string') {
      // Extract filename from URL
      try {
        const url = new URL(video);
        const pathname = url.pathname;
        const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
        return decodeURIComponent(filename) || 'Introductory Video';
      } catch {
        return 'Introductory Video';
      }
    }
    return video.name || 'Video File';
  };

  // Helper function to get video source
  const getVideoSrc = (video: File | string): string => {
    if (typeof video === 'string') {
      return video; // Already a URL
    }
    const url = URL.createObjectURL(video);
    objectUrlsRef.current.push(url); // Track for cleanup
    return url;
  };

  // Helper function to convert time format
  const convertTimeFormat = (timeStr: string): string => {
    if (!timeStr) return '09:00';

    // Check if it's already in 24-hour format
    if (timeStr.includes(':')) return timeStr;

    // Convert "9AM" to "09:00", "5PM" to "17:00"
    try {
      let time = timeStr.toLowerCase().trim();
      const isPM = time.includes('pm');
      const isAM = time.includes('am');

      // Extract numbers
      const numbers = time.match(/\d+/g);
      if (!numbers) return '09:00';

      let hour = parseInt(numbers[0]);

      // Convert to 24-hour format
      if (isPM && hour < 12) hour += 12;
      if (isAM && hour === 12) hour = 0;

      return `${hour.toString().padStart(2, '0')}:00`;
    } catch {
      return '09:00';
    }
  };

  useEffect(() => {
    if (initialData) {
      // Safely access gallery data with defaults
      const galleryData = initialData.gallery || {
        images: [],
        introductoryVideo: null,
      };

      const mergedData: FacilityFormData = {
        ...defaultFormValues,
        ...initialData,
        location: {
          ...defaultFormValues.location,
          ...initialData?.location,
          coordinates: {
            lat: initialData?.location?.coordinates?.lat ?? defaultFormValues.location.coordinates!.lat,
            lng: initialData?.location?.coordinates?.lng ?? defaultFormValues.location.coordinates!.lng,
          },
        },
        contact: {
          ...defaultFormValues.contact,
          ...initialData?.contact,
        },
        openingHours: initialData?.openingHours?.length
          ? initialData.openingHours.map(hour => ({
            ...hour,
            isClosed: hour.isClosed ?? false,
            openingTime: convertTimeFormat(hour.openingTime || '09:00'),
            closingTime: convertTimeFormat(hour.closingTime || '17:00'),
          }))
          : defaultFormValues.openingHours,
        gallery: {
          images: (galleryData.images as (File | string)[]) || defaultFormValues.gallery!.images,
          introductoryVideo: galleryData.introductoryVideo as File | string | null || null,
        },
        description: initialData?.description || null,
      };

      form.reset(mergedData);

      // Set image files safely
      if (galleryData.images && Array.isArray(galleryData.images)) {
        setImageFiles(galleryData.images);
      } else {
        setImageFiles([]);
      }

      // Set video file safely
      if (galleryData.introductoryVideo) {
        setIntroductoryVideoFile(galleryData.introductoryVideo as File | string);
      } else {
        setIntroductoryVideoFile(null);
      }
    } else {
      // For create form, reset to defaults
      form.reset(defaultFormValues);
      setImageFiles([]);
      setIntroductoryVideoFile(null);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: FacilityFormData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append basic fields
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('location', JSON.stringify(data.location));
      formData.append('contact', JSON.stringify(data.contact));

      // Process opening hours
      const processedOpeningHours = data.openingHours.map(hour => ({
        ...hour,
        isClosed: hour.isClosed ?? false,
        openingTime: hour.isClosed ? '' : hour.openingTime,
        closingTime: hour.isClosed ? '' : hour.closingTime,
      }));
      formData.append('openingHours', JSON.stringify(processedOpeningHours));

      // Handle images based on whether we're updating or creating
      const isUpdate = !!initialData;

      formData.append('isUpdate', isUpdate.toString());

      if (isUpdate) {
        // For update: append existing image URLs
        const existingImageUrls = (data.gallery?.images || [])
          .filter(img => typeof img === 'string')
          .map(img => ({ url: img }));

        if (existingImageUrls.length > 0) {
          formData.append('existingImages', JSON.stringify(existingImageUrls));
        }

        // Append new images (only File objects)
        let newImageCount = 0;
        (data.gallery?.images || []).forEach((image) => {
          if (image instanceof File) {
            formData.append('newImages', image); // Append all new images with same key
            newImageCount++;
          }
        });
        formData.append('totalNewImages', newImageCount.toString());
      } else {
        // For create: append all images as files
        (data.gallery?.images || []).forEach((image) => {
          if (image instanceof File) {
            formData.append('images', image); // For create, use 'images' key
          }
        });
      }

      // Handle video
      if (data.gallery?.introductoryVideo instanceof File) {
        formData.append('newIntroductoryVideo', data.gallery.introductoryVideo);
      } else if (typeof data.gallery?.introductoryVideo === 'string') {
        // Existing video URL for update
        formData.append('existingVideoUrl', data.gallery.introductoryVideo);
      } else if (data.gallery?.introductoryVideo === null && initialData?.gallery?.introductoryVideo) {
        // Video being removed in update
        formData.append('removeVideo', 'true');
      }

      console.log('Submitting form data - isUpdate:', isUpdate, {
        name: data.name,
        hasGallery: !!data.gallery,
        imageCount: data.gallery?.images?.length || 0,
        hasVideo: !!data.gallery?.introductoryVideo,
        isVideoFile: data.gallery?.introductoryVideo instanceof File,
        isVideoUrl: typeof data.gallery?.introductoryVideo === 'string'
      });

      console.log('FormData entries:', Array.from(formData.entries()));
      await onSubmit(formData);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const resetForm = () => {
    form.reset(defaultFormValues);
    setImageFiles([]);
    setIntroductoryVideoFile(null);
    setVideoError(null);

    // Cleanup object URLs
    objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const updatedFiles = [...imageFiles, ...newFiles];
    setImageFiles(updatedFiles);

    form.setValue('gallery.images', updatedFiles, { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const newImages = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newImages);
    form.setValue('gallery.images', newImages, { shouldValidate: true });

    // If removing a File object, revoke its object URL
    const removedImage = imageFiles[index];
    if (removedImage instanceof File) {
      const url = getImageSrc(removedImage);
      URL.revokeObjectURL(url);
      objectUrlsRef.current = objectUrlsRef.current.filter(u => u !== url);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous error
    setVideoError(null);

    // Check file type
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setVideoError('Invalid file type. Please upload MP4, MOV, AVI, or WebM files.');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > MAX_VIDEO_SIZE) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setVideoError(`File size (${sizeInMB} MB) exceeds maximum limit of 10 MB.`);
      return;
    }

    // Cleanup previous video object URL if it was a File
    if (introductoryVideoFile instanceof File) {
      const oldUrl = getVideoSrc(introductoryVideoFile);
      URL.revokeObjectURL(oldUrl);
      objectUrlsRef.current = objectUrlsRef.current.filter(u => u !== oldUrl);
    }

    setIntroductoryVideoFile(file);
    form.setValue('gallery.introductoryVideo', file, { shouldValidate: true });
  };

  const removeVideo = () => {
    // Cleanup object URL if it was a File
    if (introductoryVideoFile instanceof File) {
      const url = getVideoSrc(introductoryVideoFile);
      URL.revokeObjectURL(url);
      objectUrlsRef.current = objectUrlsRef.current.filter(u => u !== url);
    }

    setIntroductoryVideoFile(null);
    setVideoError(null);
    form.setValue('gallery.introductoryVideo', null, { shouldValidate: true });
  };

  const addOpeningHour = () => {
    const currentHours = form.getValues('openingHours');
    const availableDays = DAYS.filter(day =>
      !currentHours.some(hour => hour.day === day)
    );

    if (availableDays.length > 0) {
      const newHours = [
        ...currentHours,
        {
          day: availableDays[0],
          openingTime: '09:00',
          closingTime: '17:00',
          isClosed: false,
        },
      ];
      form.setValue('openingHours', newHours, { shouldValidate: true });
    }
  };

  const removeOpeningHour = (index: number) => {
    const currentHours = form.getValues('openingHours');
    if (currentHours.length <= 1) return;

    const newHours = currentHours.filter((_, i) => i !== index);
    form.setValue('openingHours', newHours, { shouldValidate: true });
  };

  const updateOpeningHour = (
    index: number,
    field: keyof FacilityFormData['openingHours'][0],
    value: any
  ) => {
    const currentHours = form.getValues('openingHours');
    const updatedHours = [...currentHours];

    if (field === 'day') {
      updatedHours[index].day = value as typeof DAYS[number];
    } else if (field === 'openingTime') {
      updatedHours[index].openingTime = value as string;
    } else if (field === 'closingTime') {
      updatedHours[index].closingTime = value as string;
    } else if (field === 'isClosed') {
      updatedHours[index].isClosed = value as boolean;

      if (value === true) {
        updatedHours[index].openingTime = '';
        updatedHours[index].closingTime = '';
      } else {
        updatedHours[index].openingTime = '09:00';
        updatedHours[index].closingTime = '17:00';
      }
    }

    form.setValue('openingHours', updatedHours, { shouldValidate: true });
  };

  const validateImages = () => {
    const gallery = form.getValues('gallery');
    if (!gallery?.images || gallery.images.length === 0) return false;

    // For edit mode, accept both files and URLs
    if (isEditMode) {
      return gallery.images.length > 0;
    }

    // For create mode, only accept files
    return gallery.images.some(img => img instanceof File);
  };

  const hasOpenDays = () => {
    return openingHours.some(hour => !hour.isClosed);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 bytes';
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Go Back Button */}
      <div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleGoBack}
          className="gap-2 px-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

          {/* Basic Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter facility name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your facility"
                        className="min-h-[100px] resize-none"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        {/* <Textarea
                          placeholder="Enter complete address"
                          className="min-h-20 resize-none"
                          {...field}
                        /> */}
                        <LocationsAndSearchInput
                          onSelect={(loc) => {
                            if (loc) {

                              form.setValue("location.coordinates.lat", loc.lat)
                              form.setValue("location.coordinates.lng", loc.lng)
                            }
                          }

                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel>Latitude (Auto Fill When you choose locarion)</FormLabel>
                    <Input
                      readOnly
                      type="number"
                      step="any"
                      placeholder="e.g., 33.6844"
                      value={form.watch('location.coordinates.lat') || ''}
                     disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Longitude (Optional)</FormLabel>
                    <Input
                      type="number"
                      step="any"
                      placeholder="e.g., 73.0479"
                      value={form.watch('location.coordinates.lng') || ''}
                      onChange={e => form.setValue('location.coordinates.lng',
                        e.target.value === '' ? 0 : parseFloat(e.target.value),
                        { shouldValidate: true }
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+92 XXX XXXXXXX"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Opening Hours Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Opening Hours
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOpeningHour}
                  disabled={openingHours.length >= 7}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Day
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {openingHours.map((hour, index) => (
                  <div key={`${hour.day}-${index}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <FormLabel>Day</FormLabel>
                        <Select
                          value={hour.day}
                          onValueChange={(value: FacilityFormData['openingHours'][0]['day']) =>
                            updateOpeningHour(index, 'day', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS.map(day => (
                              <SelectItem
                                key={day}
                                value={day}
                                disabled={openingHours.some((h, i) =>
                                  i !== index && h.day === day
                                )}
                              >
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-3 pt-8">
                        <Switch
                          checked={hour.isClosed || false}
                          onCheckedChange={(checked) => updateOpeningHour(index, 'isClosed', checked)}
                        />
                        <FormLabel className="font-normal cursor-pointer">
                          Closed
                        </FormLabel>
                      </div>

                      {!hour.isClosed && (
                        <>
                          <div className="space-y-2">
                            <FormLabel>Open Time</FormLabel>
                            <Input
                              type="time"
                              value={hour.openingTime}
                              onChange={(e) => updateOpeningHour(index, 'openingTime', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <FormLabel>Close Time</FormLabel>
                            <Input
                              type="time"
                              value={hour.closingTime}
                              onChange={(e) => updateOpeningHour(index, 'closingTime', e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOpeningHour(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={openingHours.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {!hasOpenDays() && (
                  <Badge variant="outline" className="w-full justify-center py-2 border-red-200 text-red-600">
                    At least one day must be open
                  </Badge>
                )}

                {form.formState.errors.openingHours && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.openingHours.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gallery Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Images Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  <h3 className="font-medium">Images</h3>
                  <Badge variant="destructive" className="ml-2">
                    Required
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Upload facility images (JPEG, PNG, WebP)
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Recommended size: 1200x800px
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>

                  {imageFiles.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imageFiles.map((image, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border">
                          <img
                            src={getImageSrc(image)}
                            alt={`Facility image ${index + 1}`}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              console.error('Error loading image:', image);
                              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                            {typeof image === 'string' ? 'Existing Image' : `Image ${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      No images uploaded yet
                    </p>
                  )}

                  {form.formState.errors.gallery?.images && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.gallery.images.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Video Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <VideoIcon className="h-5 w-5" />
                  <h3 className="font-medium">Introductory Video</h3>
                  <Badge variant="outline" className="ml-2">
                    Optional
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Upload introductory video (MP4, MOV, AVI, WebM)
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Maximum size: 10MB
                    </p>
                    <Input
                      type="file"
                      accept="video/mp4,video/mov,video/avi,video/webm"
                      className="hidden"
                      id="video-upload"
                      onChange={handleVideoUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video-upload')?.click()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Video
                    </Button>
                  </div>

                  {/* Video Error Message */}
                  {videoError && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      <span>{videoError}</span>
                    </div>
                  )}

                  {introductoryVideoFile && (
                    <div className="relative rounded-lg overflow-hidden border mt-4">
                      <div className="p-4 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 font-medium">VID</span>
                          </div>
                          <div>
                            <p className="font-medium">{getVideoName(introductoryVideoFile)}</p>
                            <p className="text-xs text-gray-500">
                              {typeof introductoryVideoFile === 'string'
                                ? 'Existing video from server'
                                : `${formatFileSize((introductoryVideoFile as File).size)} • ${(introductoryVideoFile as File).type}`}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={removeVideo}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Video Preview */}
                      <div className="p-4">
                        <video
                          controls
                          className="w-full rounded-md max-h-80"
                          preload="metadata"
                        >
                          <source src={getVideoSrc(introductoryVideoFile)}
                            type={typeof introductoryVideoFile === 'string'
                              ? 'video/mp4'
                              : (introductoryVideoFile as File).type}
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={isLoading}
                size="lg"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
                size="lg"
              >
                Reset Form
              </Button>
            </div>

            <div className="flex space-x-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  size="lg"
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                disabled={isLoading || !validateImages() || !hasOpenDays() || !!videoError}
                size="lg"
                className="min-w-[150px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : initialData ? 'Update Facility' : 'Create Facility'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}