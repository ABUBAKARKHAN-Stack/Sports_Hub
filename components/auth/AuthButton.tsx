import React, { FC } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { CircleArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  isSubmitting: boolean;
  btnText: string;
  loadingText: string;
  className?:string
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AuthButton: FC<Props> = ({
  isSubmitting = false,
  btnText,
  loadingText,
  className = "",
  ...props
}) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "bg-foreground disabled:opacity-50 h-11 hover:cursor-pointer text-background hover:bg-[#131b2a]",
        className
      )}
      size="lg"
      {...props}
    >
      {isSubmitting ? (
        <>
          <Spinner /> {loadingText}
        </>
      ) : (
        btnText
      )}

      <CircleArrowRight className="ml-2" />
    </Button>
  );
};

export default AuthButton;
