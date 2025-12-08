'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Loader2,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  ArrowLeft,
  DollarSign,
  Clock,
  Users,
  Building,
  Info,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToasts } from '@/hooks/toastNotifications';

// Schema for service validation
const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional().nullable(),
  facilityId: z.string().min(1, "Facility is required"),
  price: z.coerce.number({
    error: "Price is required",
  }).positive("Price must be positive"),
  duration: z.coerce.number({
    error: "Duration is required",
  }).int("Duration must be a whole number").positive("Duration must be positive"),
  capacity: z.coerce.number({
    error: "Capacity is required",
  }).int("Capacity must be a whole number").positive("Capacity must be positive"),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface Facility {
  _id: string;
  name: string;
}

interface ServiceFormProps {
  initialData?: Partial<ServiceFormData> & { images?: (File | string)[] };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  onSuccess?: () => void;
  goBackUrl?: string;
  showToast?: (message: string, type: 'success' | 'error') => void;
}

const defaultFormValues: ServiceFormData = {
  title: '',
  description: '',
  facilityId: '',
  price: 0,
  duration: 60,
  capacity: 1,
  category: '',
  isActive: true,
};

export default function ServiceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  onSuccess,
  goBackUrl,
  showToast
}: ServiceFormProps) {
  const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const objectUrlsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    errorToast,
    successToast
  } = useToasts()

  const isEditMode = !!initialData;

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  // Fetch facilities on mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setFacilitiesLoading(true);
        const res = await fetch('/api/admin/facilities');
        const data = await res.json();
        if (data.success) {
          setFacilities(data.data?.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch facilities');
        }
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
        errorToast('Failed to load facilities');
      } finally {
        setFacilitiesLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // Initialize form with data when facilities are loaded
  useEffect(() => {
    if (initialData && facilities.length > 0) {
      const mergedData: ServiceFormData = {
        ...defaultFormValues,
        ...initialData,
      };

      // IMPORTANT: If facilityId in initialData is a name (like "Sports Arena"),
      // we need to find the corresponding _id from facilities
      if (initialData.facilityId && facilities.length > 0) {
        const facility = facilities.find(f => 
          f._id === initialData.facilityId || f.name === initialData.facilityId
        );
        
        if (facility) {
          mergedData.facilityId = facility._id;
        } else {
          console.warn(`Facility not found: ${initialData.facilityId}`);
          // If not found, keep the original value but it might cause validation error
          mergedData.facilityId = initialData.facilityId;
        }
      }

      console.log('Form reset data:', mergedData);
      
      form.reset(mergedData);

      // Set image files if provided
      if (initialData.images && Array.isArray(initialData.images)) {
        setImageFiles(initialData.images);
      }
    }
  }, [initialData, facilities]); // Added facilities to dependency

  const validateImages = useCallback((): { isValid: boolean; message?: string } => {
    // For create mode, at least 1 image is required
    if (!isEditMode && imageFiles.length === 0) {
      return { isValid: false, message: 'At least one image is required' };
    }

    // Maximum 5 images allowed
    if (imageFiles.length > 5) {
      return { isValid: false, message: 'Maximum 5 images allowed' };
    }

    // Validate image types
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidImages = imageFiles.filter(file => {
      if (file instanceof File) {
        return !allowedImageTypes.includes(file.type);
      }
      return false;
    });

    if (invalidImages.length > 0) {
      return { isValid: false, message: `Invalid image types. Allowed: JPG, JPEG, PNG, WebP` };
    }

    return { isValid: true };
  }, [imageFiles, isEditMode]);

  const handleSubmit = async (data: ServiceFormData) => {
    try {
      setFormError(null);

      // Validate images
      const imageValidation = validateImages();
      if (!imageValidation.isValid) {
        const errorMsg = imageValidation.message || 'Image validation failed';
        setFormError(errorMsg);
        errorToast(errorMsg);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Append basic fields
      formData.append('title', data.title);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('facilityId', data.facilityId);
      formData.append('price', data.price.toString());
      formData.append('duration', data.duration.toString());
      formData.append('capacity', data.capacity.toString());
      formData.append('category', data.category);
      formData.append('isActive', data.isActive.toString());

      // For create mode, append all images as files
      if (!isEditMode) {
        imageFiles.forEach((image, index) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      } else {
        // For edit mode, handle existing and new images
        const existingImageUrls = imageFiles
          .filter(img => typeof img === 'string')
          .map(img => img);

        if (existingImageUrls.length > 0) {
          formData.append('existingImages', JSON.stringify(existingImageUrls));
        }

        // Append new images (only File objects)
        imageFiles.forEach((image) => {
          if (image instanceof File) {
            formData.append('newImages', image);
          }
        });
      }

      console.log('Submitting service data:', {
        title: data.title,
        price: data.price,
        facilityId: data.facilityId,
        category: data.category,
        imageCount: imageFiles.length,
        isEditMode,
      });

      await onSubmit(formData);

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setFormError(errorMessage);
      errorToast(errorMessage);
    }
  };

  const resetForm = () => {
    form.reset(defaultFormValues);
    setImageFiles([]);
    setFormError(null);

    // Cleanup object URLs
    objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    // Check if adding new files would exceed max limit
    if (imageFiles.length + newFiles.length > 5) {
      errorToast('Maximum 5 images allowed');
      return;
    }

    // Validate file types
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = newFiles.filter(file => !allowedImageTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      errorToast(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    const updatedFiles = [...imageFiles, ...newFiles];
    setImageFiles(updatedFiles);
    e.target.value = ''; // Reset file input
  };

  const getImageSrc = (image: File | string): string => {
    if (typeof image === 'string') {
      return image;
    }
    const url = URL.createObjectURL(image);
    objectUrlsRef.current.push(url);
    return url;
  };

  const removeImage = (index: number) => {
    const removedImage = imageFiles[index];

    // Cleanup object URL if it's a File
    if (removedImage instanceof File) {
      const url = getImageSrc(removedImage);
      URL.revokeObjectURL(url);
      objectUrlsRef.current = objectUrlsRef.current.filter(u => u !== url);
    }

    const newImages = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newImages);
  };

  // Calculate form validity including images
  const isFormValid = form.formState.isValid &&
    (isEditMode ? true : imageFiles.length >= 1) &&
    imageFiles.length <= 5;

  return (
    <div className="space-y-6">
      {/* Go Back Button */}
      <div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleGoBack}
          className="gap-2 px-0 hover:bg-transparent"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>

      {/* Form Error Alert */}
      {formError && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{formError}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter service title"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Category *
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter category (e.g., Cricket, Golf, etc.)"
                          {...field}
                          disabled={isLoading}
                        />
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
                        placeholder="Describe your service in detail"
                        className="min-h-[100px] resize-none"
                        {...field}
                        value={field.value || ''}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Price (PKR) *
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          disabled={isLoading}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? 0 : parseFloat(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Duration (minutes) *
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="60"
                          {...field}
                          disabled={isLoading}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? 0 : parseInt(value, 10));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Capacity *
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                          disabled={isLoading}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? 0 : parseInt(value, 10));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Facility Selection Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Facility Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="facilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Facility *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={facilitiesLoading || isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            facilitiesLoading ? "Loading facilities..." : "Select a facility"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilities.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No facilities available
                          </SelectItem>
                        ) : (
                          facilities.map(facility => (
                            <SelectItem key={facility._id} value={facility._id}>
                              {facility.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {field.value && !facilities.some(f => f._id === field.value) && (
                      <p className="text-xs text-amber-600 mt-1">
                        Warning: Selected facility ID "{field.value}" not found in available facilities
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Images Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Service Images
                </CardTitle>
                <Badge variant={isEditMode ? "outline" : "destructive"} className="ml-2">
                  {isEditMode ? "Optional" : "Required"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">Upload Service Images</h3>
                    <Badge variant="secondary" className="ml-2">
                      {imageFiles.length}/5
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {isEditMode
                      ? "Upload new images (optional). Allowed formats: JPG, JPEG, PNG, WebP"
                      : "Upload at least 1 and maximum 5 images. Allowed formats: JPG, JPEG, PNG, WebP"}
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag & drop images or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    {isEditMode
                      ? "Add new images (optional)"
                      : "Minimum 1 image, Maximum 5 images"}
                  </p>

                  {!isEditMode && imageFiles.length === 0 && (
                    <p className="text-xs text-red-500 mb-2">
                      At least 1 image is required
                    </p>
                  )}

                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    id="service-image-upload"
                    onChange={handleImageUpload}
                    disabled={imageFiles.length >= 5 || isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('service-image-upload')?.click()}
                    disabled={imageFiles.length >= 5 || isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {imageFiles.length >= 5 ? 'Maximum Reached' : 'Upload Images'}
                  </Button>
                  {imageFiles.length >= 5 && (
                    <p className="text-xs text-red-500 mt-2">
                      Maximum 5 images reached
                    </p>
                  )}
                </div>

                {imageFiles.length > 0 && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                      {imageFiles.map((image, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border">
                          <img
                            src={getImageSrc(image)}
                            alt={`Service image ${index + 1}`}
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
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                            {typeof image === 'string'
                              ? 'Existing Image'
                              : `Image ${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      {imageFiles.length} image(s) uploaded. {5 - imageFiles.length} more allowed.
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Service Status</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Service Status
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        {field.value
                          ? "Service is active and visible to users"
                          : "Service is inactive and hidden from users"
                        }
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
            <div className="flex flex-wrap gap-4">
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

            <div className="flex flex-wrap gap-4">
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
                disabled={isLoading || !isFormValid}
                size="lg"
                className="min-w-[150px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}