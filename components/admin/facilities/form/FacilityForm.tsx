'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ILocation } from '@/types/main.types';
import { FacilityFormDataType, facilityFormSchema } from '@/schemas/facility.schema';
import {
  defaultFormValues,
} from '@/constants/facility.constants'
import useFacilityForm from '@/hooks/useFacilityForm';
import BasicInformationSection from './sections/BasicInformationSection';
import LocationInformationSection from './sections/LocationInformationSection';
import ContactInformationSection from './sections/ContactInformationSection';
import BusinessHoursInformationSection from './sections/BusinessHoursInformationSection';
import MediaGalleryInformationSection from './sections/MediaGalleryInformationSection';
import FormActionButtonsSection from './sections/FormActionButtonsSection';


type FacilityFormProps = {
  initialData?: Partial<FacilityFormDataType>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  goBackUrl?: string;
}

export default function FacilityForm({
  initialData,
  onSubmit,
  isLoading = false,
  goBackUrl
}: FacilityFormProps) {
  const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
  const [introductoryVideoFile, setIntroductoryVideoFile] = useState<File | string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null)
  const [open, setOpen] = useState(false)

  const objectUrlsRef = useRef<string[]>([]);

  //* Determine if we're in edit mode
  const isEditMode = !!initialData;

  const form = useForm<FacilityFormDataType>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: defaultFormValues,
  });

  const {
    addOpeningHour,
    convertTimeFormat,
    formatFileSize,
    getImageSrc,
    getVideoName,
    getVideoSrc,
    handleGoBack,
    handleImageUpload,
    handleRemoveSelectedLocation,
    handleVideoUpload,
    hasOpenDays,
    removeImage,
    removeOpeningHour,
    removeVideo,
    resetForm,
    updateOpeningHour,
    handleSubmit
  } = useFacilityForm({
    form,
    goBackUrl,
    imageFiles,
    introductoryVideoFile,
    isEditMode,
    objectUrlsRef,
    setImageFiles,
    setIntroductoryVideoFile,
    setSelectedLocation,
    setVideoError,
    onSubmit,
    initialData
  })



  //! Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);


  //* Initial Data Effect
  useEffect(() => {
    if (initialData) {
      // Safely access gallery data with defaults
      const galleryData = initialData.gallery || {
        images: [],
        introductoryVideo: null,
      };

      const mergedData: FacilityFormDataType = {
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
        description: initialData?.description,
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


  //* Location Selection Effect
  useEffect(() => {
    if (selectedLocation) {
      form.setValue("location.address", selectedLocation.address!)
      form.setValue("location.city", selectedLocation.city!)
      form.setValue("location.coordinates", selectedLocation.coordinates!)
      form.setValue("location.country", selectedLocation.country!)
    }
  }, [selectedLocation])

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

          {/* Basic Information Section */}
          <BasicInformationSection form={form} />

          {/* Location Information Section */}
          <LocationInformationSection
            form={form}
            handleRemoveSelectedLocation={handleRemoveSelectedLocation}
            open={open}
            setOpen={setOpen}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />

          {/* Contact Information Section */}
          <ContactInformationSection form={form} />

          {/* Business Hours Section */}
          <BusinessHoursInformationSection
            form={form}
            addOpeningHour={addOpeningHour}
            removeOpeningHour={removeOpeningHour}
            updateOpeningHour={updateOpeningHour}
          />

          {/* Media Gallery Section */}
          <MediaGalleryInformationSection
            form={form}
            formatFileSize={formatFileSize}
            getImageSrc={getImageSrc}
            getVideoName={getVideoName}
            getVideoSrc={getVideoSrc}
            handleImageUpload={handleImageUpload}
            handleVideoUpload={handleVideoUpload}
            imageFiles={imageFiles}
            introductoryVideoFile={introductoryVideoFile}
            removeImage={removeImage}
            removeVideo={removeVideo}
            videoError={videoError}
          />

          {/* Form Actions Section */}
          <FormActionButtonsSection
            handleGoBack={handleGoBack}
            initialData={initialData}
            isLoading={isLoading}
            resetForm={resetForm}
          />
        </form>
      </Form>
    </div>
  );
}