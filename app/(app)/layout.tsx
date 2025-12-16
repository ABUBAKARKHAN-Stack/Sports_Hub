"use client"

import AccountVerificationModal from '@/components/auth/account_verification/AccountVerificationModal'
import { useAuth } from '@/context/AuthContext'
import { ReactNode } from 'react'

const AppLayout = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth()

    return (
        <>
            {children}
            {user && !user.isVerified && <AccountVerificationModal />}
        </>
    )
}

export default AppLayout