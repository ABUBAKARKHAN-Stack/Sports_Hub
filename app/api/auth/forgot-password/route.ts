import { ForgotPasswordEmailTemplate } from "@/components/email_templates/ForgotPasswordEmailTemplate";
import { brandName } from "@/constants/main.constants";
import { connectDb } from "@/lib/dbConnect";
import { generateToken } from "@/lib/generateToken";
import { resendClient } from "@/lib/resend";
import { userModel } from "@/models/user.model";
import { AuthProviderEnum } from "@/types/main.types";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    await connectDb();

    try {
        const { email } = await request.json();

        console.log(email);
        

        if (!email) {
            return NextResponse.json(
                new ApiError(400, "Email is required."),
                { status: 400 }
            );
        }


        const user = await userModel.findOne({
            email,
            provider: AuthProviderEnum.CREDENTIALS
        });

        if (!user) {
            return NextResponse.json(
                new ApiError(404, "No account found with this email."),
                { status: 404 }
            );
        }

        const token = generateToken({ email: user.email });

        const { error } = await resendClient.emails.send({
            from: 'onboarding@resend.dev',
            to: 'official.codescription@gmail.com',
            subject: "Reset Your Password",
            react: ForgotPasswordEmailTemplate({ token, username: user.username })
        });

        if (error) {
            return NextResponse.json(
                new ApiError(
                    error.statusCode || 502,
                    error.message || "Unable to send the password reset email at this time. Please try again later."
                ),
                { status: error.statusCode || 502 }
            );
        }

        return NextResponse.json(
            new ApiResponse(200, "A reset link has been sent to your email."),
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            new ApiError(500, "An unexpected error occurred. Please try again later."),
            { status: 500 }
        );
    }
};
