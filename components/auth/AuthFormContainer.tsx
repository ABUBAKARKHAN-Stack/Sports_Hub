"use client"

import { useAuthErrors } from '@/hooks/useAuthErrors';
import { cn } from '@/lib/utils'
import React, { FC, ReactNode } from 'react'

type Props = {
  className?: string;
  children: ReactNode
}

const AuthFormContainer: FC<Props> = ({ className = "", children }) => {
  
      useAuthErrors()

  return (
    <div
      className={cn(
        "bg-white flex flex-col justify-center p-8",
        className
      )}
    >
      {children}
    </div>
  )
}

export default AuthFormContainer