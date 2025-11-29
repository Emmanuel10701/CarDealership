import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutController from "./LayoutController";
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CorporateSellers - Premium Car Marketplace",
  description: "Kenya's premier destination for certified pre-owned luxury and premium vehicles.",
  icons: {
    icon: "/er.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <LayoutController>{children}</LayoutController>
          <Toaster position="top-right" />
      </body>
    </html>
  );
}