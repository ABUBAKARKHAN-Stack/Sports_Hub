import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import RootProvider from "@/providers/Providers";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { brandName } from "@/constants/main.constants";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: `${brandName} - Premium Badminton Community"`,
  description: "Join our empowering sports community and grow with us",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);


  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-outfit bg-background text-foreground antialiased`}
      >
        <Toaster duration={2000} position='top-center' />
        <RootProvider session={session}>
          {children}
           
            </RootProvider>
      </body>
    </html>
  );
}