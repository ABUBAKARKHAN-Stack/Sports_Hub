import { AccountVerificationTemplate } from "@/emails/AccountVerificationTemplate";
import authOptions from "@/lib/authOptions";
import { connectDb } from "@/lib/dbConnect";
import { resendClient } from "@/lib/resend";
import { userModel } from "@/models/user.model";
import { VerificationCodeModel } from "@/models/verificationCode.model";
import { AuthProviderEnum, UserRoles } from "@/types/main.types";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { generateSixDigitCode } from "@/lib/generateSixDigitCode";

export const GET = async (request: NextRequest) => {
    
    try {
        const session = await getServerSession(authOptions);
    
        if (!session) {
            return NextResponse.json(
                new ApiError(401, "Unauthorized: Access denied."),
                { status: 401 }
            );
        }
    
        await connectDb();

        const { email } = session.user;

        if (!email) {
            return NextResponse.json(
                new ApiError(400, "Email is required."),
                { status: 400 }
            );
        }

        const user = await userModel.findOne({
            email,
            provider: AuthProviderEnum.CREDENTIALS,
            isVerified: false
        });

        if (!user) {
            return NextResponse.json(
                new ApiError(404, "No account found with this email."),
                { status: 404 }
            );
        }

      

        //* Generate 6-digit OTP
        const code = generateSixDigitCode();


        //* Save OTP in VerificationCode Model
        await VerificationCodeModel.create({
            userId: user._id,
            code,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), //* 10 min expiry
            used: false,
        });

        //* Send OTP via Resend 
        const { error } = await resendClient.emails.send({
            from: "onboarding@resend.dev",
            to: "official.codescription@gmail.com",
            subject: "Verify Your Email",
            react: AccountVerificationTemplate({
                code,
                username: user.username || "User",
            }),
        });

        if (error) {
            return NextResponse.json(
                new ApiError(
                    error.statusCode || 502,
                    error.message || "Unable to send the verification email. Please try again later."
                ),
                { status: error.statusCode || 502 }
            );
        }

        return NextResponse.json(
            new ApiResponse(200, "A verification code has been sent to your email."),
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            new ApiError(500, "An unexpected error occurred. Please try again later."),
            { status: 500 }
        );
    }
};
