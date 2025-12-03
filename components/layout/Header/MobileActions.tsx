"use client"

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const MobileActions: FC = () => {
  const { session, signOut } = useAuth();

  if (session?.user) {
    return (
      <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
        <Button
          variant="outline"
          className="w-full text-gray-700"
          onClick={() => signOut()}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
      <div className="flex gap-4">
        <Link href={'/signin'} className="w-full">
          <Button variant="outline" className="w-full">
            Login
          </Button>
        </Link>
        <Link href={'/signup'} className="w-full">

          <Button className=" bg-foreground w-full text-background hover:bg-gray-800">
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileActions;
