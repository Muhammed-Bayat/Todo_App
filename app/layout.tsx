import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Todo",
  description: "A local-first todo application",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
