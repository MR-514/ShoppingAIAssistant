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
    name: "Floral Summer pant",
    image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/r95xqygW_908f4b3bf54842f7875feb024d8d28b2_lks7dh.webp",
    category: "Dresses",
    price: 65.99,
    garment_type: "lower_body",
  },
  {
    id: 2,
    name: "White Kurtha",
    image: "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/7l7oKg5A_04ea01c32d3543b89ae4280d67e283e0_x791cu.webp",
    garment_type: "upper_body",
    category: "Tops",
    price: 29.99,
  },
  
]

export default function TryOnPage() {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [selectedGarments, setSelectedGarments] = useState<Array<{
    id: number
    name: string
    garment_type: string
    image: string
    category: string
    price: number
  }>>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const [webhookResponse, setWebhookResponse] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    const form = new FormData()
    form.append("file", file)
    try {
      const res = await fetch("https://backend-service1-68708940504.us-central1.run.app/upload-image", { method: "POST", body: form })
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`)
      }
      const data = (await res.json()) as { url?: string; error?: string }
      // console.log('Upload response:', data);
      const imageUrl = data.url
      if (!imageUrl) {
        throw new Error(data.error || "No URL returned from upload")
      }
      setUserImage(imageUrl)
      setTryOnResult(null)
      setError("")
      if (selectedGarments.length === 0 && tryOnProducts.length > 0) {
        setSelectedGarments([tryOnProducts[0]])
      }
    } catch (err: any) {
      console.error("Upload error", err)
      setError(err.message || "Upload failed")
      // Final fallback to local preview if needed
      const reader = new FileReader()
      reader.onload = (ev) => {
        setUserImage(ev.target?.result as string)
        setTryOnResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGarmentSelection = (product: any) => {
    const existingIndex = selectedGarments.findIndex(g => g.garment_type === product.garment_type)
    
    if (existingIndex >= 0) {
      // Replace existing garment of same type
      const newGarments = [...selectedGarments]
      newGarments[existingIndex] = product
      setSelectedGarments(newGarments)
    } else {
      // Add new garment
      setSelectedGarments([...selectedGarments, product])
    }
  }

  const removeGarment = (garmentType: string) => {
    setSelectedGarments(selectedGarments.filter(g => g.garment_type !== garmentType))
  }

  const handleTryOn = async () => {
    if (!userImage || selectedGarments.length === 0) return
    
    setIsProcessing(true)
    setWebhookStatus(null)
    setError(null)
    setWebhookResponse(null)
    setTryOnResult(null)
    
    try {
      // Create unified payload
      const payload = {
        model_image: userImage,
        garments: {
          upper_body: selectedGarments.find(g => g.garment_type === "upper_body")?.image || null,
          lower_body: selectedGarments.find(g => g.garment_type === "lower_body")?.image || null
        },
        selected_garments: selectedGarments
      }

      // Send to n8n webhook and wait for response
      const webhookRes = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      
      if (!webhookRes.ok) {
        throw new Error(`Webhook failed: ${webhookRes.status}`)
      }


      // Parse the response from n8n
      const responseData = await webhookRes.json()
      setWebhookResponse(responseData)
      
      // Handle different response types from n8n workflow
      let resultImage = null
      
      // Try to extract the generated image from various possible response formats
      if (responseData.result_image) {
        resultImage = responseData.result_image
      } else if (responseData.image_url) {
        resultImage = responseData.image_url
      } else if (responseData.generated_image) {
        resultImage = responseData.generated_image
      } else if (responseData.output_image) {
        resultImage = responseData.output_image
      } else if (responseData.try_on_result) {
        resultImage = responseData.try_on_result
      } else if (responseData.data && responseData.data.image) {
        resultImage = responseData.data.image
      } else if (responseData.result && responseData.result.image) {
        resultImage = responseData.result.image
      }
      
      // Set the result image if found
      if (resultImage) {
        setTryOnResult(resultImage)
        setWebhookStatus("Try-on completed successfully! Generated image displayed.")
      } else {
        // No image in response, show status message
        if (responseData.success) {
          setWebhookStatus("Try-on completed successfully! Check the response details below.")
        } else if (responseData.status === "processing") {
          setWebhookStatus("Processing your try-on request... This may take a few moments.")
        } else if (responseData.error) {
          setError(`Try-on failed: ${responseData.error}`)
        } else if (responseData.message) {
          setWebhookStatus(responseData.message)
        } else {
          setWebhookStatus("Try-on request processed. Check response details below.")
        }
        
        // Fallback to local preview if no result image
        setTimeout(() => {
          createTryOnPreview()
        }, 2000)
      }
      
    } catch (err: any) {
      setError(err.message || "Webhook request failed")
      // Fallback to local preview on error
      setTimeout(() => {
        createTryOnPreview()
      }, 2000)
    } finally {
      setIsProcessing(false)
    }
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
    setSelectedGarments([])
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
                    <Button
                      variant="outline"
                      className="cursor-pointer bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Choose Photo
                    </Button>
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

            {/* Selected Garments Display */}
            {selectedGarments.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Selected Garments</h3>
                  <div className="space-y-3">
                    {selectedGarments.map((garment) => (
                      <div key={garment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img
                          src={garment.image}
                          alt={garment.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{garment.name}</h4>
                          <p className="text-xs text-gray-600 capitalize">{garment.garment_type.replace('_', ' ')}</p>
                          <p className="text-purple-600 font-bold text-sm">${garment.price}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeGarment(garment.garment_type)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Selection */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Select Garments to Try On</h3>
                <p className="text-sm text-gray-600 mb-4">Choose upper body, lower body, or both</p>

                <div className="grid grid-cols-1 gap-4">
                  {tryOnProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleGarmentSelection(product)}
                      className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                        selectedGarments.some(g => g.garment_type === product.garment_type)
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-purple-600 font-bold text-sm">${product.price}</p>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {product.garment_type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedGarments.some(g => g.garment_type === product.garment_type) ? "Selected" : "Click to select"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Try On Button */}
            <Button
              onClick={() => {
                if (!userImage) {
                  setError("Please upload an image first.");
                  return;
                }
                if (selectedGarments.length === 0) {
                  setError("Please select at least one garment to try on.");
                  return;
                }
                handleTryOn();
              }}
              disabled={!userImage || selectedGarments.length === 0 || isProcessing}
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
                  Try On {selectedGarments.length > 0 ? `${selectedGarments.length} Garment${selectedGarments.length > 1 ? 's' : ''}` : 'Product'}
                </>
              )}
            </Button>
            
            {/* Status Messages */}
            {webhookStatus && <div className="mt-2 text-green-600 text-xs">{webhookStatus}</div>}
            {error && <div className="mt-2 text-red-600 text-xs">Error: {error}</div>}
            
            {/* Webhook Response Details */}
            {/* {webhookResponse && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Webhook Response:</h4>
                  <div className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                    <pre>{JSON.stringify(webhookResponse, null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            )} */}
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
                      src={webhookResponse?.output}
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
                      <p>Upload a photo and select garments to see the virtual try-on</p>
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
                <h4 className="font-medium mb-2">2. Select Garments</h4>
                <p className="text-sm text-gray-600">
                  Choose upper body, lower body, or both garments to try on
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
      {userImage && (
        <div className="mt-2 text-xs break-all text-blue-700">
          <span>Image URL: </span>
          <a href={userImage} target="_blank" rel="noopener noreferrer" className="underline">{userImage}</a>
        </div>
      )}
      {error && (
        <div className="mt-2 text-xs text-red-600">Error: {error}</div>
      )}
    </div>
  )
}
