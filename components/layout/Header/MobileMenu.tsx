import MobileMenuHeader from "./MobileMenuHeader";
import MobileUserInfo from "./MobileUserInfo";
import MobileNavLinks from "./MobileNavLinks";
import MobileActions from "./MobileActions";
import MobileContactInfo from "./MobileContactInfo";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const MobileMenu:FC<Props> = ({ isOpen, setIsOpen }) => {
  return (
    <div className={`lg:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl">
        <MobileMenuHeader setIsOpen={setIsOpen} />
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6">
            <MobileUserInfo />
            <MobileNavLinks setIsOpen={setIsOpen} />
            <MobileActions />
            <MobileContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
