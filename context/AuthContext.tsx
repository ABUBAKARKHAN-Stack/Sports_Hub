"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import {
    SignInOptions,
    SignOutParams,
    signIn as NextAuthSignIn,
    signOut as NextAuthSignOut,
    useSession,

} from 'next-auth/react'
import { Session } from "next-auth";
import { useToasts } from "@/hooks/toastNotifications";
import { IUser, UserRoles } from "@/types/main.types";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { accountVerificationSchema, forgotPasswordSchema, resetPasswordSchema } from "@/schemas/auth.schema";
import { useAuthQuery } from "@/hooks/queries/useAuthQuery";
import { queryClient } from "@/lib/queryClient";
import { QueryTags } from "@/types/query_tags";

type ResetPasswordType = {
    token: string,
    newPassword: string,
    form: UseFormReturn<z.infer<typeof resetPasswordSchema>>
}

type VerifyAccountType = {
    code: string,
    form: UseFormReturn<z.infer<typeof accountVerificationSchema>>;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

type AuthContextType = {
    user: IUser | null | undefined;
    signIn: (provider?: string, options?: SignInOptions, authorizationParams?: Record<string, string>) => Promise<void>;
    signOut: (options?: SignOutParams) => Promise<void>;
    status: "authenticated" | "loading" | "unauthenticated",
    forgotPassword: (email: string, form: UseFormReturn<z.infer<typeof forgotPasswordSchema>>) => Promise<void>;
    resetPassword: ({
        form,
        newPassword,
        token
    }: ResetPasswordType) => Promise<void>;
    sendVerificationEmail: (setCodeSent: Dispatch<SetStateAction<boolean>>) => Promise<void>;
    verifyAccount: ({ code, form }: VerifyAccountType) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status, update } = useSession()
    const {
        successToast,
        errorToast,
    } = useToasts()
    const {
        getUserDetails
    } = useAuthQuery()

    const { data: user } = getUserDetails(session)

    const router = useRouter()


    const signIn = async (
        provider?: string,
        options?: SignInOptions,
        authorizationParams?: Record<string, string>
    ) => {
        try {
            if (provider === "credentials") {
                const resp = await NextAuthSignIn(provider, { ...options, redirect: false, }, authorizationParams);

                if (resp?.ok && !resp.error) {
                    successToast("Signed in successfully!");
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
            queryClient.removeQueries({
                queryKey: [QueryTags.ME]
            })
            localStorage.removeItem('cache')  //* Clear react-query cache on sign out

            await NextAuthSignOut({ ...options, callbackUrl: "/signin",redirect:true });
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

    const sendVerificationEmail = async (setCodeSent: Dispatch<SetStateAction<boolean>>) => {
        try {
            const response = await axiosInstance.get('/auth/account-verification/send')
            if (response.status === 200) {
                successToast("Verification code sent! Check your email.");
                setCodeSent(true)
            }

        } catch (error: any) {
            const errMsg = error?.response?.data?.message
                || "Failed to  Account Verificaton email. Please try again with a valid link or request a new one.";
            errorToast(errMsg);
        }
    }

    const verifyAccount = async ({ code, form, setIsOpen }: VerifyAccountType) => {
        try {
            const response = await axiosInstance.post('/auth/account-verification/verify-otp', { code });
            if (response.status === 200) {
                console.log('EY');

                form.reset();
                successToast(response.data.message);
                setIsOpen(false)
                await update()

            }
        } catch (error: any) {
            const errMsg = error?.response?.data?.message
                || "Failed to verify your account. Please try again with a valid code or request a new one.";
            errorToast(errMsg);
        }
    }


    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            forgotPassword,
            resetPassword,
            status,
            sendVerificationEmail,
            verifyAccount
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