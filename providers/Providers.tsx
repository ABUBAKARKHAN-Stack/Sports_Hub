"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { UserFacilityProvider } from "@/context/user/UserFacilityContext";

interface Props {
    children: ReactNode;
    session: any;
}

export default function RootProvider({ children, session }: Props) {


    return (
        <SessionProvider session={session}>
            <Toaster duration={2000} position="top-center" />
            <AuthProvider>
                <UserFacilityProvider>
                    {children}
                </UserFacilityProvider>
            </AuthProvider>
        </SessionProvider>
    );
}
