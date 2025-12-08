import ServiceDetailsView from '@/components/admin/services/ServiceDetailsView'
import React from 'react'

const AdminServiceDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <main><ServiceDetailsView id={id} /></main>
    )
}

export default AdminServiceDetailsPage