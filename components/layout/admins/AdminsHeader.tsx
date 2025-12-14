"use client";

import Logo from "@/components/ui/logo";
import UserMenu from "../Header/UserMenu";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ContainerLayout from "../ContainerLayout";

const AdminsHeader = () => {
  return (
    <>
      <header
        className={
          cn(
            "h-16 w-full border-b bg-background")

        }
      >
        <ContainerLayout className='lg:px-6'>

          <div className="flex justify-between items-center">
            <SidebarTrigger
              className="size-8"
              iconClassName="size-5"
            />
            <UserMenu />
          </div>
        </ContainerLayout>


      </header>
    </>
  );
};

export default AdminsHeader;