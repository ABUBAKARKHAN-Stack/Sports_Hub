import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Facility } from '@/models/facility.model';
import { getToken } from 'next-auth/jwt';
import { FacilityStatusEnum, UserRoles } from '@/types/main.types';
import { isValidObjectId } from 'mongoose';
import { deleteFromCloudinary, extractPublicId, uploadToCloudinary } from '@/lib/uploadToCloudinary';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminId = "693321382f71c557aa971adc";
    const userRole = "ADMIN" as UserRoles;

    if (!adminId || userRole !== UserRoles.ADMIN) {
      return NextResponse.json(
        new ApiError(403, "Access denied. Admin privileges required."),
        { status: 403 }
      );
    }

    const { id } = await params;

    //* For admin, only show facilities they own
    const query: any = { _id: id };
    if (userRole === UserRoles.ADMIN) {
      query.adminId = adminId;
    }
    

    const facility = await Facility.findOne({...query})
      .populate('services', 'title price duration')

    if (!facility) {
      return NextResponse.json(
        new ApiError(404, "Facility not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      new ApiResponse(200, "Facility fetched successfully", facility),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get facility error:", error);
    return NextResponse.json(
      new ApiError(500, "Failed to fetch facility", error.message),
      { status: 500 }
    );
  }
}

//* Update facility
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminId = token?.sub;
    const userRole = token?.role as UserRoles;

    if (!adminId || (userRole !== UserRoles.ADMIN && userRole !== UserRoles.SUPER_ADMIN)) {
      return NextResponse.json(
        new ApiError(403, "Access denied. Admin privileges required."),
        { status: 403 }
      );
    }

    const { id } = await params;
    const formData = await req.formData();

    // Find facility
    const facility = await Facility.findById(id);

    if (!facility) {
      return NextResponse.json(
        new ApiError(404, "Facility not found"),
        { status: 404 }
      );
    }

    // Check permissions
    if (userRole === UserRoles.ADMIN && facility.adminId.toString() !== adminId) {
      return NextResponse.json(
        new ApiError(403, "You don't have permission to update this facility"),
        { status: 403 }
      );
    }

    //* Prepare update object
    const updateData: any = {};
    
    //* Extract form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const contact = formData.get("contact") as string;
    const openingHours = formData.get("openingHours") as string;
    const existingImages = formData.get("existingImages") as string;
    const existingVideoUrl = formData.get("existingVideoUrl") as string;
    const removeVideo = formData.get("removeVideo") === "true";
    const isUpdate = formData.get("isUpdate") === "true";
    const totalNewImages = parseInt(formData.get("totalNewImages") as string) || 0;

    console.log("Form data received:", {
      name, description, existingImages, existingVideoUrl,
      removeVideo, isUpdate, totalNewImages
    });

    //* Update basic fields
    if (name) updateData.name = name;
    if (description !== null && description !== undefined) {
      updateData.description = description || null;
    }
    if (location) {
      try {
        updateData.location = JSON.parse(location);
      } catch (error) {
        console.warn("Invalid location format");
      }
    }
    if (contact) {
      try {
        updateData.contact = JSON.parse(contact);
      } catch (error) {
        console.warn("Invalid contact format");
      }
    }
    if (openingHours) {
      try {
        updateData.openingHours = JSON.parse(openingHours);
      } catch (error) {
        console.warn("Invalid openingHours format");
      }
    }

    //* Handle gallery images
    if (isUpdate) {
      // For update: combine existing and new images
      let allImages: string[] = [];
      
      // Parse existing images
      if (existingImages) {
        try {
          const parsedExisting = JSON.parse(existingImages);
          if (Array.isArray(parsedExisting)) {
            allImages = parsedExisting.map((img: any) => img.url);
          }
        } catch (error) {
          console.warn("Invalid existingImages format");
        }
      }

      // Upload new images
      const newImages: string[] = [];
      for (let i = 0; i < totalNewImages; i++) {
        const newImage = formData.get("newImages") as File;
        if (newImage && newImage.size > 0) {
          const buffer = Buffer.from(await newImage.arrayBuffer());
          const uploaded = await uploadToCloudinary(buffer, "facilities/gallery", "image");
          console.log("New Image Uploaded:", uploaded.public_id);
          newImages.push(uploaded.secure_url);
        }
      }

      // Combine existing and new images
      if (allImages.length > 0 || newImages.length > 0) {
        updateData.gallery = updateData.gallery || {};
        updateData.gallery.images = [...allImages, ...newImages];
      }
    } else {
      // For create: handle images normally
      const images = formData.getAll("images") as File[];
      if (images && images.length > 0 && images[0]?.size > 0) {
        const galleryImages: string[] = [];
        
        for (const file of images) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const uploaded = await uploadToCloudinary(buffer, "facilities/gallery", "image");
          console.log("Image Uploaded On Cloudinary", uploaded.public_id);
          galleryImages.push(uploaded.secure_url);
        }
        
        updateData.gallery = updateData.gallery || {};
        updateData.gallery.images = galleryImages;
      }
    }

    //* Handle video
    updateData.gallery = updateData.gallery || {};
    
    if (existingVideoUrl) {
      // Keep existing video
      updateData.gallery.introductoryVideo = existingVideoUrl;
    } else if (removeVideo) {
      // Remove video
      updateData.gallery.introductoryVideo = null;
    } else {
      // Upload new video if provided
      const newVideo = formData.get("newIntroductoryVideo") as File;
      if (newVideo && newVideo.size > 0) {
        const buffer = Buffer.from(await newVideo.arrayBuffer());
        const uploadedVideo = await uploadToCloudinary(
          buffer,
          "facilities/videos",
          "video"
        );
        console.log("Video Uploaded On Cloudinary", uploadedVideo.public_id);
        
        updateData.gallery.introductoryVideo = uploadedVideo.secure_url;
      }
    }

    console.log("Final update data:", JSON.stringify(updateData, null, 2));

    //* Update facility
    const updatedFacility = await Facility.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true
      }
    ).populate('adminId', 'username email').populate('services', 'title price');

    if (!updatedFacility) {
      return NextResponse.json(
        new ApiError(404, "Facility not found after update"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      new ApiResponse(200, "Facility updated successfully", updatedFacility),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update facility error:", error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        new ApiError(400, "Validation error", error.errors),
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        new ApiError(400, "Facility with this name already exists"),
        { status: 400 }
      );
    }

    return NextResponse.json(
      new ApiError(500, "Failed to update facility", error.message),
      { status: 500 }
    );
  }
}
//* Delete facility
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminId = token?.sub;
    const userRole = token?.role as UserRoles;


    if (!adminId || (userRole !== UserRoles.ADMIN && userRole !== UserRoles.SUPER_ADMIN)) {
      return NextResponse.json(
        new ApiError(403, "Access denied. Admin privileges required."),
        { status: 403 }
      );
    }


    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        new ApiResponse(400, "Invalid Facility Id Received."),
        { status: 400 }
      )
    }

    const facility = await Facility.findById(id);

    if (!facility) {
      return NextResponse.json(
        new ApiError(404, "Facility not found"),
        { status: 404 }
      );
    }

    if (userRole === UserRoles.ADMIN && facility.adminId.toString() !== adminId) {
      return NextResponse.json(
        new ApiError(403, "You don't have permission to delete this facility"),
        { status: 403 }
      );
    }

    for (const url of facility.gallery.images) {
      const publicId = extractPublicId(url);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId, "image")
        } catch (error) {
          return NextResponse.json(
            new ApiError(500, "Failed to delete from cloudinary")
          )
        }
      }
    }

    if (facility.gallery.introductoryVideo) {
      const publicId = extractPublicId(facility.gallery.introductoryVideo);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId, "video");
        } catch (error) {
          return NextResponse.json(
            new ApiError(500, "Failed to delete video from Cloudinary")
          );
        }
      }
    }

    await facility.deleteOne();

    return NextResponse.json(
      new ApiResponse(200, "Facility deleted successfully"),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Delete facility error:", error);
    return NextResponse.json(
      new ApiError(500, "Failed to delete facility", error.message),
      { status: 500 }
    );
  }
}