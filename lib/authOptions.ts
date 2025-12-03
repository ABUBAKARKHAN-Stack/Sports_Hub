import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { userModel } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { connectDb } from "./dbConnect";
import { UserRoles } from "@/types/main.types";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { type: "email", label: "Email" },
                password: { type: "password", label: "Password" },
            },

            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                await connectDb();

                //* Find user by email OR phone
                const user = await userModel.findOne({
                    email: credentials.email
                });

                if (!user) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                const sessionUser = {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    isVerified: user.isVerified,
                    role: user.role,
                };

                return sessionUser;
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            try {
                if (user) {
                    //* Google OAuth login
                    if (account?.provider === "google") {
                        await connectDb();

                        let dbUser = await userModel.findOne({ email: user.email });
                        if (!dbUser) {
                            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);

                            dbUser = await userModel.create({
                                username: user.name || "Google User",
                                email: user.email!,
                                avatar: user.image || "",
                                role: UserRoles.USER,
                                isVerified: true,
                                password: randomPassword,
                            });
                        }

                        token.userId = dbUser._id.toString();
                        token.role = dbUser.role;
                    } else {
                        //* Credentials login
                        token.userId = user.id;
                        token.role = user.role || UserRoles.USER;
                    }
                }

                return token;
            } catch (err) {
                console.error("JWT callback error:", err);
                return token; //! always return token to avoid logout
            }
        },


        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.userId as string;
                session.user.role = token.role as UserRoles;
            }
            return session;
        },
    },

    pages: {
        signIn: "/signin",
        error: "/signin",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },


    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
