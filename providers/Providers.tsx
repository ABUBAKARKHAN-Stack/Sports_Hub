"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { UserFacilityProvider } from "@/context/user/UserFacilityContext";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
interface Props {
    children: ReactNode;
    session: any;
}

export default function RootProvider({ children, session }: Props) {

    return (

        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                <Toaster duration={2000} position="top-center" />
                <AuthProvider>
                    <UserFacilityProvider>
                        {children}
                    </UserFacilityProvider>
                </AuthProvider>
                {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={true} />}
            </SessionProvider>
        </QueryClientProvider>
    );
}
