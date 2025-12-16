import { ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'

type Props = {
    imageSrc: string;
    title: string;
    description: string;

}

const AuthImageBanner: FC<Props> = ({ imageSrc, title, description }) => {
    return (
        <div className='relative w-full lg:block hidden'>
            <Image
                src={imageSrc}
                alt='Auth Banner'
                fill
                className='object-cover'
                priority
                loading='eager'
            />

            <div
            className='absolute inset-0 bg-black/10'
            />

            <div className='w-[75%] max-w-md backdrop-blur-2xl bg-[rgba(255,242,242,.13)] absolute z-50 -translate-1/2 top-1/2 left-1/2 p-6 rounded-[10px] space-y-4'>
                <div
                    className={`flex justify-center items-center p-4 rounded-[10px] gap-x-2.5 font-bold bg-[#AAF40C] text-background text-lg`}
                >
                    <ThumbsUp  />
                    <span>{title}</span>
                </div>

                <p className='text-sm text-white font-light text-center'>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default AuthImageBanner
