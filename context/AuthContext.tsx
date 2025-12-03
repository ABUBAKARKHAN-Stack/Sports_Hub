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

type AuthContextType = {
    user: Session | null;
    signIn: (provider?: string, options?: SignInOptions, authorizationParams?: Record<string, string>) => Promise<void>;
    signOut: (options?: SignOutParams) => Promise<void>;
    status: "authenticated" | "loading" | "unauthenticated",
}

const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session,status } = useSession()
    const {
        successToast,
        errorToast,
    } = useToasts()



    const signIn = async (
        provider?: string,
        options?: SignInOptions,
        authorizationParams?: Record<string, string>
    ) => {
        try {
            const resp = await NextAuthSignIn(
                provider,
                { ...options, redirect: false },
                authorizationParams
            );

            //! No response
            if (!resp?.ok) {
                console.error("[AuthContext] signIn(): No response from NextAuth");
                errorToast("Unable to sign in. Please try again.");
                return;
            }

            //* Success
            if (resp.ok && !resp.error) {
                console.log("[AuthContext] signIn() success:", resp);
                successToast("Signed in successfully!");
                return;
            }

            //! Error Handling
            const err = resp.error;
            console.error("[AuthContext] signIn() error:", err);

            switch (err) {
                case "CredentialsSignin":
                    errorToast("Invalid email or password.");
                    break;

                case "OAuthSignin":
                    errorToast("OAuth Sign-in failed. Try again.");
                    break;

                case "OAuthAccountNotLinked":
                    errorToast("Account exists with a different sign-in method.");
                    break;

                case "AccessDenied":
                    errorToast("Access denied. Contact support.");
                    break;

                case "Configuration":
                    errorToast("Auth configuration error. Try later.");
                    break;

                case "Callback":
                    errorToast("Authentication callback failed.");
                    break;

                default:
                    errorToast("Unexpected error. Please try again.");
                    break;
            }

        } catch (error: any) {
            console.error("[AuthContext] signIn() exception:", error);
            errorToast("Something went wrong. Please try again.");
        }
    };


    const signOut = async (options?: SignOutParams) => {
        try {
            await NextAuthSignOut(options);
            console.log("[AuthContext] signOut(): User signed out.");
            successToast("Signed out successfully.");
        } catch (error: any) {
            console.error("[AuthContext] signOut() error:", error);
            errorToast("Error signing out. Please try again.");
        }
    };

    return (
        <AuthContext.Provider value={{
            user: session,
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