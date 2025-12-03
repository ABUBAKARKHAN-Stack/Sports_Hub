"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { useToasts } from "@/hooks/toastNotifications";

export const useAuthErrors = () => {
    const router = useRouter();
    const { errorToast } = useToasts();
    const [errMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const error = searchParams.get("error");
        if (!error) return;

        let message = "";

        switch (error) {
            case "AccessDenied":                
                message = "This email is already registered with another provider. Please login using the original method.";
                break;

            case "OAuthAccountNotLinked":
                message = "Account exists with a different sign-in method.";
                break;

            case "CredentialsSignin":
                message = "Invalid email or password.";
                break;

            default:
                message = "Authentication failed. Please try again.";
                break;
        }

        setErrorMsg(message);
        errorToast(message);

        //* Clear the query param after processing
        router.replace(window.location.pathname);
    }, [router]);

    return { errMsg };
};
