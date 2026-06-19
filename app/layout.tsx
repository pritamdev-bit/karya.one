import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://karya.one"),
  title: {
    default: "Karya.one | AI Email & Calendar Assistant",
    template: "%s | Karya.one",
  },
  description:
    "Connect your Gmail and Google Calendar to an AI assistant. Draft emails, manage schedules, and handle your inbox with natural language commands.",
  keywords: [
    "AI email assistant",
    "AI calendar assistant",
    "Gmail AI",
    "Google Calendar AI",
    "email productivity",
    "calendar management",
    "natural language email",
    "AI inbox assistant",
    "smart email drafting",
    "schedule management AI",
  ],
  authors: [{ name: "Karya.one" }],
  creator: "Karya.one",
  publisher: "Karya.one",
  applicationName: "Karya.one",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Karya.one | AI Email & Calendar Assistant",
    description:
      "Connect your Gmail and Google Calendar to an AI assistant. Draft emails, manage schedules, and handle your inbox with natural language commands.",
    url: "https://karya.one",
    siteName: "Karya.one",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Karya.one - AI Email & Calendar Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karya.one | AI Email & Calendar Assistant",
    description:
      "Connect your Gmail and Google Calendar to an AI assistant. Draft emails, manage schedules, and handle your inbox with natural language commands.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.className}`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
