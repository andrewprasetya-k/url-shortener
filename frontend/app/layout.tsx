import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://zippr.dev"),
  title: {
    default: "Zippr | Shorten your links with ease",
    template: "%s | Zippr",
  },
  description:
    "Free URL shortener. Turn long links into short, shareable ones in seconds — no account needed.",
  keywords: ["url shortener", "short link", "link shortener", "free url shortener"],
  icons: "/favicon.svg",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zippr | Shorten your links with ease",
    description:
      "Free URL shortener. Turn long links into short, shareable ones in seconds — no account needed.",
    url: "https://zippr.dev",
    siteName: "Zippr",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Zippr | Shorten your links with ease",
    description:
      "Free URL shortener. Turn long links into short, shareable ones in seconds — no account needed.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
