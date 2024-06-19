import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import ConfettiProvider from "@/components/providers/confetti-provider";
import ToastProvider from "@/components/providers/toaster-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: { title: string; description: string } = {
    title: "LMS",
    description: "Learning management system",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ConfettiProvider />
                    <ToastProvider />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
