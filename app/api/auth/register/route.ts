import { conntectDb } from "@/lib/dbConnect";
import { userModel } from "@/models/user.model";
import { NextRequest, NextResponse, } from "next/server";
import { IUser } from "@/types/main.types";
import { userSchema } from "@/schemas/user.schema";


export const POST = async (request: NextRequest) => {
    await conntectDb()
    try {
        const userBody: IUser = await request.json();

        const sanitizedBody = userSchema.parse(userBody)

        const user = await userModel.create(sanitizedBody)
        if (!user) {
            
        }
        return NextResponse.json({
            message: "User Created"
        }, { status: 200 })

    } catch (error) {

    }
}