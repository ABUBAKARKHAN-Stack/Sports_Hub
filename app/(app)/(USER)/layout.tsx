
import Footer from '@/components/Home_components/Footer'
import Header from '@/components/layout/Header/Header'
import { ReactNode } from 'react'

const UserLayout = ({ children }: { children: ReactNode }) => {



    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default UserLayout