"use client"

import { toast } from "sonner";

export const useToasts = () => {


  const baseStyle = {
    minHeight: "30px",
    height: "auto",
    borderRadius: "8px",
    padding: "6px 16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    fontSize: "12px",
    lineHeight: "1.2",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    whiteSpace: "normal",
    wordBreak: "break-word",
  };

  const successToast = (message) => {
    toast.success(message, {
      style: {
        ...baseStyle,
        backgroundColor: "#BBF7D0",
        color: "#065F46",
        border: "1px solid #16A34A",
      },
      duration: 2000,
      position: "top-center",
    });
  };

  const errorToast = (message) => {
    toast.error(message, {
      style: {
        ...baseStyle,
        backgroundColor: "#FFF5F5",
        color: "#F9504E",
        border: "1px solid #FEDAD9",
      },
      duration: 2000,
      position: "top-center",
    });
  };

  const infoToast = (message) => {
    toast.info(message, {
      style: {
        ...baseStyle,
        backgroundColor: "#E6E8F0",
        color: "#2D3748",
        border: "1px solid #A0AEC0",
      },
      duration: 2000,
      position: "top-center",
    });
  };

  return { successToast, errorToast, infoToast };
};
