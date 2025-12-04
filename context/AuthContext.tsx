"use client"

import { createContext, ReactNode, useContext } from "react";
import {
    SignInOptions,
    SignOutParams,
    signIn as NextAuthSignIn,
    signOut as NextAuthSignOut,
    useSession,

} from 'next-auth/react'
import { Session } from "next-auth";
import { useToasts } from "@/hooks/toastNotifications";
import { UserRoles } from "@/types/main.types";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { forgotPasswordSchema, resetPasswordSchema } from "@/schemas/auth.schema";

type ResetPasswordType = {
    token: string,
    newPassword: string,
    form: UseFormReturn<z.infer<typeof resetPasswordSchema>>
}

type AuthContextType = {
    session: Session | null;
    signIn: (provider?: string, options?: SignInOptions, authorizationParams?: Record<string, string>) => Promise<void>;
    signOut: (options?: SignOutParams) => Promise<void>;
    status: "authenticated" | "loading" | "unauthenticated",
    forgotPassword: (email: string, form: UseFormReturn<z.infer<typeof forgotPasswordSchema>>) => Promise<void>;
    resetPassword: ({
        form,
        newPassword,
        token
    }: ResetPasswordType) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession()
    const {
        successToast,
        errorToast,
    } = useToasts()

    const router = useRouter()



    const signIn = async (
        provider?: string,
        options?: SignInOptions,
        authorizationParams?: Record<string, string>
    ) => {
        try {
            if (provider === "credentials") {
                const resp = await NextAuthSignIn(provider, { ...options, redirect: false }, authorizationParams);

                if (resp?.ok && !resp.error) {
                    successToast("Signed in successfully!");

                    if (session?.user.role === UserRoles.SUPER_ADMIN) {
                        router.push('/super_admin/dashboard')
                    } else if (session?.user.role === UserRoles.ADMIN) {
                        router.push('/admin/dashboard')
                    } else {
                        router.push('/')
                    }

                    return;
                }

                const err = resp?.error;
                switch (err) {
                    case "CredentialsSignin":
                        errorToast("Invalid email or password.");
                        break;
                    default:
                        errorToast("Unexpected error. Please try again.");
                        break;
                }
            } else {
                //* For OAuth, just trigger popup
                await NextAuthSignIn(provider, { ...options, callbackUrl: "/" });
            }
        } catch (error: any) {
            console.error("[AuthContext] signIn() exception:", error);
            errorToast("Something went wrong. Please try again.");
        }
    };


    const signOut = async (options?: SignOutParams) => {
        try {
            await NextAuthSignOut({ ...options, callbackUrl: "/signin" });
            console.log("[AuthContext] signOut(): User signed out.");
            successToast("Signed out successfully.");

        } catch (error: any) {
            console.error("[AuthContext] signOut() error:", error);
            errorToast("Error signing out. Please try again.");
        }
    };


    const forgotPassword = async (email: string, form: UseFormReturn<z.infer<typeof forgotPasswordSchema>>) => {
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email })
            console.log(response);

            if (response.status === 200) {
                successToast(response.data.message)
                form.reset()
            }

        } catch (error: any) {
            const errMsg = error?.response?.data?.message
                || "Unable to send reset link. Please check your email and try again.";
            errorToast(errMsg);

        }
    }

    const resetPassword = async (
        { form,
            newPassword,
            token
        }: ResetPasswordType
    ) => {
        try {
            const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });

            if (response.status === 200) {
                successToast(response.data.message);
                form.reset();
                router.push('/signin')
            }

        } catch (error: any) {
            const errMsg = error?.response?.data?.message
                || "Failed to reset your password. Please try again with a valid link or request a new one.";
            errorToast(errMsg);
        }
    };


    return (
        <AuthContext.Provider value={{
            session,
            signIn,
            signOut,
            forgotPassword,
            resetPassword,
            status
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be wrap within AuthProvider")
    }
    return context
}

export {
    AuthProvider,
    useAuth
}