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

type AuthContextType = {
    session: Session | null;
    signIn: (provider?: string, options?: SignInOptions, authorizationParams?: Record<string, string>) => Promise<void>;
    signOut: (options?: SignOutParams) => Promise<void>;
    status: "authenticated" | "loading" | "unauthenticated",
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

    return (
        <AuthContext.Provider value={{
            session,
            signIn,
            signOut,
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