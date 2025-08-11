import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold">AI Fashion</span>
            </Link>
            <p className="text-gray-400">Discover fashion with AI-powered search and virtual try-on technology.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products?category=women" className="hover:text-white">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/products?category=men" className="hover:text-white">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-white">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?category=shoes" className="hover:text-white">
                  Shoes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">AI Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/ai-search" className="hover:text-white">
                  Smart Search
                </Link>
              </li>
              <li>
                <Link href="/try-on" className="hover:text-white">
                  Virtual Try-On
                </Link>
              </li>
              <li>
                <Link href="/ai-search" className="hover:text-white">
                  Image Analysis
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AI Fashion Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
