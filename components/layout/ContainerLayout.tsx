import { cn } from "@/lib/utils";
import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const ContainerLayout: FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "xsm:max-w-xl mx-auto h-full w-full max-w-full p-4 sm:max-w-2xl md:max-w-3xl lg:max-w-[1300px] lg:px-20 2xl:max-w-[1500px]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ContainerLayout;
