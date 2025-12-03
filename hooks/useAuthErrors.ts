"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useToasts } from "@/hooks/toastNotifications";

export const useAuthErrors = () => {
    const router = useRouter();
    const { errorToast } = useToasts();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const error = searchParams.get("error");
        if (!error) return;

        switch (error) {
            case "AccessDenied":
                errorToast(
                    "This email is already registered with another provider. Please login using the original method."
                );
                break;
            case "OAuthAccountNotLinked":
                errorToast("Account exists with a different sign-in method.");
                break;
            case "CredentialsSignin":
                errorToast("Invalid email or password.");
                break;
            default:
                errorToast("Authentication failed. Please try again.");
                break;
        }

        //* Clear query param after showing toast
        const url = window.location.pathname;
        router.replace(url);
    }, [router]);
};
