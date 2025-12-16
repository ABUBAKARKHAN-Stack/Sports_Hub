"use client"

import { useAuth } from '@/context/AuthContext'
import { Button } from '../ui/button'
import { GoogleIllustration } from '../ui/illustrations'

const GoogleSignInButton = () => {
    const { signIn } = useAuth()

    return (
        <div className='flex justify-center mt-4 w-full max-w-xs mx-auto'>
            <Button
                type='button'
                onClick={async () => await signIn("google")}
                variant='outline'
                className='flex items-center justify-center gap-3 w-full text-sm rounded-full'
            >
                <GoogleIllustration className='w-5 h-5' />
                <span className='text-base font-medium'>Sign in with Google</span>
            </Button>
        </div>
    )
}

export default GoogleSignInButton
