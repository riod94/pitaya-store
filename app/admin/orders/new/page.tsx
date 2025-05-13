"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

// Sample product data
const products = [
  { id: "1", name: "Pistachio Cangkang", prices: { "100g": 64000, "250g": 139200, "500g": 276000, "1kg": 528000 } },
  { id: "2", name: "Mede Panggang", prices: { "100g": 27900, "250g": 54000, "500g": 105300, "1kg": 208800 } },
  { id: "3", name: "Almond Panggang", prices: { "100g": 25500, "250g": 51000, "500g": 100300, "1kg": 193800 } },
  { id: "4", name: "Walnut Panggang", prices: { "100g": 29400, "250g": 54600, "500g": 102900, "1kg": 196900 } },
  { id: "5", name: "Hazelnut", prices: { "100g": 33800, "250g": 81900, "500g": 158600, "1kg": 304200 } },
]

export default function NewOrderPage() {
  const router = useRouter()
  const [orderItems, setOrderItems] = useState([{ productId: "", size: "100g", quantity: 1, price: 0 }])
  const [platform, setPlatform] = useState("WhatsApp")

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: "", size: "100g", quantity: 1, price: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...orderItems]
    newItems.splice(index, 1)
    setOrderItems(newItems)
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...orderItems]
    newItems[index] = { ...newItems[index], [field]: value }

    // Update price if product or size changes
    if (field === "productId" || field === "size") {
      const product = products.find((p) => p.id === (field === "productId" ? value : newItems[index].productId))
      if (product) {
        const size = field === "size" ? value : newItems[index].size
        newItems[index].price = product.prices[size as keyof typeof product.prices]
      }
    }

    setOrderItems(newItems)
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally save the order to your database
    alert("Order created successfully!")
    router.push("/admin/orders")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Order</h1>
          <p className="text-muted-foreground">Add a new customer order to the system.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Enter the customer's details for this order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" placeholder="Enter customer name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input id="customerPhone" placeholder="Enter phone number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email (Optional)</Label>
                <Input id="customerEmail" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress">Shipping Address</Label>
                <Textarea id="customerAddress" placeholder="Enter shipping address" rows={3} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Specify the order details and platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date</Label>
                <Input id="orderDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Shopee">Shopee</SelectItem>
                    <SelectItem value="Tokopedia">Tokopedia</SelectItem>
                    <SelectItem value="TikTok Shop">TikTok Shop</SelectItem>
                    <SelectItem value="Lazada">Lazada</SelectItem>
                    <SelectItem value="Blibli">Blibli</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select defaultValue="Processing">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea id="notes" placeholder="Enter any additional notes" rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Add products to this order.</CardDescription>
            </div>
            <Button type="button" onClick={handleAddItem} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end border-b pb-4">
                  <div className="col-span-4">
                    <Label htmlFor={`product-${index}`}>Product</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => handleItemChange(index, "productId", value)}
                    >
                      <SelectTrigger id={`product-${index}`}>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`size-${index}`}>Size</Label>
                    <Select value={item.size} onValueChange={(value) => handleItemChange(index, "size", value)}>
                      <SelectTrigger id={`size-${index}`}>
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100g">100g</SelectItem>
                        <SelectItem value="250g">250g</SelectItem>
                        <SelectItem value="500g">500g</SelectItem>
                        <SelectItem value="1kg">1kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`price-${index}`}>Price</Label>
                    <Input
                      id={`price-${index}`}
                      value={item.price.toLocaleString("id-ID")}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      disabled={orderItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items: {orderItems.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-2xl font-bold">Rp {calculateTotal().toLocaleString("id-ID")}</p>
            </div>
          </CardFooter>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/orders">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
            Create Order
          </Button>
        </div>
      </form>
    </div>
  )
}
