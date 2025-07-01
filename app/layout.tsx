import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { LanguageProvider } from "@/components/language-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nawras CRM",
  description: "Customer Relationship Management System for Nawras",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 