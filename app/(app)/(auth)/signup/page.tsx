import ContainerLayout from '@/components/layout/ContainerLayout'
import AuthFormContainer from '@/components/auth/AuthFormContainer'
import AuthFormHeader from '@/components/auth/AuthFormHeader'
import AuthImageBanner from '@/components/auth/AuthImageBanner'
import { brandName } from '@/constants/main.constants'
import { ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import SignupForm from '@/components/auth/forms/SignupForm'
import AuthFormFooter from '@/components/auth/AuthFormFooter'

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

                        {/* SignUp Form */}
                        <SignupForm />

                      <AuthFormFooter type='signup' />
                    </AuthFormContainer>
                </section>
            </ContainerLayout>
        </main>
    )
}

export default SignupPage
