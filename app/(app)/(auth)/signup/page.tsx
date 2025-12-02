import ContainerLayout from '@/components/layout/ContainerLayout'
import AuthFormContainer from '@/components/auth/AuthFormContainer'
import AuthFormHeader from '@/components/auth/AuthFormHeader'
import AuthImageBanner from '@/components/auth/AuthImageBanner'
import { brandName } from '@/constants/main.constants'
import { ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import SignupForm from '@/components/auth/forms/SignupForm'

const SignupPage = () => {
    return (
        <main className='min-h-screen flex items-center justify-center'>
            <ContainerLayout>
                <section className='grid lg:grid-cols-2 grid-cols-1 shadow-lg'>

                    {/* Left Image */}
                    <AuthImageBanner
                        imageSrc='/assets/imgs/signup.png'
                        title='Register Now'
                        description='Register now for our innovative sports software solutions, designed to tackle challenges in everyday sports activities and events.'
                    />

                    {/* Right Form */}
                    <AuthFormContainer>

                        <AuthFormHeader
                            title={`Get Started With ${brandName}`}
                            description={`Ignite your sports journey with ${brandName} and get started now.`}
                        />

                        {/* Buttons */}
                        <div className='flex gap-4 mb-4'>
                            <button className='px-4 py-2 border border-green-500 text-green-500 rounded'>
                                I am a User
                            </button>
                            <button className='px-4 py-2 border border-gray-300 text-gray-500 rounded'>
                                Venue Manager
                            </button>
                        </div>

                        {/* Form */}
                        <SignupForm />

                        <p className='text-center text-sm mt-4'>
                            Or continue with
                        </p>
                        <div className='flex justify-center gap-4 mt-2'>
                            <button className='border px-4 py-2 rounded'>Google</button>
                            <button className='border px-4 py-2 rounded'>Facebook</button>
                        </div>

                        <p className='text-center text-sm mt-4'>
                            Have an account? <span className='text-green-500 cursor-pointer'>Sign In</span>
                        </p>
                    </AuthFormContainer>
                </section>
            </ContainerLayout>
        </main>
    )
}

export default SignupPage
