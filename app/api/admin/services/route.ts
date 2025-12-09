import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { withAdmin } from '@/middlewares/auth';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Service } from '@/models/service.model';
import { Facility } from '@/models/facility.model';
import { getToken } from 'next-auth/jwt';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

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
    const isActive = searchParams.get("isActive")

    const query: any = { facilityId: { $in: facilityIds } };

    if (facilityId) {
      query.facilityId = facilityId;
    }

    if (isActive) {
      query.isActive = isActive
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

    if (!adminId) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), { status: 401 });
    }

    const body = await req.formData();


    //* Validate required fields
    const requiredFields = ['title', 'facilityId', 'price', 'duration', 'capacity', "category"];
    const missingFields = requiredFields.filter(field => !body.get(field));

    if (missingFields.length > 0) {
      return NextResponse.json(
        new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`),
        { status: 400 }
      );
    }


    //* Verify admin owns this facility
    const facility = await Facility.findOne({
      _id: body.get('facilityId'),
      adminId
    });

    if (!facility) {
      return NextResponse.json(
        new ApiError(403, "You don't have permission to add services to this facility"),
        { status: 403 }
      );
    }


    //* IMAGE VALIDATION: At least 1 image, max 5
    const imageFiles = body.getAll('images') as File[];

    if (imageFiles.length === 0) {
      return NextResponse.json(
        new ApiError(400, "At least one image is required"),
        { status: 400 }
      );
    }

    if (imageFiles.length > 5) {
      return NextResponse.json(
        new ApiError(400, "Maximum 5 images allowed"),
        { status: 400 }
      );
    }

    //* Validate image types
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidImages = imageFiles.filter(file => !allowedImageTypes.includes(file.type));

    if (invalidImages.length > 0) {
      return NextResponse.json(
        new ApiError(400, `Invalid image type. Allowed: ${allowedImageTypes.join(', ')}`),
        { status: 400 }
      );
    }

    //* CLOUDINARY UPLOAD SECTION
    const serviceImages: string[] = [];

    //* Upload images to Cloudinary
    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadToCloudinary(buffer, "services/images", "image");
      console.log("Image Uploaded On Cloudinary", uploaded.public_id);
      serviceImages.push(uploaded.secure_url);
    }

    //* Create service data object
    const serviceData = {
      title: body.get('title') as string,
      description: body.get('description') as string || '',
      facilityId: body.get('facilityId') as string,
      price: parseFloat(body.get('price') as string),
      duration: parseInt(body.get('duration') as string),
      capacity: parseInt(body.get('capacity') as string),
      category: body.get('category') as string,
      images: serviceImages,
      isActive: body.get('isActive') ? body.get('isActive') === 'true' : true
    };

    const newService = new Service({
      ...serviceData,
      category: serviceData.category.toLowerCase().replace(/\s+/g, "")
    });

    await newService.save();

    //* Add service to facility's services array
    await Facility.findByIdAndUpdate(body.get('facilityId'), {
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
