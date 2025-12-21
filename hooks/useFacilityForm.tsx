import { ALLOWED_VIDEO_TYPES, DAYS, MAX_VIDEO_SIZE,defaultFormValues } from "@/constants/facility.constants";
import { FacilityFormDataType } from "@/schemas/facility.schema";
import { ILocation } from "@/types/main.types";
import { useRouter } from "next/navigation";
import { Dispatch, RefObject, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

export default function useFacilityForm(
    {
        //* Variables
        objectUrlsRef,
        form,
        isEditMode,
        goBackUrl,
        initialData,


        //* States
        imageFiles,
        introductoryVideoFile,

        //* State Dispatchers
        setVideoError,
        setImageFiles,
        setIntroductoryVideoFile,
        setSelectedLocation,

        //* Functions
        onSubmit,
    }: {
        isEditMode: boolean;
        objectUrlsRef: RefObject<string[]>;
        goBackUrl: string | undefined;
        form: UseFormReturn<FacilityFormDataType>;
        initialData?: Partial<FacilityFormDataType>

        imageFiles: (File | string)[];
        introductoryVideoFile: File | string | null;

        setVideoError: Dispatch<SetStateAction<string | null>>;
        setImageFiles: Dispatch<SetStateAction<(File | string)[]>>;
        setIntroductoryVideoFile: Dispatch<SetStateAction<File | string | null>>;
        setSelectedLocation: Dispatch<SetStateAction<ILocation | null>>;

        onSubmit: (data: FormData) => Promise<void>
    }
) {
    const router = useRouter()



    const getImageSrc = (image: File | string): string => {
        if (typeof image === 'string') {
            return image; // Already a URL string
        }
        const url = URL.createObjectURL(image);
        objectUrlsRef.current.push(url); // Track for cleanup
        return url;
    };

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

    const getVideoSrc = (video: File | string): string => {
        if (typeof video === 'string') {
            return video;
        }
        const url = URL.createObjectURL(video);
        objectUrlsRef.current.push(url);
        return url;
    };


    const convertTimeFormat = (timeStr: string): string => {
        if (!timeStr) return '09:00';


        if (timeStr.includes(':')) return timeStr;

        try {
            let time = timeStr.toLowerCase().trim();
            const isPM = time.includes('pm');
            const isAM = time.includes('am');

            const numbers = time.match(/\d+/g);
            if (!numbers) return '09:00';

            let hour = parseInt(numbers[0]);

            if (isPM && hour < 12) hour += 12;
            if (isAM && hour === 12) hour = 0;

            return `${hour.toString().padStart(2, '0')}:00`;
        } catch {
            return '09:00';
        }
    };

    const resetForm = () => {
        form.reset(defaultFormValues);
        setImageFiles([]);
        setIntroductoryVideoFile(null);
        setVideoError(null);

        //! Cleanup object URLs
        objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        objectUrlsRef.current = [];
    };

    const handleGoBack = () => {
        if (goBackUrl) {
            router.push(goBackUrl);
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

        //! If removing a File object, revoke its object URL
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

        //* Reset previous error
        setVideoError(null);

        //* Check file type
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            setVideoError('Invalid file type. Please upload MP4, MOV, AVI, or WebM files.');
            return;
        }

        //* Check file size (max 10MB)
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
        const currentHours = form.getValues('openingHours')!;
        const availableDays = DAYS.filter(day =>
            !currentHours?.some(hour => hour.day === day)
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
        const currentHours = form.getValues('openingHours')!;
        if (currentHours.length <= 1) return;

        const newHours = currentHours.filter((_, i) => i !== index);
        form.setValue('openingHours', newHours, { shouldValidate: true });
    };

    const updateOpeningHour = (
        index: number,
        field: keyof FacilityFormDataType['openingHours'][0],
        value: any
    ) => {
        const currentHours = form.getValues('openingHours')!;
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
        const hours = form.watch('openingHours');
        return hours.some(hour => !hour.isClosed);
    };

    const formatFileSize = (bytes: number): string => {
        if (!bytes || bytes <= 0) return '0 bytes';
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const handleRemoveSelectedLocation = () => {
        setSelectedLocation(null)
        form.setValue("location", { address: "", city: "", coordinates: { lat: 0, lng: 0 }, country: "" })
    }

      const handleSubmit = async (data: FacilityFormDataType) => {
    
        try {
          //* Create FormData for file upload
          const formData = new FormData();
    
          //* Append basic fields
          formData.append('name', data.name);
          formData.append('description', data.description || '');
          formData.append('location', JSON.stringify(data.location));
          formData.append('contact', JSON.stringify(data.contact));
    
          //* Process opening hours
          const processedOpeningHours = data.openingHours.map(hour => ({
            ...hour,
            isClosed: hour.isClosed ?? false,
            openingTime: hour.isClosed ? '' : hour.openingTime,
            closingTime: hour.isClosed ? '' : hour.closingTime,
          }));
    
          //* Append Opening Hours
          formData.append('openingHours', JSON.stringify(processedOpeningHours));
    
          //* Handle images based on whether we're updating or creating
          const isUpdate = !!initialData;
    
          formData.append('isUpdate', isUpdate.toString());
    
          if (isUpdate) {
            //* For update: append existing image URLs
            const existingImageUrls = (data.gallery?.images || [])
              .filter(img => typeof img === 'string')
              .map(img => ({ url: img }));
    
            if (existingImageUrls.length > 0) {
              formData.append('existingImages', JSON.stringify(existingImageUrls));
            }
    
            //* Append new images (only File objects)
            let newImageCount = 0;
            (data.gallery?.images || []).forEach((image) => {
              if (image instanceof File) {
                formData.append('newImages', image);
                newImageCount++;
              }
            });
            formData.append('totalNewImages', newImageCount.toString());
          } else {
            //* For create: append all images as files
            (data.gallery?.images || []).forEach((image) => {
              if (image instanceof File) {
                formData.append('images', image);
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
    
    
    
          console.log('FormData entries:', Array.from(formData.entries()));
          // return
          await onSubmit(formData);
    
        } catch (error) {
          console.error('Form submission error:', error);
        }
      };

    return {
        defaultFormValues,
        goBackUrl,

        getImageSrc,
        getVideoName,
        getVideoSrc,
        convertTimeFormat,
        resetForm,
        handleGoBack,
        handleImageUpload,
        removeImage,
        handleVideoUpload,
        removeVideo,
        addOpeningHour,
        removeOpeningHour,
        updateOpeningHour,
        validateImages,
        hasOpenDays,
        formatFileSize,
        handleRemoveSelectedLocation,

        handleSubmit,
    }
}
