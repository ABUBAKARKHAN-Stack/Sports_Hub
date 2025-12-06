import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { withAdmin } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Facility } from '@/models/facility.model';
import { userModel } from '@/models/user.model';
import { FacilityStatusEnum } from '@/types/main.types';
import { getToken } from 'next-auth/jwt';

//* GET all facilities for admin
async function getFacilities(req: NextRequest) {
    try {
        await connectDb();

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const adminId = token?.sub; // Changed from userId to sub

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
        const adminId = token?.sub; // Changed from userId to sub

        if (!adminId) {
            return NextResponse.json(
                new ApiError(401, "Unauthorized"),
                { status: 401 }
            );
        }

        const body = await req.json();

        //* Validate required fields
        const requiredFields = ['name', 'location', 'contact', 'openingHours'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`),
                { status: 400 }
            );
        }

        //* Check if admin exists
        const admin = await userModel.findById(adminId);
        if (!admin) {
            return NextResponse.json(
                new ApiError(404, "Admin not found"),
                { status: 404 }
            );
        }

        const facilityData = {
            ...body,
            adminId,
            status: FacilityStatusEnum.PENDING,
            services: [],
            images: body.images || [],
            documents: body.documents || []
        };

        const newFacility = new Facility(facilityData);
        await newFacility.save();

        return NextResponse.json(
            new ApiResponse(201, "Facility created successfully. Waiting for super admin approval.", newFacility),
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Create facility error:", error);

        if (error.name === 'ValidationError') {
            return NextResponse.json(
                new ApiError(400, "Validation error", error.errors),
                { status: 400 }
            );
        }

        return NextResponse.json(
            new ApiError(500, "Failed to create facility", error.message),
            { status: 500 }
        );
    }
}

export const GET = withAdmin(getFacilities);
export const POST = withAdmin(createFacility);