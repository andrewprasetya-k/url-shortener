import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import logo from "./components/logo.svg";

export const metadata: Metadata = {
  title: "URL Shortener - Shorten Your Links",
  description: "Free URL shortener service to create short links",
  icons: "/favicon.svg",
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
