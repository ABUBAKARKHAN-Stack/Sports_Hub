"use client"

import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'



function RootProvider({ children }: { children: ReactNode }) {
    return (

        <SessionProvider>
            <Toaster duration={2000} position='top-center' />
            <AuthProvider>

                {children}
            </AuthProvider>
        </SessionProvider>
    )
}

export default RootProvider