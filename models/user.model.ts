import { AuthProviderEnum, IUser } from "@/types/main.types";
import { Schema, models, Model, model } from "mongoose";
import { UserRoles } from "@/types/main.types";
import { Document } from "mongoose";

type UserModelType = IUser & Document
const UserSchema = new Schema<UserModelType>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: null },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRoles), default: UserRoles.USER },
    avatar: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    provider: {type:String, enum: Object.values(AuthProviderEnum),default: AuthProviderEnum.CREDENTIALS}
},{timestamps:true})


export const userModel = (models?.User as Model<UserModelType, {}>) || model<UserModelType>("User", UserSchema)
