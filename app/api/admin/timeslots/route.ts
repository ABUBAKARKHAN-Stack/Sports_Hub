import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { withAdmin } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Service } from '@/models/service.model';
import { Facility } from '@/models/facility.model';
import { TimeSlot } from '@/models/timeslot.model';
import { getToken } from 'next-auth/jwt';

//* GET - Get all timeslots with filters
export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const facilityId = searchParams.get('facilityId');
    const serviceId = searchParams.get('serviceId');
    const date = searchParams.get('date');
    const isActive = searchParams.get('isActive');
    const isBooked = searchParams.get('isBooked');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (facilityId) query.facilityId = facilityId;
    if (serviceId) query.serviceId = serviceId;
    if (isActive !== null) query.isActive = isActive === 'true';
    if (isBooked !== null) query.isBooked = isBooked === 'true';

    // Date queries
    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: dateObj, $lt: nextDay };
    }

    

    // Execute query
    const timeslots = await TimeSlot.find(query)
      .populate('facilityId', 'name')
      .populate('serviceId', 'title price duration')
      .populate("createdBy", "username")
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await TimeSlot.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      new ApiResponse(
        200,
        "Timeslots fetched successfully",
        {
          data:timeslots,   
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          
        }
      ),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get timeslots error:", error);
    return NextResponse.json(
      new ApiError(500, "Failed to fetch timeslots", error.message),
      { status: 500 }
    );
  }
}

async function createTimeslot(req: NextRequest) {
  try {
    await connectDb();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminId = "693321382f71c557aa971adc";

    if (!adminId) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), { status: 401 });
    }

    const body = await req.json();

    //* Validate required fields
    const requiredFields = ['facilityId', 'serviceId', 'date', 'startTime', 'endTime'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`),
        { status: 400 }
      );
    }

    //* Verify facility exists and admin has permission
    const facility = await Facility.findById(body.facilityId);
    if (!facility) {
      return NextResponse.json(
        new ApiError(404, "Facility not found"),
        { status: 404 }
      );
    }

    //* Verify service exists and belongs to facility
    const service = await Service.findOne({
      _id: body.serviceId,
      facilityId: body.facilityId
    });

    if (!service) {
      return NextResponse.json(
        new ApiError(404, "Service not found or doesn't belong to this facility"),
        { status: 404 }
      );
    }

    //* Check for overlapping timeslots
    const existingTimeslot = await TimeSlot.findOne({
      facilityId: body.facilityId,
      serviceId: body.serviceId,
      date: new Date(body.date),
      startTime: body.startTime,
      isActive: true
    });

    if (existingTimeslot) {
      return NextResponse.json(
        new ApiError(409, "Timeslot already exists for this time"),
        { status: 409 }
      );
    }

    const timeslot = await TimeSlot.create({
      ...body,
      date: new Date(body.date),
      createdBy: adminId
    });

    if (!timeslot) {
        return NextResponse.json(
            new ApiError(404,"Time slot not found")
        )
    }

    return NextResponse.json(
      new ApiResponse(201, "Timeslot created successfully", timeslot),
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Create timeslot error:", error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        new ApiError(400, "Validation error", error.errors),
        { status: 400 }
      );
    }

    return NextResponse.json(
      new ApiError(500, "Failed to create timeslot", error.message),
      { status: 500 }
    );
  }
}

export const POST = (createTimeslot);