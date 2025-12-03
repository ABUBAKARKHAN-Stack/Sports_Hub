import { FC } from "react";

const MobileActions: FC = () => (
  <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
    <button className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[#00A575] to-[#34C56A] text-white font-medium hover:shadow-lg transition-shadow">
      List Your Court
    </button>
    <div className="flex gap-4">
      <button className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:border-[#00A575] hover:text-[#00A575] transition-colors">
        Login
      </button>
      <button className="flex-1 px-4 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
        Register
      </button>
    </div>
  </div>
);

export default MobileActions;
