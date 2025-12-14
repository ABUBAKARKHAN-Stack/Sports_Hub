import { connectDb } from "@/lib/dbConnect";
import { userModel } from "@/models/user.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
        
        const userId = token?.userId
        if (!userId) {
            return NextResponse.json(
                new ApiError(401, "Unauthorized"),
                { status: 401 }
            )
        }
        await connectDb()

        const user = await userModel
            .findById(userId)
            .select('-password')
            .lean()


        if (!user) {
            return NextResponse.json(
                new ApiError(404, "User not found!"),
                { status: 404 }
            )
        }

        return NextResponse.json(
            new ApiResponse(200, 'Account Details Fetched Successfully!', user)
        )

    } catch (error: any) {
        return NextResponse.json(
            new ApiError(500, "Failed to create service", error.message),
            { status: 500 }
        );
    }
}