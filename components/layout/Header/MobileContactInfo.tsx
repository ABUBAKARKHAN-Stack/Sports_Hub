import { FC } from "react";
import { Phone, Mail } from "lucide-react";

const MobileContactInfo: FC = () => (
  <div className="mt-8 p-4 bg-gray-50 rounded-xl">
    <p className="font-semibold text-gray-900 mb-3">Contact Info</p>
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Phone className="h-4 w-4 text-[#00A575]" />
        <span className="text-sm text-gray-700">+1 8164 164654</span>
      </div>
      <div className="flex items-center gap-3">
        <Mail className="h-4 w-4 text-[#00A575]" />
        <span className="text-sm text-gray-700">info@dreamsports.com</span>
      </div>
    </div>
  </div>
);

export default MobileContactInfo;
