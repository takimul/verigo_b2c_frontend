import type { Metadata } from "next";
import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import Navbar from "@/components/layout/Navbar";

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
        <Navbar />
        <AdminAuthProvider>
          {children}
          <ToastProvider />
        </AdminAuthProvider>

        <Footer />
      </body>
    </html>
  );
}
