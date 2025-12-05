import AccountVerificationModal from '@/components/auth/account_verification/AccountVerificationModal'
import Footer from '@/components/Home_components/Footer'
import Header from '@/components/layout/Header/Header'
import authOptions from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'

const AppLayout = async ({ children }: { children: ReactNode }) => {
    const session = await getServerSession(authOptions)

    return (
        <>
            <Header />
            {children}
            {session && !session.user.isVerified && <AccountVerificationModal />}
            <Footer />
        </>
    )
}

export default AppLayout