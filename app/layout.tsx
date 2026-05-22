import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header/Header";
import { AuthProvider } from "@/context/AuthContext";
import { ServiceWorkerCleanup } from "@/components/ServiceWorkerCleanup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Classes - Find Best Coaching Institutes for JEE, NEET, MHT-CET",
  description:
    "Discover top coaching institutes for JEE Main, JEE Advanced, NEET, MHT-CET, and other competitive exams. Compare institutes, read reviews, and find your perfect coaching class.",
  keywords: [
    "coaching institutes",
    "JEE coaching",
    "NEET coaching",
    "MHT-CET coaching",
    "best coaching classes",
    "IIT coaching",
    "medical coaching",
    "engineering entrance",
    "competitive exam coaching",
  ],
  authors: [{ name: "My Classes" }],
  openGraph: {
    title: "My Classes - Find Best Coaching Institutes",
    description:
      "Discover top coaching institutes for JEE, NEET, MHT-CET, and other competitive exams.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Classes - Find Best Coaching Institutes",
    description:
      "Discover top coaching institutes for JEE, NEET, MHT-CET, and other competitive exams.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pt-16 lg:pt-20">
        <ServiceWorkerCleanup />
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
