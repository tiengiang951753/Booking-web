import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Booking",
  description: "Booking web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
