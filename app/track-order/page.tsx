"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Search, Truck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Sample order data
const sampleOrders = [
  {
    id: "ORD-123456",
    email: "guest@example.com",
    date: "2023-05-10",
    status: "Delivered",
    items: [
      {
        name: "Pistachio Cangkang",
        size: "100g",
        quantity: 2,
        price: "64.000",
      },
    ],
    total: "143.000",
    tracking: [
      {
        date: "2023-05-10 09:15",
        status: "Order Placed",
        description: "Your order has been received and is being processed.",
      },
      {
        date: "2023-05-10 14:30",
        status: "Payment Confirmed",
        description: "Your payment has been confirmed.",
      },
      {
        date: "2023-05-11 10:45",
        status: "Processing",
        description: "Your order is being prepared for shipping.",
      },
      {
        date: "2023-05-12 08:20",
        status: "Shipped",
        description: "Your order has been shipped via JNE Regular (JN123456789).",
      },
      {
        date: "2023-05-14 15:10",
        status: "Delivered",
        description: "Your order has been delivered.",
      },
    ],
  },
]

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const foundOrder = sampleOrders.find(
        (o) => o.id.toLowerCase() === orderId.toLowerCase() && o.email.toLowerCase() === email.toLowerCase(),
      )

      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        setError("No order found with the provided information. Please check and try again.")
      }
      setIsSearching(false)
    }, 1000)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-gray-500 hover:text-pink-500">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Track Your Order</h1>
          </div>

          <div className="max-w-3xl mx-auto">
            {!order ? (
              <Card>
                <CardHeader>
                  <CardTitle>Order Tracking</CardTitle>
                  <CardDescription>Enter your order ID and email address to track your order status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="order-id">Order ID</Label>
                      <Input
                        id="order-id"
                        placeholder="e.g. ORD-123456"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter the email used for the order"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </form>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-pink-500 hover:bg-pink-600"
                    onClick={handleSubmit}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4" /> Track Order
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Order Details</CardTitle>
                        <CardDescription>
                          {order.id} • {order.date}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : order.status === "Shipped"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Items</h3>
                      <div className="space-y-4">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                                </div>
                                <p className="font-semibold">Rp {item.price}</p>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="font-semibold mb-3">Order Summary</h3>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total</span>
                        <span className="font-semibold">Rp {order.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tracking Information</CardTitle>
                    <CardDescription>Follow the progress of your order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {order.tracking.map((step: any, index: number) => (
                        <div key={index} className="flex mb-6 last:mb-0">
                          <div className="mr-4 relative">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                index === 0 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {index === 0 ? (
                                <Package className="h-4 w-4" />
                              ) : index === order.tracking.length - 1 ? (
                                <Truck className="h-4 w-4" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                              )}
                            </div>
                            {index < order.tracking.length - 1 && (
                              <div className="absolute top-8 bottom-0 left-4 w-0.5 bg-gray-200"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{step.date}</p>
                            <p className="font-medium">{step.status}</p>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOrder(null)
                        setOrderId("")
                        setEmail("")
                      }}
                    >
                      Track Another Order
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
