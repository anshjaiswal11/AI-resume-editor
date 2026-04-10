import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Editor",
  description: "ATS-driven resume editing powered by OpenRouter + Firebase"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
