"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw, Star } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRef } from "react"

// Mock product data - in real app, this would come from API
const product = {
  id: 1,
  name: "Classic Denim Jacket",
  price: 89.99,
  originalPrice: 120.0,
  images: [
    "/placeholder.svg?height=600&width=500",
    "/placeholder.svg?height=600&width=500",
    "/placeholder.svg?height=600&width=500",
    "/placeholder.svg?height=600&width=500",
  ],
  category: "Jackets",
  brand: "Urban Style",
  rating: 4.5,
  reviews: 128,
  colors: [
    { name: "Classic Blue", value: "#4A90E2" },
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
  description:
    "A timeless classic that never goes out of style. This premium denim jacket features a comfortable fit, durable construction, and versatile design that pairs perfectly with any outfit.",
  features: [
    "100% Premium Cotton Denim",
    "Classic button-front closure",
    "Two chest pockets with button flaps",
    "Adjustable button cuffs",
    "Machine washable",
  ],
  inStock: true,
  stockCount: 15,
  isSale: true,
  isNew: false,
}

const relatedProducts = [
  {
    id: 2,
    name: "Casual White T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 3,
    name: "Dark Wash Jeans",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=250",
  },
  {
    id: 4,
    name: "Canvas Sneakers",
    price: 65.99,
    image: "/placeholder.svg?height=300&width=250",
  },
]

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState("")
  const [webhookStatus, setWebhookStatus] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tryOnLoading, setTryOnLoading] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart.",
        variant: "destructive",
      })
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
    })

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    setWebhookStatus("")
    setUploadedUrl("")
    const form = new FormData()
    form.append("file", file)
    try {
      const res = await fetch("http://localhost:8080/upload-image", { method: "POST", body: form })
      const data = await res.json()
      if (!data.url) throw new Error(data.error || "No Cloudinary URL returned")
      setUploadedUrl(data.url)
      // Send to webhook
      const webhookRes = await fetch("http://localhost:5678/webhook-test/Virtual-Try-On", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: data.url,
          garment_type: product.garment_type,
        }),
      })
      console.log("reply from webhook",webhookRes)
      if (!webhookRes.ok) throw new Error("Webhook failed")
      setWebhookStatus("Webhook sent successfully!")
    } catch (err: any) {
      setError(err.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedImage === index ? "border-purple-600" : "border-gray-200"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.brand}</Badge>
              {product.isSale && <Badge className="bg-red-500">Sale</Badge>}
              {product.isNew && <Badge className="bg-green-500">New</Badge>}
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-purple-600">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.isSale && (
                <Badge className="bg-red-500">Save ${(product.originalPrice! - product.price).toFixed(2)}</Badge>
              )}
            </div>
          </div>

          {/* Image Upload for Virtual Try-On */}
          <div className="my-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">Virtual Try-On</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              variant="outline"
              className="mb-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Your Photo"}
            </Button>
            {uploadedUrl && (
              <div className="mt-2 text-xs break-all text-blue-700">
                <span>Image URL: </span>
                <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="underline">{uploadedUrl}</a>
              </div>
            )}
            <Button
              className="mt-4"
              disabled={!uploadedUrl || tryOnLoading}
              onClick={async () => {
                setTryOnLoading(true)
                setWebhookStatus("")
                setError("")
                try {
                  const webhookRes = await fetch("http://localhost:5678/webhook-test/Virtual-Try-On", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      image_url: uploadedUrl,
                      garment_type: product.garment_type,
                    }),
                  })
                  if (!webhookRes.ok) throw new Error("Webhook failed")
                  setWebhookStatus("Webhook sent successfully!")
                } catch (err: any) {
                  setError(err.message || "Webhook failed")
                } finally {
                  setTryOnLoading(false)
                }
              }}
            >
              {tryOnLoading ? "Sending to Try-On..." : "Try On"}
            </Button>
            {webhookStatus && <div className="mt-2 text-green-600 text-xs">{webhookStatus}</div>}
            {error && <div className="mt-2 text-red-600 text-xs">Error: {error}</div>}
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color.name ? "border-purple-600" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold mb-3">Size</h3>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(Math.min(10, product.stockCount))].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 mt-1">{product.stockCount} items in stock</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handleAddToCart} className="flex-1" disabled={!product.inStock}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <Link href="/try-on" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Try On Virtually
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-600">On orders over $50</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-600">30-day return policy</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-gray-600">SSL encrypted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{product.rating}</div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Based on {product.reviews} reviews</p>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="font-medium">Sarah M.</span>
                      <span className="text-sm text-gray-500">Verified Purchase</span>
                    </div>
                    <p className="text-gray-700">
                      "Perfect fit and great quality! The denim feels substantial and the color is exactly as shown.
                      Highly recommend!"
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                      <span className="font-medium">Mike R.</span>
                      <span className="text-sm text-gray-500">Verified Purchase</span>
                    </div>
                    <p className="text-gray-700">
                      "Good jacket overall. Runs slightly large so consider sizing down. Material is nice and sturdy."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Card key={relatedProduct.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-[4/5] overflow-hidden rounded-t-lg">
                  <img
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                  <p className="text-lg font-bold text-purple-600">${relatedProduct.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
