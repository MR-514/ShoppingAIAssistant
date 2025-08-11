"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Sparkles, Camera, ShoppingBag } from "lucide-react"
import ImageUpload from "./components/ImageUpload";

export default function HomePage() {
  const featuredProducts = [
    
    {
      id: 1,
      name: "Classic Jacket",
      price: 89.99,
      originalPrice: 120.0,
      image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754906657/Large_PNG-AdobeStock_328526349_ve8zsc.png",
      category: "Jackets",
      brand: "Winter Warmth",
      rating: 4.5,
      reviews: 128,
      colors: ["Red", "Black", "White"],
      sizes: ["XS", "S", "M", "L", "XL"],
      isSale: true,
    },
    {
      id: 7,
      name: "Floral Long Skirt",
      price: 189.99,
      originalPrice: 250.0,
      image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/FqIpmjbq_b302522366804128ab739d0ec76de21c_es9jhl.webp",
      category: "Bottoms",
      brand: "Urban Style",
      rating: 4.9,
      reviews: 67,
      colors: ["Floral", "Black", "Gray"],
      sizes: ["XS", "S", "M", "L", "XL"],
      isSale: true,
    },
    {
      id: 4,
      name: "Stripped Full Sleve Tee",
      price: 120.0,
      image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/Q2rggAyB_3b0cab885126474fbfa92ef39c9a71f3_t1p7um.webp",
      category: "Top",
      brand: "Luxe Leather",
      rating: 4.7,
      reviews: 45,
      colors: ["Brown", "Black", "Tan"],
      sizes: ["One Size"],
    },
    {
      id: 5,
      name: "Cotton T-Shirt",
      price: 29.99,
      image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754908235/9WXS83ig_09605e25e9ee4e7abe0c5dacca407897_gwbftr.webp",
      category: "Top",
      brand: "Basic Essentials",
      rating: 4.2,
      reviews: 312,
      colors: ["Red", "black", "Green"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">AI-Powered Fashion Discovery</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find your perfect style with our intelligent fashion assistant. Search with AI, try on virtually, and
            discover clothes that match your unique taste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Search className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                <p className="text-gray-600 mb-4">
                  Describe what you're looking for in natural language and let our AI find the perfect matches.
                </p>
                <p className="text-sm text-purple-600 font-medium">Click "Search with Monica" in the header to get started!</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Camera className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Image Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Upload photos of outfits you like and get similar product recommendations instantly.
                </p>
                <p className="text-sm text-purple-600 font-medium">Use the camera icon in AI chat to upload images!</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Virtual Try-On</h3>
                <p className="text-gray-600 mb-4">
                  See how clothes look on you before buying with our virtual try-on technology.
                </p>
                <Link href="/try-on">
                  <Button variant="outline">Try Virtual Fitting</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Image Upload Section */}
      {/* <ImageUpload /> */}

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-lg font-bold text-purple-600">${product.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products">
              <Button size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
