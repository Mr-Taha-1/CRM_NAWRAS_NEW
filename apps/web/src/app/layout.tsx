import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@/lib/auth/UserContext";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import "../styles/starfield.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zoony & Nawras CRM System",
  description: "Multi-branch CRM system for international operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryProvider>
            <UserProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <Toaster position="top-right" />
            </UserProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}