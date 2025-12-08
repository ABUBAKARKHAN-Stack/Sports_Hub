import { connectDb } from "@/lib/dbConnect";
import { deleteFromCloudinary, extractPublicId, uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { withAdmin } from "@/middlewares/auth";
import { Facility } from "@/models/facility.model";
import { Service } from "@/models/service.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { url } from "inspector";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

//* ---------------------- Helper: Validate Access ----------------------
async function verifyServiceOwnership(serviceId: string, adminId: string) {
    const service = await Service.findById(serviceId).populate("facilityId", "name");
    if (!service) throw new ApiError(404, "Service not found");

    const facility = await Facility.findOne({
        _id: service.facilityId,
        adminId
    });

    if (!facility) throw new ApiError(403, "You don't have permission for this service");

    return service;
}

//* ---------------------- PUT: Update Service ----------------------
async function updateService(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const adminId = token?.sub;

        if (!adminId) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), { status: 401 });
        }

        const { id: serviceId } = await params;

        // Use formData instead of json() to handle file uploads
        const body = await req.formData();        

        // Verify admin owns this service
        const existingService = await verifyServiceOwnership(serviceId, adminId);
        if (!existingService) {
            return NextResponse.json(
                new ApiError(403, "You don't have permission to update this service"),
                { status: 403 }
            );
        }

        // Validate required fields
        const requiredFields = ['title', 'facilityId', 'price', 'duration', 'capacity', 'category'];
        const missingFields = requiredFields.filter(field => !body.get(field));

        if (missingFields.length > 0) {
            return NextResponse.json(
                new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`),
                { status: 400 }
            );
        }

        // Verify admin owns the facility (new or existing)
        const facilityId = body.get('facilityId') as string;
        const facility = await Facility.findOne({
            _id: facilityId,
            adminId
        });

        if (!facility) {
            return NextResponse.json(
                new ApiError(403, "You don't have permission to use this facility"),
                { status: 403 }
            );
        }

        // Handle existing images (from edit form)
        let finalImages: string[] = existingService.images || [];

        const existingImagesJson = body.get('existingImages');
        if (existingImagesJson) {
            try {
                const existingImages = JSON.parse(existingImagesJson as string);
                if (Array.isArray(existingImages)) {
                    finalImages = existingImages;
                }
            } catch (error) {
                console.error("Error parsing existingImages:", error);
                // Keep existing images if parsing fails
            }
        }

        // Handle new image uploads
        const newImageFiles = body.getAll('newImages') as File[];

        // Validate new images (if any)
        if (newImageFiles.length > 0) {
            // Validate total images don't exceed 5
            if (finalImages.length + newImageFiles.length > 5) {
                return NextResponse.json(
                    new ApiError(400, "Maximum 5 images allowed in total"),
                    { status: 400 }
                );
            }

            // Validate image types
            const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            const invalidImages = newImageFiles.filter(file => !allowedImageTypes.includes(file.type));

            if (invalidImages.length > 0) {
                return NextResponse.json(
                    new ApiError(400, `Invalid image type. Allowed: ${allowedImageTypes.join(', ')}`),
                    { status: 400 }
                );
            }

            // Upload new images to Cloudinary
            for (const file of newImageFiles) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploaded = await uploadToCloudinary(buffer, "services/images", "image");
                console.log("New image uploaded to Cloudinary:", uploaded.public_id);
                finalImages.push(uploaded.secure_url);
            }
        } else if (finalImages.length === 0) {
            // If no new images and no existing images kept, use original images
            finalImages = existingService.images || [];
        }

        // Ensure we have at least 1 image
        if (finalImages.length === 0) {
            return NextResponse.json(
                new ApiError(400, "At least one image is required"),
                { status: 400 }
            );
        }

        // Create update data object
        const updateData = {
            title: body.get('title') as string,
            description: body.get('description') as string || '',
            facilityId: facilityId,
            price: parseFloat(body.get('price') as string),
            duration: parseInt(body.get('duration') as string),
            capacity: parseInt(body.get('capacity') as string),
            category: body.get('category') as string,
            images: finalImages,
            isActive: body.get('isActive') ? body.get('isActive') === 'true' : true
        };


        // If facility is being changed, update both services
        const oldFacilityId = existingService.facilityId._id.toString();
        if (facilityId !== oldFacilityId) {
            // Remove service from old facility
            await Facility.findByIdAndUpdate(oldFacilityId, {
                $pull: { services: serviceId }
            });

            // Add service to new facility
            await Facility.findByIdAndUpdate(facilityId, {
                $push: { services: serviceId }
            });
        }

        // Update the service
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            updateData,
            { new: true, runValidators: true }
        ).populate("facilityId", "name");

        return NextResponse.json(
            new ApiResponse(200, "Service updated successfully", updatedService)
        );

    } catch (error: any) {
        console.error("Update service error:", error);

        if (error.name === "ValidationError") {
            return NextResponse.json(
                new ApiError(400, "Validation error", error.errors),
                { status: 400 }
            );
        }

        if (error.code === 11000) {
            return NextResponse.json(
                new ApiError(400, "Duplicate service title in this facility"),
                { status: 400 }
            );
        }

        const status = error.statusCode || 500;
        return NextResponse.json(
            new ApiError(status, error.message || "Failed to update service"),
            { status }
        );
    }
}

//* ---------------------- DELETE: Delete Service ----------------------
async function deleteService(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const adminId = token?.sub;

        const { id: serviceId } = await params;

        const service = await verifyServiceOwnership(serviceId, adminId!);

        const dbService = await Service.findById(serviceId);

        if (!dbService) {
            return NextResponse.json(
                new ApiError(404, "Service Not Found"),
                { status: 400 }
            )
        }

        for (const image of dbService?.images) {
            const publicId = extractPublicId(image)
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

        await dbService.deleteOne()

        await Facility.findByIdAndUpdate(service.facilityId, {
            $pull: { services: serviceId }
        });

        return NextResponse.json(
            new ApiResponse(200, "Service deleted successfully", null)
        );

    } catch (error: any) {
        console.error("Delete service error:", error);

        const status = error.statusCode || 500;
        return NextResponse.json(
            new ApiError(status, error.message || "Failed to delete service"),
            { status }
        );
    }
}

//* ---------------------- PATCH: Update Service Status ----------------------
async function updateServiceStatus(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const adminId = token?.sub;

        const { id: serviceId } = await params;
        const { isActive } = await req.json();


        await verifyServiceOwnership(serviceId, adminId!);

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { isActive },
            { new: true, runValidators: true }
        ).populate("facilityId", "name");

        return NextResponse.json(
            new ApiResponse(200, "Service status updated successfully", updatedService)
        );

    } catch (error: any) {
        console.error("Update service status error:", error);

        const status = error.statusCode || 500;
        return NextResponse.json(
            new ApiError(status, error.message || "Failed to update service status"),
            { status }
        );
    }
}

//* ---------------------- GET: Get Single Service ----------------------
async function getServiceById(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDb();
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const adminId = token?.sub;

        const { id: serviceId } = await params;

        const service = await verifyServiceOwnership(serviceId, adminId!);

        return NextResponse.json(
            new ApiResponse(200, "Service fetched successfully", service)
        );

    } catch (error: any) {
        console.error("Get service error:", error);

        const status = error.statusCode || 500;
        return NextResponse.json(
            new ApiError(status, error.message || "Failed to fetch service"),
            { status }
        );
    }
}

export const GET = withAdmin(getServiceById);
export const PUT = withAdmin(updateService);
export const DELETE = withAdmin(deleteService);
export const PATCH = withAdmin(updateServiceStatus);