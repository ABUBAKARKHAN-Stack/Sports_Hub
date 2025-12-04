import Link from 'next/link'
import AuthFormContainer from '@/components/auth/AuthFormContainer'
import AuthFormHeader from '@/components/auth/AuthFormHeader'
import ResetPasswordForm from '@/components/auth/forms/ResetPasswordForm'
import ContainerLayout from '@/components/layout/ContainerLayout'
import { CircleAlert } from 'lucide-react'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const ResetPasswordPage = async (props: { searchParams: SearchParams }) => {
    const { token } = await props.searchParams

    if (!token) {
        return (
            <main className='min-h-screen flex items-center justify-center bg-gray-50'>
                <ContainerLayout>
                    <section className='max-w-md mx-auto shadow-lg p-8 rounded-lg bg-white text-center'>
                        <div className='flex flex-col items-center gap-4'>

                            <CircleAlert className='size-12 text-destructive' />

                            <h1 className='text-2xl font-semibold text-destructive'>Invalid Request</h1>
                            <p className='text-muted'>
                                The password reset link is invalid, expired, or missing required information.
                            </p>

                            <Link
                                href="signin"
                                className='mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors'
                            >
                                Go to Login
                            </Link>
                        </div>
                    </section>
                </ContainerLayout>
            </main>
        )
    }

    return (
        <main className='min-h-screen flex items-center justify-center'>
            <ContainerLayout>
                <section className='max-w-md mx-auto shadow-lg'>

                    <AuthFormContainer>
                        <AuthFormHeader
                            title="Change Password"
                            description="Your new password must be different from previously used password"
                        />

                        {/* Reset Password Form */}
                        <ResetPasswordForm token={token as string} />
                    </AuthFormContainer>
                </section>
            </ContainerLayout>
        </main>
    )
}

export default ResetPasswordPage
