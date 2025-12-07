import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Facility } from '@/models/facility.model';
import { FacilityStatusEnum } from '@/types/main.types';

//* GET all facilities for admin
async function getFacilities(req: NextRequest) {
    try {
        await connectDb();


        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search');

        const query: any = { status: FacilityStatusEnum.APPROVED };


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




export const GET = getFacilities;
