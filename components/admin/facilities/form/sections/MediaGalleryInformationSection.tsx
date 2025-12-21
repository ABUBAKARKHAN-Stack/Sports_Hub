import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { FacilityFormDataType } from '@/schemas/facility.schema';
import { AlertCircle, ImageIcon, Plus, Trash2, Upload, VideoIcon } from 'lucide-react';
import { ChangeEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
    form: UseFormReturn<FacilityFormDataType>;
    handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    removeImage: (index: number) => void;
    getImageSrc: (image: string | File) => string;
    imageFiles: (string | File)[];
    handleVideoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    videoError: string | null;
    getVideoName: (video: string | File) => string;
    introductoryVideoFile: string | File | null;
    getVideoSrc: (video: string | File) => string;
    removeVideo: () => void;
    formatFileSize: (bytes: number) => string;



}
const MediaGalleryInformationSection = ({
    form,
    handleImageUpload,
    removeImage,
    getImageSrc,
    imageFiles,
    handleVideoUpload,
    videoError,
    getVideoName,
    introductoryVideoFile,
    getVideoSrc,
    removeVideo,
    formatFileSize
}: Props) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Media Gallery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Images</h3>
                        <Badge variant="destructive" className="ml-2">
                            Required
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted transition-colors">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                                Upload facility images (JPEG, PNG, WebP)
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                                Recommended size: 1200×800px
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
                                                e.currentTarget.src =
                                                    'https://via.placeholder.com/300x200?text=Image+Error';
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
                                        <div className="absolute bottom-0 left-0 right-0 bg-background/70 text-muted-foreground text-xs p-1">
                                            {typeof image === 'string'
                                                ? 'Existing Image'
                                                : `Image ${index + 1}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground mt-2">No images uploaded yet</p>
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
                        <VideoIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Introductory Video</h3>
                        <Badge variant="outline" className="ml-2">
                            Optional
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted transition-colors">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                                Upload introductory video (MP4, MOV, AVI, WebM)
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
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
                                <div className="p-4 bg-muted/10 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                                            <span className="text-red-600 font-medium">VID</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{getVideoName(introductoryVideoFile)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {typeof introductoryVideoFile === 'string'
                                                    ? 'Existing video from server'
                                                    : `${formatFileSize((introductoryVideoFile as File).size)} • ${(introductoryVideoFile as File).type
                                                    }`}
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
                                        <source
                                            src={getVideoSrc(introductoryVideoFile)}
                                            type={
                                                typeof introductoryVideoFile === 'string'
                                                    ? 'video/mp4'
                                                    : (introductoryVideoFile as File).type
                                            }
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
    )
}

export default MediaGalleryInformationSection