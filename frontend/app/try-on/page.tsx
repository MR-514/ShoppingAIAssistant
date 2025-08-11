"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, Download, RotateCcw, Sparkles } from "lucide-react"

const tryOnProducts = [
  {
    id: 1,
    name: "Classic Denim Jacket",
    image: "/placeholder.svg?height=300&width=250",
    category: "Jackets",
    price: 89.99,
  },
  {
    id: 2,
    name: "Floral Summer Dress",
    image: "/placeholder.svg?height=300&width=250",
    category: "Dresses",
    price: 65.99,
  },
  {
    id: 3,
    name: "Casual White T-Shirt",
    image: "/placeholder.svg?height=300&width=250",
    category: "Tops",
    price: 29.99,
  },
  {
    id: 4,
    name: "Black Blazer",
    image: "/placeholder.svg?height=300&width=250",
    category: "Jackets",
    price: 129.99,
  },
]

export default function TryOnPage() {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUserImage(e.target?.result as string)
        setTryOnResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTryOn = async () => {
    if (!userImage || selectedProduct === null) return

    setIsProcessing(true)

    // Simulate AI processing time
    setTimeout(() => {
      // In a real implementation, this would call an AI service
      // For demo purposes, we'll create a simple overlay effect
      createTryOnPreview()
      setIsProcessing(false)
    }, 3000)
  }

  const createTryOnPreview = () => {
    const canvas = canvasRef.current
    if (!canvas || !userImage) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const userImg = new Image()
    userImg.crossOrigin = "anonymous"
    userImg.onload = () => {
      // Set canvas size
      canvas.width = 400
      canvas.height = 500

      // Draw user image
      ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height)

      // Add overlay effect to simulate try-on
      ctx.globalAlpha = 0.7
      ctx.fillStyle = "rgba(138, 43, 226, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add text overlay
      ctx.globalAlpha = 1
      ctx.fillStyle = "white"
      ctx.font = "16px Arial"
      ctx.fillText("Virtual Try-On Preview", 10, 30)
      ctx.font = "12px Arial"
      ctx.fillText("AI-generated preview", 10, 50)

      // Convert to data URL
      setTryOnResult(canvas.toDataURL())
    }
    userImg.src = userImage
  }

  const downloadResult = () => {
    if (!tryOnResult) return

    const link = document.createElement("a")
    link.download = "virtual-try-on.png"
    link.href = tryOnResult
    link.click()
  }

  const resetTryOn = () => {
    setUserImage(null)
    setSelectedProduct(null)
    setTryOnResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Virtual Try-On</h1>
          <p className="text-xl text-gray-600">See how clothes look on you before you buy them</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Upload and Controls */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upload Your Photo</h3>

                {userImage ? (
                  <div className="relative">
                    <img
                      src={userImage || "/placeholder.svg"}
                      alt="User"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserImage(null)}
                      className="absolute top-2 right-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload a clear photo of yourself (front-facing works best)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button variant="outline" className="cursor-pointer bg-transparent">
                        <Camera className="mr-2 h-4 w-4" />
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tips for best results:</strong>
                    <br />• Use a clear, well-lit photo • Stand straight facing the camera • Wear fitted clothing for
                    accurate overlay • Avoid busy backgrounds
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Select Product to Try On</h3>

                <div className="grid grid-cols-2 gap-4">
                  {tryOnProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product.id)}
                      className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                        selectedProduct === product.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-purple-600 font-bold text-sm">${product.price}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {product.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Try On Button */}
            <Button
              onClick={handleTryOn}
              disabled={!userImage || selectedProduct === null || isProcessing}
              className="w-full h-12"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing Virtual Try-On...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try On Product
                </>
              )}
            </Button>
          </div>

          {/* Right Side - Try-On Result */}
          <div>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Virtual Try-On Result</h3>
                  {tryOnResult && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={downloadResult}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetTryOn}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  )}
                </div>

                <div className="aspect-[4/5] bg-gray-100 rounded-lg flex items-center justify-center">
                  {tryOnResult ? (
                    <img
                      src={tryOnResult || "/placeholder.svg"}
                      alt="Try-on result"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : isProcessing ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
                      <p className="text-gray-600">Creating your virtual try-on...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Upload a photo and select a product to see the virtual try-on</p>
                    </div>
                  )}
                </div>

                {tryOnResult && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <strong>Virtual try-on complete!</strong> This is an AI-generated preview. Actual fit and
                      appearance may vary. Consider ordering multiple sizes if unsure.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* How It Works */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">How Virtual Try-On Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">1. Upload Your Photo</h4>
                <p className="text-sm text-gray-600">Take or upload a clear, front-facing photo of yourself</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">2. AI Processing</h4>
                <p className="text-sm text-gray-600">
                  Our AI analyzes your body shape and overlays the selected clothing
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">3. See the Result</h4>
                <p className="text-sm text-gray-600">View how the clothing looks on you and download the result</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
