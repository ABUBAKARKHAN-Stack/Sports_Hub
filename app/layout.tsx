import type { Metadata } from "next";
import {  Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import RootProvider from "@/providers/Providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "DreamSports - Premium Badminton Community",
  description: "Join our empowering sports community and grow with us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-outfit bg-background text-foreground antialiased`}
      >
        <Toaster duration={2000} position='top-center' />
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}