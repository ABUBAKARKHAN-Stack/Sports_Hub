import Link from 'next/link';
import React from 'react'
import { Separator } from '../ui/separator';
import GoogleSignInButton from './GoogleSignInButton';


const AuthFormFooter = ({ type = "signin", }) => {

    if (type === "forgot-password") {
        return <p className='text-center text-sm mt-4'>
            Remember Password?{' '}
            <Link
                className='text-primary font-medium cursor-pointer'
                href={"/signup"}
            >
                Sign In!
            </Link>
        </p>
    }


    return (
        <>
            <div className='text-center text-sm mt-6 w-3/4 mx-auto grid grid-cols-3 place-items-center'>
                <Separator orientation='horizontal' />
                <p>Or continue with</p>
                <Separator orientation='horizontal' />
            </div>

            <GoogleSignInButton />

            {type === "signin" ? (
                <p className='text-center text-sm mt-4'>
                    Don’t have an account?{' '}
                    <Link
                        className='text-primary font-medium cursor-pointer'
                        href={"/signup"}
                    >
                        Sign Up!
                    </Link>
                </p>
            ) : (
                <p className='text-center text-sm mt-4'>
                    Have an account?{' '}
                    <Link
                        className='text-primary font-medium cursor-pointer'
                        href={"/signin"}
                    >
                        Sign In!
                    </Link>
                </p>
            )}
        </>
    )
}

export default AuthFormFooter;