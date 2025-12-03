import Link from 'next/link';
import React from 'react'
import { Separator } from '../ui/separator';


const AuthFormFooter = ({ type = "signin", }) => {
    return (
        <>
            <div className='text-center text-sm mt-6 w-3/4 mx-auto grid grid-cols-3 place-items-center'>
                <Separator orientation='horizontal' />
                <p>Or continue with</p>
                <Separator orientation='horizontal' />
            </div>

            <div className='flex justify-center gap-4 mt-2'>
                <button className='border px-4 py-2 rounded'>Google</button>
            </div>

            {type === "signin" ? (
                <p className='text-center text-base mt-4'>
                    Don’t have an account?{' '}
                    <Link
                        className='text-primary font-medium cursor-pointer'
                        href={"/signup"}
                    >
                        Sign Up!
                    </Link>
                </p>
            ) : (
                <p className='text-center text-base mt-4'>
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