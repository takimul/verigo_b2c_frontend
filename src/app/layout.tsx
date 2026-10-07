import type { Metadata } from "next";
import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Verigo Essential",
    template: "%s | Verigo Essential",
  },
  description:
    "Premium apparel manufacturing and wholesale solutions for global brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />

        {children}
      </body>
    </html>
  );
}
