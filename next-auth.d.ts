import { DefaultSession } from "next-auth";
import { IUser, UserRoles } from "./types/main.types";

declare module "next-auth" {
    interface Session {
        user: Omit<IUser, "password"> & { id: string } & DefaultSession["user"];
    }

    interface User extends Omit<IUser, "password"> {
        id: string;
        role: UserRoles;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
        role: UserRoles;
    }
}
