"use client"

import { useAuth } from '@/context/AuthContext'
import { Button } from '../ui/button'
import { GoogleIllustration } from '../ui/illustrations'

const GoogleSignInButton = () => {
    const {
        signIn
    } = useAuth()


    return (
        <div className='flex justify-center gap-4 mt-2 w-1/2 mx-auto'>
            <Button type='button' onClick={async () => await signIn("google")} className='text-foreground text-sm rounded-full cursor-pointer hover:text-foreground w-full' variant={"outline"}>
                <GoogleIllustration className='size-5' /> <span className='inline-block text-base'>Google</span>
            </Button>
        </div>
    )
}

export default GoogleSignInButton