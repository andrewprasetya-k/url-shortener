import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a free Zippr account to track clicks and manage your shortened links.",
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
