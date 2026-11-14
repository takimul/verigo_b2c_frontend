import { Suspense } from "react";
import type { Metadata } from "next";
import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { LiveEditProvider } from "@/context/LiveEditContext";
import LiveEditFloatingBar from "@/components/ui/LiveEditFloatingBar";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Verigo Essential",
    template: "%s | Verigo Essential",
  },
  description:
    "Apparel sourcing and export solutions for global brands, sourced from Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminAuthProvider>
          <LiveEditProvider>
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            {children}
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
            <Suspense fallback={null}>
              <LiveEditFloatingBar />
            </Suspense>
            <ToastProvider />
          </LiveEditProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
