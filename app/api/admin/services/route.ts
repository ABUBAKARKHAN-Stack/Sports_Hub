import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { withAdmin } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Service } from '@/models/service.model';
import { Facility } from '@/models/facility.model';
import { getToken } from 'next-auth/jwt';

//* GET all services for admin's facilities
async function getServices(req: NextRequest) {
  try {
    await connectDb();
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminId = token?.sub;

    //* Get facilities managed by this admin
    const facilities = await Facility.find({ adminId });
    const facilityIds = facilities.map(f => f._id);

    if (facilityIds.length === 0) {
      return NextResponse.json(
        new ApiResponse(200, "No facilities found", { data: [], total: 0 }),
        { status: 200 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const facilityId = searchParams.get('facilityId');
    const search = searchParams.get('search');

    const query: any = { facilityId: { $in: facilityIds } };
    
    if (facilityId) {
      query.facilityId = facilityId;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('facilityId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Service.countDocuments(query)
    ]);

    const paginatedResponse = {
      data: services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };

    return NextResponse.json(
      new ApiResponse(200, "Services fetched successfully", paginatedResponse),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get services error:", error);
    return NextResponse.json(
      new ApiError(500, "Failed to fetch services", error.message),
      { status: 500 }
    );
  }
}

//* POST create new service
async function createService(req: NextRequest) {
  try {
    await connectDb();
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const adminId = token?.sub;

    const body = await req.json();
    
    //* Validate required fields
    const requiredFields = ['title', 'facilityId', 'price', 'duration', 'capacity'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`),
        { status: 400 }
      );
    }

    //* Verify admin owns this facility
    const facility = await Facility.findOne({
      _id: body.facilityId,
      adminId
    });

    if (!facility) {
      return NextResponse.json(
        new ApiError(403, "You don't have permission to add services to this facility"),
        { status: 403 }
      );
    }

    const serviceData = {
      ...body,
      price: parseFloat(body.price),
      duration: parseInt(body.duration),
      capacity: parseInt(body.capacity),
      images: body.images || [],
      isActive: true
    };

    const newService = new Service(serviceData);
    await newService.save();

    //* Add service to facility's services array
    await Facility.findByIdAndUpdate(body.facilityId, {
      $push: { services: newService._id }
    });

    return NextResponse.json(
      new ApiResponse(201, "Service created successfully", newService),
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Create service error:", error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        new ApiError(400, "Validation error", error.errors),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      new ApiError(500, "Failed to create service", error.message),
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getServices);
export const POST = withAdmin(createService);