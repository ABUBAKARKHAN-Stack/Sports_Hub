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
        "bg-foreground disabled:opacity-50 h-10.5 hover:cursor-pointer text-background hover:bg-foreground/90",
        className
      )}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Spinner /> {loadingText}
        </>
      ) : (
        btnText
      )}

      <CircleArrowRight className="size-4.25" />
    </Button>
  );
};

export default AuthButton;
