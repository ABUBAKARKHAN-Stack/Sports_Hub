import { FacilityProvider } from '@/context/admin/FacilityContext'
import { ServiceProvider } from '@/context/admin/ServiceContext'
import { TimeSlotProvider } from '@/context/admin/TimeSlotContext'
import { UserRoles } from '@/types/main.types'
import React, { ReactNode } from 'react'

const AdminProvider = ({children}:{children:ReactNode}) => {
    return (

        <FacilityProvider>
            <ServiceProvider>
                <TimeSlotProvider defaultRole={UserRoles.ADMIN}>
                    {children}
                </TimeSlotProvider>
            </ServiceProvider>
        </FacilityProvider>
    )
}

export default AdminProvider