import Footer from '@/components/Home_components/Footer'
import Header from '@/components/layout/Header/Header'
import React, { ReactNode } from 'react'

const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default AppLayout