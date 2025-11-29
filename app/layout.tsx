import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const alexandriaSans = Alexandria({
  variable: "--font-alexandria"
})

export const metadata: Metadata = {
  title: "Smart Diet Planner",
  description: "Smart Diet Planner",
  icons: {icon: "/favicon.png"}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${alexandriaSans.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors/>
        <Analytics />
      </body>
    </html>
  );
}
