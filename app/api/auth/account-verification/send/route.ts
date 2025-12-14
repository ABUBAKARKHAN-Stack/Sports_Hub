import { AccountVerificationTemplate } from "@/emails/AccountVerificationTemplate";
import authOptions from "@/lib/authOptions";
import { connectDb } from "@/lib/dbConnect";
import { resendClient } from "@/lib/resend";
import { userModel } from "@/models/user.model";
import { VerificationCodeModel } from "@/models/verificationCode.model";
import { AuthProviderEnum } from "@/types/main.types";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { generateSixDigitCode } from "@/lib/generateSixDigitCode";

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

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                new ApiError(400, "Email is required."),
                { status: 400 }
            );
        }

        const user = await userModel.findOne({
            email,
            provider: AuthProviderEnum.CREDENTIALS,
            isVerified: false,
        });

        if (!user) {
            return NextResponse.json(
                new ApiError(404, "No unverified account found with this email."),
                { status: 404 }
            );
        }

        //* TODO: Replace test email with user.email after Resend domain verification
        const EMAIL_RECEIVER =
            process.env.NODE_ENV === "development"
                ? "official.codescription@gmail.com"
                : user.email;

        //* Check for existing valid OTP
        const existingCode = await VerificationCodeModel.findOne({
            userId: user._id,
            used: false,
            expiresAt: { $gt: Date.now() },
        });

        if (existingCode) {
            const { error } = await resendClient.emails.send({
                from: "onboarding@resend.dev",
                to: EMAIL_RECEIVER,
                subject: "Verify Your Email",
                react: AccountVerificationTemplate({
                    code: existingCode.code,
                    username: user.username || "User",
                }),
            });

            if (error) {
                return NextResponse.json(
                    new ApiError(
                        error.statusCode || 502,
                        error.message || "Unable to send verification email."
                    ),
                    { status: error.statusCode || 502 }
                );
            }

            return NextResponse.json(
                new ApiResponse(200, "Verification code resent successfully."),
                { status: 200 }
            );
        }

        //* Invalidate old unused codes (safety)
        await VerificationCodeModel.updateMany(
            { userId: user._id, used: false },
            { used: true }
        );

        //* Generate new OTP
        const code = generateSixDigitCode();

        await VerificationCodeModel.create({
            userId: user._id,
            code,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            used: false,
        });

        const { error } = await resendClient.emails.send({
            from: "onboarding@resend.dev",
            to: EMAIL_RECEIVER,
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
                    error.message || "Unable to send verification email."
                ),
                { status: error.statusCode || 502 }
            );
        }

        return NextResponse.json(
            new ApiResponse(200, "Verification code sent successfully."),
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            new ApiError(500, "An unexpected error occurred."),
            { status: 500 }
        );
    }
};
