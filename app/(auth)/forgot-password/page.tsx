import AuthFormContainer from '@/components/auth/AuthFormContainer'
import AuthFormFooter from '@/components/auth/AuthFormFooter'
import AuthFormHeader from '@/components/auth/AuthFormHeader'
import ForgotPasswordForm from '@/components/auth/forms/ForgotPasswordForm'
import ContainerLayout from '@/components/layout/ContainerLayout'

const ForgotPasswordPage = () => {
  return (
      <main className='min-h-screen flex items-center justify-center'>
            <ContainerLayout>
                <section className='max-w-md mx-auto shadow-lg'>

                    <AuthFormContainer>

                        <AuthFormHeader
                            title="Forgot Password"
                            description="Enter registered email"
                        />

                        {/* Forgot Password Form */}
                        <ForgotPasswordForm />

                      <AuthFormFooter type='forgot-password' />
                    </AuthFormContainer>
                </section>
            </ContainerLayout>
        </main>
  )
}

export default ForgotPasswordPage