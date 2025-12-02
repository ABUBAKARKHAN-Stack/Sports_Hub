import { Document } from "mongoose"

type DatabaseConnectionObject = {
    isConntected?: number
}

enum UserRoles {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

interface IBooking { }
interface IPayment { }
interface IReview { }

interface IUser  {
    username: string;
    email: string;
    phone: string;
    password: string
    role: UserRoles
    avatar: String,
    isVerified?: boolean;
}


export type {
    DatabaseConnectionObject,
    IUser
}

export {
    UserRoles
}