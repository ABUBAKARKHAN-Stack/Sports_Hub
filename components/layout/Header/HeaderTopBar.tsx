"use client"

import { Mail, Phone, User } from 'lucide-react'
import ContainerLayout from '../ContainerLayout'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { UserRoles } from '@/types/main.types'

const HeaderTopBar = () => {
    const { user } = useAuth()

    const isAdminOrSuperAdmin = user?.role === UserRoles.ADMIN || user?.role === UserRoles.SUPER_ADMIN
    if (isAdminOrSuperAdmin) return null

    return (
        <div className="hidden lg:block bg-linear-to-r from-[#004E56] via-[#0A7A63] to-[#34C56A] text-white">
            <ContainerLayout className="py-0">
                <div className="flex items-center justify-between py-2 text-sm">
                    {/* Contact Info */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            <a href="tel:+18164164654" className="font-medium hover:underline">
                                Toll free: +1 8164 164654
                            </a>
                        </div>

                        <div className="w-px h-4 bg-white/30" />

                        <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            <a href="mailto:info@dreamsports.com" className="font-medium hover:underline">
                                info@dreamsports.com
                            </a>
                        </div>
                    </div>

                    {/* Login/Register */}
                    {!user && (
                        <div className="flex items-center gap-6">
                            <button className="flex items-center font-medium gap-2">
                                <User className="h-3.5 w-3.5" />
                                <Link href="/signin" className="hover:text-[#C6FF56]">Login</Link>
                                <span>/</span>
                                <Link href="/signup" className="hover:text-[#C6FF56]">Register</Link>
                            </button>
                        </div>
                    )}
                </div>
            </ContainerLayout>
        </div>
    )
}

export default HeaderTopBar
