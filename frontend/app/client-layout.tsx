"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import { useState } from "react"
import { AIChat } from "@/components/ai-chat"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="flex min-h-screen">
            {/* Main Content Area */}
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isChatOpen ? "mr-80" : ""}`}>
              <Header onOpenChat={() => setIsChatOpen(true)} />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>

            {/* AI Chat Sidebar */}
            {isChatOpen && (
              <div className="fixed right-0 top-0 bottom-0 z-50">
                <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
              </div>
            )}
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
