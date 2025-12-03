"use client"

import { FC } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MobileUserInfo: FC = () => {
  const { session } = useAuth();

  return (
    <div className="flex items-center gap-3 mb-8 p-4 bg-linear-to-r from-[#004E56]/5 via-[#0A7A63]/5 to-[#34C56A]/5 rounded-xl">

      <Avatar className="h-12 w-12 rounded-full  flex items-center justify-center">
        <AvatarImage
          src={session?.user.avatar}
          alt={`${session?.user.username} Avatar`}
        />
        <AvatarFallback className="bg-linear-to-r from-[#004E56] to-[#34C56A] text-background text-xl font-semibold">
          <User className="h-6 w-6 text-white" />
        </AvatarFallback>
      </Avatar>

      <div>
        {session?.user ? (
          <>
            <p className="font-semibold text-gray-900 truncate">
              {session.user.username}
            </p>
            <p className="text-sm text-gray-600 truncate">{session.user.email}</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-gray-900">Welcome to DreamSports!</p>
            <p className="text-sm text-gray-600">Login to access bookings</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileUserInfo;
