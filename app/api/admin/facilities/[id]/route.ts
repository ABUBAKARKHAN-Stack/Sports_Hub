import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Facility } from '@/models/facility.model';
import { getToken } from 'next-auth/jwt';
import { UserRoles } from '@/types/main.types';
import { isValidObjectId } from 'mongoose';
import { deleteFromCloudinary, extractPublicId } from '@/lib/uploadToCloudinary';

export async function GET(
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

    //* For admin, only show facilities they own
    //* For super admin, show all facilities
    const query: any = { _id: id };
    if (userRole === UserRoles.ADMIN) {
      query.adminId = adminId;
    }

    const facility = await Facility.findById(id)
      .populate('services', 'title price duration')
      .populate('adminId', 'username email');

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
    const body = await req.json();

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

    // Update facility
    const updatedFacility = await Facility.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate('services', 'title price');

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