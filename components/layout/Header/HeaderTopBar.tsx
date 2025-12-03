import { Mail, MapPin, Phone, User } from 'lucide-react'
import ContainerLayout from '../ContainerLayout'

const HeaderTopBar = () => {
    return (
        <div className="hidden lg:block bg-linear-to-r from-[#004E56] via-[#0A7A63] to-[#34C56A] text-white">

            <ContainerLayout className='py-0'>
                <div className="flex items-center justify-between py-2 text-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            <span className="font-medium">Toll free: +1 8164 164654</span>
                        </div>
                        <div className="w-px h-4 bg-white/30" />
                        <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="font-medium">info@dreamsports.com</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 hover:text-[#C6FF56] transition-colors">
                            <User className="h-3.5 w-3.5" />
                            <span className="font-medium">Login / Register</span>
                        </button>
                        <div className="w-px h-4 bg-white/30" />
                        <button className="flex items-center gap-2 hover:text-[#C6FF56] transition-colors">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="font-medium">Find a Court</span>
                        </button>
                    </div>
                </div>
            </ContainerLayout>
        </div>
    )
}

export default HeaderTopBar