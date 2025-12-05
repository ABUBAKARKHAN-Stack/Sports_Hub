import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { userModel } from "@/models/user.model";
import { connectDb } from "./dbConnect";
import { AuthProviderEnum, UserRoles } from "@/types/main.types";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { type: "email", label: "Email" },
                password: { type: "password", label: "Password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null;

                await connectDb();

                const user = await userModel.findOne({ email: credentials.email });
                if (!user) return null;

                //* Prevent login if user registered via a different provider
                if (user.provider && user.provider !== AuthProviderEnum.CREDENTIALS) {
                    throw new Error(
                        `Account registered with ${user.provider}. Please login using that provider.`
                    );
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) return null;

                //* Return user object for JWT callback
                return {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    isVerified: user.isVerified,
                    role: user.role,
                    provider: user.provider || AuthProviderEnum.CREDENTIALS
                };
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {

        //* JWT callback
        async jwt({ token, user, account }) {
            try {
                if (user) {
                    if (account?.provider === "google") {
                        await connectDb();

                        let dbUser = await userModel.findOne({ email: user.email });

                        if (!dbUser) {
                            //* Create new Google user
                            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);

                            dbUser = await userModel.create({
                                username: user.name || "Google User",
                                email: user.email!,
                                avatar: user.image || "",
                                role: UserRoles.USER,
                                isVerified: true,
                                password: randomPassword,
                                provider: AuthProviderEnum.GOOGLE,
                            });
                        } else if (dbUser.provider && dbUser.provider !== AuthProviderEnum.GOOGLE) {
                            //* Prevent login if email exists with another provider
                            throw new Error(
                                `Account registered with ${dbUser.provider}. Please login using that provider.`
                            );
                        }

                        //* Map DB fields to token
                        token.userId = dbUser._id.toString();
                        token.role = dbUser.role;
                        token.username = dbUser.username;
                        token.avatar = dbUser.avatar || "";
                        token.isVerified = dbUser.isVerified;
                        token.provider = dbUser.provider;

                    } else {
                        //* Credentials login
                        token.userId = user.id;
                        token.role = user.role || UserRoles.USER;
                        token.username = user.username || "User";
                        token.avatar = user.avatar || "";
                        token.isVerified = user.isVerified;
                        token.provider = user.provider || AuthProviderEnum.CREDENTIALS;
                    }
                }

                return token;
            } catch (err) {
                console.error("JWT callback error:", err);
                return token; //* Always return token to avoid logout
            }
        },

        //* Session callback
        async session({ session, token, }) {
            const user = await userModel.findById(token.userId)
            
            if (session.user) {
                session.user.id = user?._id.toString() as string;
                session.user.username = user?.username as string;
                session.user.email = user?.email || "";
                session.user.avatar = user?.avatar as string;
                session.user.role = user?.role as UserRoles;
                session.user.isVerified = user?.isVerified as boolean;
                session.user.provider = user?.provider as AuthProviderEnum;
            }
            return session;
        },

        //* SignIn callback
        async signIn({ user, account }) {
            if (!account) return true;

            await connectDb();

            if (account.provider === "google") {
                const dbUser = await userModel.findOne({ email: user.email });
                if (dbUser && dbUser.provider !== AuthProviderEnum.GOOGLE) {
                    console.log("Provider conflict:", dbUser.provider);
                    return false; //* Block login, redirect to error page
                }
            }

            return true;
        },
    },

    pages: {
        signIn: "/signin",
        error: "/signin", //* Show error page or toast for provider conflict
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, //* 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
