import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini CMS — Lightweight Content Management",
  description:
    "A modern, lightweight content management system built with Laravel and Next.js. Manage your content with ease.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
