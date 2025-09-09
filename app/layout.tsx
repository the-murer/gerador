import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/auth-provider"
import { Suspense } from "react"
import "./globals.css"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "AI GitHub Modifier",
  description: "AI-powered GitHub repository modification system",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <Header />
            {children}
            </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
