"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Heart, Filter } from "lucide-react"
import Link from "next/link"

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
]

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortBy, setSortBy] = useState("featured")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 300])
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  useEffect(() => {
    let filtered = products

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    // Price filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [sortBy, categoryFilter, priceRange])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Filters</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={300} min={0} step={10} className="mt-2" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">All Products</h1>
              <p className="text-gray-600">{filteredProducts.length} products found</p>
            </div>

            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                    <Link href={`/products/${product.id}`}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                      {product.isSale && <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>}
                    </div>

                    {/* Wishlist Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold mb-2 hover:text-purple-600 transition-colors">{product.name}</h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                              }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-purple-600">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button
                onClick={() => {
                  setCategoryFilter("all")
                  setPriceRange([0, 300])
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
