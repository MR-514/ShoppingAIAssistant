"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  brand: string
  rating: number
  reviews: number
  colors: string[]
  sizes: string[]
  isNew?: boolean
  isSale?: boolean
  stockCount?: number
  description?: string
  features?: string[]
}

const products: Product[] = [
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
    id: 10,
    name: "White Linen",
    price: 110.0,
    image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/azOKK8sr_387210fce6ac4ffca448f6a070440ea9_jad99s.webp",
    category: "Jeans",
    brand: "SportMax",
    rating: 4.4,
    reviews: 203,
    colors: ["White", "Blue"],
    sizes: ["28", "30", "32"],
    isNew: true,
  },
  {
    id: 3,
    name: "Casual White Top",
    price: 79.99,
    image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/7l7oKg5A_04ea01c32d3543b89ae4280d67e283e0_x791cu.webp",
    category: "Top",
    brand: "ComfortStep",
    rating: 4.3,
    reviews: 256,
    colors: ["White", "Black", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"],
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
  {
    id: 8,
    name: "Blue Torn Jeans",
    price: 110.0,
    image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907985/8AGxMXSN_c551b029c31740a7a20c2a654616e65f_m2q4fn.webp",
    category: "Jeans",
    brand: "SportMax",
    rating: 4.4,
    reviews: 203,
    colors: ["Black", "White", "Blue"],
    sizes: ["28", "30", "32"],
    isNew: true,
  },
  {
    id: 6,
    name: "Blue Top",
    price: 95.0,
    image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754908234/AB2e6GY2_95df2e8430d844a4a3bfc69a6d3a95ca_pr2s4x.webp",
    category: "Top",
    brand: "Denim Dreams",
    rating: 4.6,
    reviews: 178,
    colors: ["Blue", "Black", "Light Blue"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: 9,
    name: "Wool Blend Jeans",
    price: 189.99,
    originalPrice: 250.0,
    image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/r95xqygW_908f4b3bf54842f7875feb024d8d28b2_lks7dh.webp",
    category: "Jeans",
    brand: "Winter Warmth",
    rating: 4.9,
    reviews: 67,
    colors: ["Black", "Black", "Gray"],
    sizes: ["28", "30", "32"],
    isSale: true,
  },

  {
    id: 11,
    name: "Black Jeans",
    price: 110.0,
    image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/eGFueqdK_2183ade8838248a48d1066438124430e_br4gzz.webp",
    category: "Jeans",
    brand: "SportMax",
    rating: 4.4,
    reviews: 203,
    colors: ["Black", "White", "Blue"],
    sizes: ["28", "30", "32"],
    isNew: true,
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number(params.id)
  const product = products.find((p) => p.id === productId)

  // Fallback if product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p>We couldn't find the product you're looking for.</p>
      </div>
    )
  }

  // Related products: exclude current and pick any 3
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 5)

  const [selectedImage] = useState(0) // Your data only has single image, so no image switching
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()


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
      image: product.image,
      size: selectedSize,
      color: selectedColor,
    })

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-[2/2] overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
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
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
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
              <span className="text-3xl font-bold text-purple-600">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.isSale && product.originalPrice && (
                <Badge className="bg-red-500">Save ${(product.originalPrice - product.price).toFixed(2)}</Badge>
              )}
            </div>
          </div>



          {/* Color Selection */}
          <div>
            <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-purple-600" : "border-gray-300"
                    }`}
                  title={color}
                  style={{ backgroundColor: color.toLowerCase() === "floral" ? "url('/floral-pattern.png')" : color.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold mb-3">Size</h3>
            <Select
              value={selectedSize}
              onValueChange={(value) => setSelectedSize(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select size" />
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
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">Quantity</h3>
            <input
              type="number"
              min={1}
              max={product.stockCount || 10}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.stockCount || 10)))}
              className="w-16 border rounded px-2 py-1"
            />
            <span className="text-sm text-gray-500">
              {product.stockCount ? `${product.stockCount} in stock` : "In stock"}
            </span>
          </div>

          {/* Add to Cart */}
          <Button className="w-full" onClick={handleAddToCart} disabled={quantity > (product.stockCount || 10)}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          <Link href="/try-on" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Try On Virtually
              </Button>
            </Link>

          {/* Description & Features */}
          <Tabs defaultValue="description" className="mt-10">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <p>{product.description || "No description available."}</p>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              {product.features?.length ? (
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p>No features listed.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">More Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {relatedProducts.map((prod) => (
            <Card key={prod.id} className="hover:shadow-lg transition-shadow duration-200">
              <Link href={`/product/${prod.id}`}>

                <div className="aspect-[4/4] overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={prod.image || "/placeholder.svg"}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent>
                  <h3 className="font-semibold text-lg">{prod.name}</h3>
                  <p className="text-purple-600 font-bold">${prod.price.toFixed(2)}</p>
                </CardContent>

              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
