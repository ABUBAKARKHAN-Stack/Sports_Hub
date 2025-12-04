import React, { FC } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { CircleArrowRight } from "lucide-react";

type Props = {
  isSubmitting: boolean;
  btnText: string;
  loadingText: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AuthButton: FC<Props> = ({
  isSubmitting = false,
  btnText,
  loadingText,
  ...props
}) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="bg-foreground disabled:opacity-50 h-11 text-background hover:bg-[#131b2a]"
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
