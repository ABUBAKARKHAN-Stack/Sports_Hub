import AuthFormContainer from '@/components/auth/AuthFormContainer'
import AuthFormFooter from '@/components/auth/AuthFormFooter'
import AuthFormHeader from '@/components/auth/AuthFormHeader'
import AuthImageBanner from '@/components/auth/AuthImageBanner'
import SigninForm from '@/components/auth/forms/SigninForm'
import SignupForm from '@/components/auth/forms/SignupForm'
import ContainerLayout from '@/components/layout/ContainerLayout'
import React from 'react'

const page = () => {
  return (
     <main className='min-h-screen flex items-center justify-center'>
            <ContainerLayout>
                <section className='grid lg:grid-cols-2 grid-cols-1 shadow-lg'>

                    {/* Left Image */}
                    <AuthImageBanner
                        imageSrc='/assets/imgs/signin.png'
                        title='Login Here'
                        description='Log in right away for our advanced sports software solutions, created to address issues in regular sporting events and activities.'
                    />

                    {/* Right Form */}
                    <AuthFormContainer>

                        <AuthFormHeader
                            title="Welcome Back"
                            description="Login into your account"
                        />

                        {/* SignUp Form */}
                        <SigninForm />

                      <AuthFormFooter type='signin' />
                    </AuthFormContainer>
                </section>
            </ContainerLayout>
        </main>
  )
}

export default page