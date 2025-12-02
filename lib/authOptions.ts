// import { NextAuthOptions } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { userModel } from "@/models/user.model";
// import bcrypt from "bcryptjs";
// import { connectDb } from "./dbConnect";
// import { IUser } from "@/types/main.types";

// export const authOptions: NextAuthOptions = {
//     providers: [
//         Credentials({
//             name: "Credentials",
//             credentials: {
//                 identifier: { type: "text", label: "Email or Phone" },
//                 password: { type: "password", label: "Password" },
//             },

//             authorize: async (credentials) => {
//                 if (!credentials?.identifier || !credentials?.password) {
//                     return null
//                 }

//                 await connectDb();

//                 //* Find user by email OR phone
//                 const user = await userModel.findOne({
//                     $or: [
//                         { email: credentials.identifier },
//                         { phone: credentials.identifier }
//                     ],
//                 });

//                 if (!user) {
//                     return null;
//                 }

//                 const isPasswordValid = await bcrypt.compare(
//                     credentials.password,
//                     user.password
//                 );

//                 if (!isPasswordValid) {
//                     return null;
//                 }

//                 const session: Omit<IUser, "password"> = {
//                     username: user.username,
//                     email: user.email,
//                     phone: user.phone,
//                     avatar: user.avatar,
//                     isVerified: user.isVerified,
//                     role: user.role
//                 }
//                 return session
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt({
//             token,
//             user
//         }) {
//             if (user) {
//                 token.userId = user.id
//             }
//             return token
//         },

//         async redirect({ baseUrl, url }) {
//             return baseUrl
//         },

//     },

//     pages: {
//         signIn: "/signin",
//         error: "/signin",
//     },

//     session: {
//         strategy: "jwt",
//         maxAge: 30 * 24 * 60 * 60,
//     },


//     secret: process.env.NEXTAUTH_SECRET,
// };

// export default authOptions;
