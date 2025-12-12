import { DefaultSession } from "next-auth";
import { IUser, UserRoles } from "./types/main.types";

declare module "next-auth" {
    interface Session {
        user: { userId: string } 
    }

    interface User {
        userId: string;
        role: UserRoles;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
        role: UserRoles;
    }
}
