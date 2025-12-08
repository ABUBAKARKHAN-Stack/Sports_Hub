'use client';

import { useRouter } from 'next/navigation';
import ServiceForm from '@/components/admin/services/ServiceForm';
import { useService } from '@/context/admin/ServiceContext';

export default function CreateServicePage() {
    const router = useRouter();
    const { createService ,state} = useService();

    const handleSubmit = async (data: FormData) => {
        try {
            await createService(data);
            router.push('/admin/services');
        } catch (error) {
            console.error('Failed to create service:', error);
        }
    };

    const handleCancel = () => {
        router.push('/admin/services');
    };

    return (
        <main className='space-y-6'>
            <ServiceForm
            
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={state.loading}
                goBackUrl="/admin/services"
            />
        </main>
    );
}