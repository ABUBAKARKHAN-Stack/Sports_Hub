import { connectDb } from "@/lib/dbConnect";
import { userModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { IUser } from "@/types/main.types";
import { userSchema } from "@/schemas/user.schema";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

export const POST = async (request: NextRequest) => {
    await connectDb();

    try {
        //* Extract Request body
        const userBody: IUser = await request.json();

        

        //* Sanitize and validate userBody
        const sanitizedBody = userSchema.parse(userBody);

                console.log(sanitizedBody);

        //* Create user 
        const user = await userModel.create({ ...sanitizedBody });

        if (!user) {
            return NextResponse.json(
                new ApiError(500, "Failed to create user"),
                { status: 500 }
            );
        }

        return NextResponse.json(
            new ApiResponse(201, "User Created", { userId: user._id }),
            { status: 201 }
        );
    } catch (error: any) {

        //! Handle Zod validation errors
        if (error.name === "ZodError") {
            return NextResponse.json(
                new ApiError(400, "Invalid Input."),
                { status: 400 }
            );
        }

        //! Handle MongoDB duplicate key error
        if (error.code === 11000) {            
            const field = Object.keys(error.keyValue)[0];
            return NextResponse.json(
                new ApiError(409, `User with this ${field} already exists.`),
                { status: 409 }
            );
        }

        //! Generic server error
        return NextResponse.json(
            new ApiError(500, "Internal Server Error", error),
            { status: 500 }
        );
    }
};
