import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Briitely Dashboard Framework",
  description: "Reusable reporting and dashboard framework for Briitely clients.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
