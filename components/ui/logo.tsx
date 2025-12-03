import { brandName } from "@/constants/main.constants";
import Link from "next/link";

const Logo = ({className = ""}) => (
  <div className="flex items-center gap-3 ">
    <div className="h-10 w-10 rounded-full bg-linear-to-r from-[#004E56] via-[#0A7A63] to-[#34C56A] flex items-center justify-center shadow-md">
      <span className="text-white font-bold text-lg">HB</span>
    </div>
    <Link href="/" className="flex flex-col">
      <span className="text-2xl font-bold text-gray-900">{brandName}</span>
      <span className="text-xs text-gray-500 hidden sm:block">Find Your Perfect Court</span>
    </Link>
  </div>
);

export default Logo;
