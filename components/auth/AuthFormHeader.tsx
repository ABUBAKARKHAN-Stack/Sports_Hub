"use client";

import { useAuthErrors } from '@/hooks/useAuthErrors';
import React, { FC } from 'react';

type Props = {
    title: string;
    description: string;
};

const AuthFormHeader: FC<Props> = ({ description, title }) => {
    const { errMsg } = useAuthErrors();

    return (
        <>
            <h2 className='text-3xl font-bold mb-1.25'>{title}</h2>
            <p className='mb-6'>{description}</p>

            {errMsg && (
                <div className='bg-red-100 border text-center border-red-300 text-destructive text-sm p-2 rounded-md mb-4'>
                    <span className='max-w-3/4 inline-block'>
                        {errMsg}
                    </span>
                </div>
            )}
        </>
    );
};

export default AuthFormHeader;
