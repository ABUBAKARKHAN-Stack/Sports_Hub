import authOptions from "@/lib/authOptions";
import { connectDb } from "@/lib/dbConnect";
import { userModel } from "@/models/user.model";
import { VerificationCodeModel } from "@/models/verificationCode.model";
import { AuthProviderEnum } from "@/types/main.types";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        new ApiError(401, "Unauthorized: Access denied."),
        { status: 401 }
      );
    }

    await connectDb();

    const body = await request.json();
    const { code, email } = body;


    if (!email || !code) {
      return NextResponse.json(
        new ApiError(400, "Email and code are required."),
        { status: 400 }
      );
    }

    const user = await userModel.findOne({ email, provider: AuthProviderEnum.CREDENTIALS });

    if (!user) {
      return NextResponse.json(
        new ApiError(404, "User not found."),
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        new ApiError(400, "This account is already verified."),
        { status: 400 }
      );
    }


    const otpRecord = await VerificationCodeModel.findOne({
      userId: user._id,
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        new ApiError(400, "Invalid or expired verification code."),
        { status: 400 }
      );
    }

    otpRecord.used = true;
    await otpRecord.save();

    user.isVerified = true;
    await user.save();

    return NextResponse.json(
      new ApiResponse(200, "Account verified successfully."),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      new ApiError(500, "An unexpected error occurred."),
      { status: 500 }
    );
  }
};
