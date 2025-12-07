import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { withAdmin } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Facility } from '@/models/facility.model';
import { userModel } from '@/models/user.model';
import { FacilityStatusEnum } from '@/types/main.types';
import { getToken } from 'next-auth/jwt';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

//* GET all facilities for admin
async function getFacilities(req: NextRequest) {
    try {
        await connectDb();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const adminId = token?.sub;      

        if (!adminId) {
            return NextResponse.json(
                new ApiError(401, "Unauthorized"),
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const query: any = { adminId };

        if (status && Object.values(FacilityStatusEnum).includes(status as FacilityStatusEnum)) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } },
                { 'location.address': { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const [facilities, total] = await Promise.all([
            Facility.find(query)
                .populate('services', 'title price')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Facility.countDocuments(query)
        ]);

        const paginatedResponse = {
            data: facilities,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };

        return NextResponse.json(
            new ApiResponse(200, "Facilities fetched successfully", paginatedResponse),
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Get facilities error:", error);
        return NextResponse.json(
            new ApiError(500, "Failed to fetch facilities", error.message),
            { status: 500 }
        );
    }
}

//* POST create new facility
async function createFacility(req: NextRequest) {
    try {
        await connectDb();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const adminId = token?.sub;

        if (!adminId) {
            return NextResponse.json(new ApiError(401, "Unauthorized"), { status: 401 });
        }


        //* Read FormData instead of JSON
        const formData = await req.formData();


        //* Extract text fields
        const name = formData.get("name") as string;
        const location = JSON.parse(formData.get("location") as string);
        const contact = JSON.parse(formData.get("contact") as string);
        const openingHours = JSON.parse(formData.get("openingHours") as string);

        const required = [name, location, contact, openingHours];
        if (required.some((v) => !v)) {
            return NextResponse.json(
                new ApiError(400, "Missing required fields"),
                { status: 400 }
            );
        }

        //* Check admin exists
        const admin = await userModel.findById(adminId);
        if (!admin) {
            return NextResponse.json(new ApiError(404, "Admin not found"), { status: 404 });
        }

        //* CLOUDINARY UPLOAD SECTION

        const galleryImages: string[] = [];
        let galleryVideo: string = "";

        //* Upload multiple images
        const images = formData.getAll("images") as File[];
        for (const file of images) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploaded = await uploadToCloudinary(buffer, "facilities/gallery", "image");
            console.log("Image Uploaded On Cloudinary", uploaded.public_id);
            galleryImages.push(uploaded.secure_url);
        }

        //* Upload intro video
        const videoFile = formData.get("introductoryVideo") as File | null;
        if (videoFile) {
            const buffer = Buffer.from(await videoFile.arrayBuffer());
            const uploadedVideo = await uploadToCloudinary(
                buffer,
                "facilities/videos",
                "video"
            );
            console.log("Video Uploaded On Cloudinary", uploadedVideo.public_id);
            galleryVideo = uploadedVideo.secure_url;
        }

        //* Create Facility

        const newFacility = await Facility.create({
            name,
            location,
            contact,
            openingHours,
            adminId,
            status: FacilityStatusEnum.PENDING,
            services: [],
            gallery: {
                images: galleryImages,
                introductoryVideo: galleryVideo
            }
        });

        return NextResponse.json(
            new ApiResponse(201, "Facility created successfully", newFacility),
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Create facility error:", error);

        return NextResponse.json(
            new ApiError(500, error.message || "Failed to create facility"),
            { status: 500 }
        );
    }
}


export const GET = withAdmin(getFacilities);
export const POST = withAdmin(createFacility)