import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CompareBar } from "@/components/layout/CompareBar";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Find Your Perfect College`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["college admission", "IIT", "NIT", "JEE", "engineering colleges India", "college predictor"],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Find Your Perfect College`,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <Navbar />
        <main>{children}</main>
        <CompareBar />
      </body>
    </html>
  );
}
