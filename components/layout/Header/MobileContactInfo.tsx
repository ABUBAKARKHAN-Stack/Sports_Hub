"use client"

import { FC } from "react";
import { Phone, Mail } from "lucide-react";

const MobileContactInfo: FC = () => (
  <div className="mt-8 p-4 bg-gray-50 rounded-xl space-y-3">
    <p className="font-semibold text-gray-900">Contact Info</p>
    <div className="flex items-center gap-3">
      <Phone className="h-4 w-4 text-[#00A575]" />
      <a href="tel:+18164164654" className="text-sm text-gray-700 hover:underline">
        +1 8164 164654
      </a>
    </div>
    <div className="flex items-center gap-3">
      <Mail className="h-4 w-4 text-[#00A575]" />
      <a href="mailto:info@dreamsports.com" className="text-sm text-gray-700 hover:underline">
        info@dreamsports.com
      </a>
    </div>
  </div>
);

export default MobileContactInfo;
