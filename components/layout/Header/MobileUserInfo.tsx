import { FC } from "react";
import { User } from "lucide-react";

const MobileUserInfo: FC = () => (
  <div className="flex items-center gap-3 mb-8 p-4 bg-linear-to-r from-[#004E56]/5 via-[#0A7A63]/5 to-[#34C56A]/5 rounded-xl">
    <div className="h-12 w-12 rounded-full bg-linear-to-r from-[#004E56] to-[#34C56A] flex items-center justify-center">
      <User className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="font-semibold text-gray-900">Welcome to DreamSports!</p>
      <p className="text-sm text-gray-600">Login to access bookings</p>
    </div>
  </div>
);

export default MobileUserInfo;
