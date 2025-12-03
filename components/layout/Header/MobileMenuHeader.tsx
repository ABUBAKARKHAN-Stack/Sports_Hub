import { Dispatch, FC, SetStateAction } from "react";
import { X } from "lucide-react";

interface MobileMenuHeaderProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileMenuHeader: FC<MobileMenuHeaderProps> = ({ setIsOpen }) => (
  <div className="flex items-center justify-between p-6 border-b border-gray-200">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-linear-to-r from-[#004E56] via-[#0A7A63] to-[#34C56A] flex items-center justify-center">
        <span className="text-white font-bold text-lg">DS</span>
      </div>
      <span className="text-xl font-bold text-gray-900">DreamSports</span>
    </div>
    <button
      onClick={() => setIsOpen(false)}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <X className="h-5 w-5 text-gray-600" />
    </button>
  </div>
);

export default MobileMenuHeader;
