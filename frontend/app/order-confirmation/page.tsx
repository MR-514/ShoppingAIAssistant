import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold mb-2">Order Number</h3>
                <p className="text-purple-600 font-mono">{orderNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Estimated Delivery</h3>
                <p>{estimatedDelivery}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Confirmation Email</h3>
            <p className="text-sm text-gray-600">
              You'll receive an email confirmation with your order details shortly.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold mb-2">Order Processing</h3>
            <p className="text-sm text-gray-600">We'll prepare your items for shipping within 1-2 business days.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Shipping Updates</h3>
            <p className="text-sm text-gray-600">Track your package with updates sent directly to your email.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
          <Button variant="outline" size="lg">
            Track Your Order
          </Button>
        </div>

        {/* Support */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Need help with your order? Contact our support team at{" "}
            <a href="mailto:support@aifashion.com" className="text-purple-600 hover:underline">
              support@aifashion.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
