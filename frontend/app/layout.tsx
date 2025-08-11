import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Fashion Store - Smart Shopping Experience",
  description: "Discover fashion with AI-powered search, virtual try-on, and personalized recommendations"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
