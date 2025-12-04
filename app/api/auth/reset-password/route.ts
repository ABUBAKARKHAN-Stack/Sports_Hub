import { connectDb } from "@/lib/dbConnect";
import { userModel } from "@/models/user.model";
import { AuthProviderEnum } from "@/types/main.types";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
    await connectDb();

    try {
        const { token, newPassword } = await request.json();

        if (!token) {
            return NextResponse.json(
                new ApiError(400, "Password reset token is missing."),
                { status: 400 }
            );
        }

        if (!newPassword) {
            return NextResponse.json(
                new ApiError(400, "New password is required."),
                { status: 400 }
            );
        }

        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                return NextResponse.json(
                    new ApiError(401, "Your reset link has expired. Please request a new one."),
                    { status: 401 }
                );
            }
            return NextResponse.json(
                new ApiError(400, "The provided token is invalid."),
                { status: 400 }
            );
        }

        const { email } = decodedToken;

        if (!email) {
            return NextResponse.json(
                new ApiError(400, "The token does not contain a valid email."),
                { status: 400 }
            );
        }

        const user = await userModel.findOne({
            email,
            provider: AuthProviderEnum.CREDENTIALS
        });

        if (!user) {
            return NextResponse.json(
                new ApiError(404, "No account found with this email address."),
                { status: 404 }
            );
        }

        //* Check if new password is same as current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return NextResponse.json(
                new ApiError(400, "New password cannot be the same as your current password."),
                { status: 400 }
            );
        }

        //* Hash and save new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json(
            new ApiResponse(200, "Your password has been successfully reset."),
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            new ApiError(500, "Something went wrong. Please try again later."),
            { status: 500 }
        );
    }
};
