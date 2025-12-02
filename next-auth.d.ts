import NextAuth, { DefaultSession, JWT } from "next-auth"
import { IUser } from "./types/main.types";

declare module "next-auth" {

    interface Session {
        user: Omit<IUser, "password"> & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
    }

}