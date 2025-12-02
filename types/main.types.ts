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
    password: string;
    role: UserRoles;
    avatar: string;
    isVerified: boolean;
    phone: string
}


export type {
    DatabaseConnectionObject,
    IUser
}

export {
    UserRoles
}