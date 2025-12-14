import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ReactNode } from 'react'
import { AdminsSidebar } from './AdminSidebar'
import ContainerLayout from '../ContainerLayout'
import AdminsHeader from './AdminsHeader'

const AdminsBaseLayout = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider>
            <AdminsSidebar />
            <SidebarInset className='overflow-hidden'>
                <AdminsHeader />
                <ContainerLayout className='lg:px-6'>
                    {children}
                </ContainerLayout>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AdminsBaseLayout