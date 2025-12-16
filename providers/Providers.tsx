"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { UserFacilityProvider } from "@/context/user/UserFacilityContext";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient } from "@/lib/queryClient";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryTags } from "@/types/query_tags";
interface Props {
    children: ReactNode;
    session: any;
}

export default function RootProvider({ children, session }: Props) {

    const persister = createAsyncStoragePersister({
        storage: window.localStorage,
        key: "cache"
    })

    return (

        <PersistQueryClientProvider client={queryClient} persistOptions={{
            persister, maxAge: Infinity,
            dehydrateOptions: {
                shouldDehydrateQuery: (query) => query.queryKey[0] === QueryTags.ME,
            }
        }}
        >
            <SessionProvider session={session}>
                <Toaster duration={2000} position="top-center" />
                <AuthProvider>
                    <UserFacilityProvider>
                        {children}
                    </UserFacilityProvider>
                </AuthProvider>
                {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={true} />}
            </SessionProvider>
        </PersistQueryClientProvider>
    );
}
