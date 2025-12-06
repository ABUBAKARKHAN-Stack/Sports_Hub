import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/dbConnect';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { Facility } from '@/models/facility.model';
import { getToken } from 'next-auth/jwt';
import { UserRoles, FacilityStatusEnum } from '@/types/main.types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userRole = token?.role as UserRoles;

    //* Only super admin can update facility status
    if (userRole !== UserRoles.SUPER_ADMIN) {
      return NextResponse.json(
        new ApiError(403, "Access denied. Super admin privileges required."),
        { status: 403 }
      );
    }

    const { id } = params;
    const { status } = await req.json();

    //* Validate status
    if (!status || !Object.values(FacilityStatusEnum).includes(status)) {
      return NextResponse.json(
        new ApiError(400, "Invalid status value"),
        { status: 400 }
      );
    }

    //* Update facility status
    const updatedFacility = await Facility.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('adminId', 'username email');

    if (!updatedFacility) {
      return NextResponse.json(
        new ApiError(404, "Facility not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      new ApiResponse(200, "Facility status updated successfully", updatedFacility),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update facility status error:", error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        new ApiError(400, "Validation error", error.errors),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      new ApiError(500, "Failed to update facility status", error.message),
      { status: 500 }
    );
  }
}