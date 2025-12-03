"use client"

import { FC, Dispatch, SetStateAction } from "react";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import MobileMenuHeader from "./MobileMenuHeader";
import MobileUserInfo from "./MobileUserInfo";
import MobileNavLinks from "./MobileNavLinks";
import MobileActions from "./MobileActions";
import MobileContactInfo from "./MobileContactInfo";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const MobileMenu: FC<Props> = ({ isOpen, setIsOpen }) => {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left" >
      <DrawerOverlay className="bg-black/50" />
      <DrawerContent className="w-80 h-full bg-white shadow-2xl">
        <MobileMenuHeader setIsOpen={setIsOpen} />
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          <MobileUserInfo />
          <MobileNavLinks setIsOpen={setIsOpen} />
          <MobileActions />
          <MobileContactInfo />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
