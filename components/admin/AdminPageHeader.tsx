import React, { FC, JSX } from "react";

type Props = {
  mainIcon: JSX.Element;
  mainHeading: string;
  subIcon?: JSX.Element;
  subText: string;
};

const AdminPageHeader: FC<Props> = ({
  mainIcon,
  mainHeading,
  subIcon,
  subText,
}) => {
  return (
    <div className={`relative`}>
      <section
        role="banner"
        className="xsm:p-5 relative flex flex-col items-start justify-center gap-3 rounded-lg bg-linear-to-br from-primary to-secondary  px-4 py-5"
      >
        {/* Glow effect */}
        <div className="animate-pulse-slow pointer-events-none absolute inset-0 -z-10 h-full w-full rounded-lg shadow-2xl shadow-primary/50 " />

        {/* Main Heading */}
        <h1 className="flex items-center gap-2 text-lg font-bold text-white sm:text-2xl md:text-3xl">
          <span className="shrink-0 text-base sm:text-xl md:text-2xl">
            {mainIcon}
          </span>
          <span>{mainHeading}</span>
        </h1>

        {/* Subtext */}
        <p className="flex items-center gap-2 text-xs font-medium tracking-wide sm:text-sm text-green-100">
          <span className="shrink-0 text-xs sm:text-sm">{subIcon}</span>
          <span>{subText}</span>
        </p>
      </section>
    </div>
  );
};

export default AdminPageHeader;
