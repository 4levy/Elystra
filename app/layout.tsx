import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VideoBackground from "./components/VideoBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elystra.vercel.app/"),
  title: "Elystra | Project Under Development",
  description: "Still unknow.",
  openGraph: {
    title: "Elystra | Project Under Development",
    description: "Still unknow.",
    url: "https://elystra.vercel.app/",
    siteName: "Elystra",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Elystra Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Elystra | Project Under Development",
    description: "Still unknow.",
    images: ["/icon.png"],
    creator: "@4levyz",
    site: "@4levyz",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VideoBackground />
        {children}
      </body>
    </html>
  );
}
