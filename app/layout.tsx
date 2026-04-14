import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat', // Define a CSS variable name
});

export const metadata: Metadata = {
  metadataBase: new URL('https://internstack.com.ng'),
  title: {
    default: "Intern Stack | Build your career, layer by layer.",
    template: "%s | Intern Stack",
  },
  description: "Intern Stack is the ultimate engine for Nigerian students to master their SIWES journey.",
  keywords: ["siwes", "internship", "career", "students", "jobs", "tech jobs", "intern stack", "nigeria pre-internship", "itf"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Intern Stack | Build your career, layer by layer.",
    description: "Intern Stack is the ultimate engine for Nigerian students to master their SIWES journey.",
    url: "https://internstack.com.ng",
    siteName: "Intern Stack",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 600,
        alt: "Intern Stack Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Intern Stack | Build your career, layer by layer.",
    description: "Intern Stack is the ultimate engine for Nigerian students to master their SIWES journey.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}
      >
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
