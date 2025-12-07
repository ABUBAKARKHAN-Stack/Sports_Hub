import { connectDb } from "@/lib/dbConnect";
import { Facility } from "@/models/facility.model";
import { UserRoles } from "@/types/main.types";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userRole = token?.role as UserRoles;

    if (userRole !== UserRoles.SUPER_ADMIN) {
      return NextResponse.json(
        new ApiError(403, "Access denied. Super Admin privileges required."),
        { status: 403 }
      );
    }

    const { id } = await params;

   
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