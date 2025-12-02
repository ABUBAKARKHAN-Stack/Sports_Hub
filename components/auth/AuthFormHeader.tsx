import React, { FC } from 'react'

type Props = {
    title: string;
    description: string;
}

const AuthFormHeader: FC<Props> = ({
    description,
    title
}) => {
    return (
        <>
            <h2 className='text-3xl font-bold mb-1.25'>{title}</h2>
            <p className='text-gray-500 mb-6'>
                {description}
            </p>
        </>

    )
}

export default AuthFormHeader