"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  MoreHorizontal,
  Eye,
  Download,
  ArrowLeft,
} from "lucide-react"

// Sample user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+62 812 3456 7890",
  avatar: "/placeholder.svg?height=100&width=100",
  addresses: [
    {
      id: 1,
      name: "Home",
      recipient: "John Doe",
      street: "Jl. Sudirman No. 123",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      postalCode: "10220",
      phone: "+62 812 3456 7890",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      recipient: "John Doe",
      street: "Jl. Gatot Subroto No. 456",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postalCode: "12930",
      phone: "+62 812 3456 7890",
      isDefault: false,
    },
  ],
  orders: [
    {
      id: "ORD-001",
      date: "2023-05-10",
      total: "256.000",
      status: "Completed",
      items: [
        {
          name: "Pistachio Cangkang",
          size: "100g",
          quantity: 2,
          price: "64.000",
        },
        {
          name: "Almond Panggang",
          size: "250g",
          quantity: 1,
          price: "51.000",
        },
      ],
    },
    {
      id: "ORD-002",
      date: "2023-05-20",
      total: "128.400",
      status: "Processing",
      items: [
        {
          name: "Mede Panggang",
          size: "250g",
          quantity: 1,
          price: "54.000",
        },
        {
          name: "Cranberry",
          size: "100g",
          quantity: 1,
          price: "18.300",
        },
      ],
    },
    {
      id: "ORD-003",
      date: "2023-06-05",
      total: "352.600",
      status: "Shipped",
      items: [
        {
          name: "Hazelnut",
          size: "250g",
          quantity: 1,
          price: "81.900",
        },
        {
          name: "Walnut Panggang",
          size: "500g",
          quantity: 1,
          price: "102.900",
        },
      ],
    },
  ],
  wishlist: [
    {
      id: 1,
      name: "Pistachio Cangkang",
      price: "64.000",
      size: "100g",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      name: "Hazelnut",
      price: "81.900",
      size: "250g",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  return (
    <>
            <main className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-lg">{user.name}</h2>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-2">
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "profile"
                        ? "bg-pink-50 text-pink-500"
                        : "text-gray-700 hover:bg-gray-50 transition-colors"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "orders"
                        ? "bg-pink-50 text-pink-500"
                        : "text-gray-700 hover:bg-gray-50 transition-colors"
                    }`}
                    onClick={() => {
                      setActiveTab("orders")
                      setSelectedOrder(null)
                    }}
                  >
                    <Package className="h-5 w-5" />
                    <span>Orders</span>
                  </button>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "wishlist"
                        ? "bg-pink-50 text-pink-500"
                        : "text-gray-700 hover:bg-gray-50 transition-colors"
                    }`}
                    onClick={() => setActiveTab("wishlist")}
                  >
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </button>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "addresses"
                        ? "bg-pink-50 text-pink-500"
                        : "text-gray-700 hover:bg-gray-50 transition-colors"
                    }`}
                    onClick={() => setActiveTab("addresses")}
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Addresses</span>
                  </button>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "payment"
                        ? "bg-pink-50 text-pink-500"
                        : "text-gray-700 hover:bg-gray-50 transition-colors"
                    }`}
                    onClick={() => setActiveTab("payment")}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Methods</span>
                  </button>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "notifications"
                        ? "bg-pink-50 text-pink-500"
                        : "text-gray-700 hover:bg-gray-50 transition-colors"
                    }`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </button>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === "settings"
                        ? "bg-pink-50 text-pink-500"
                        : "text-gray-700 hover:bg-gray-50 transition-colors"
                    }`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </nav>
                <div className="p-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={user.email} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" defaultValue={user.phone} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="birthdate">Date of Birth</Label>
                            <Input id="birthdate" type="date" />
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-pink-500 hover:bg-pink-600">Save Changes</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Picture</CardTitle>
                      <CardDescription>Update your profile image</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline">Upload New Picture</Button>
                            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                              Remove
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">Allowed formats: JPG, PNG. Maximum file size: 2MB.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Change your password</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-pink-500 hover:bg-pink-600">Update Password</Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && !selectedOrder && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Orders</CardTitle>
                      <CardDescription>View and track your orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.orders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 transition-colors cursor-pointer"
                            onClick={() => setSelectedOrder(order.id)}
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{order.id}</span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-500">{order.date}</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {order.items.map((item) => item.name).join(", ")}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-semibold">Rp {order.total}</p>
                                  <Badge
                                    className={`${
                                      order.status === "Completed"
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : order.status === "Processing"
                                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                          : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                    }`}
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <ArrowLeft className="h-4 w-4 rotate-180" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Order Detail */}
              {activeTab === "orders" && selectedOrder && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center">
                      <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSelectedOrder(null)}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div>
                        <CardTitle>Order Details</CardTitle>
                        <CardDescription>
                          {user.orders.find((o) => o.id === selectedOrder)?.id} •{" "}
                          {user.orders.find((o) => o.id === selectedOrder)?.date}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                          <Badge
                            className={`${
                              user.orders.find((o) => o.id === selectedOrder)?.status === "Completed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : user.orders.find((o) => o.id === selectedOrder)?.status === "Processing"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            }`}
                          >
                            {user.orders.find((o) => o.id === selectedOrder)?.status}
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" /> Track Order
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" /> Invoice
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">Items</h3>
                          <div className="space-y-4">
                            {user.orders
                              .find((o) => o.id === selectedOrder)
                              ?.items.map((item, index) => (
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
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Subtotal</span>
                              <span>Rp {user.orders.find((o) => o.id === selectedOrder)?.total}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Shipping</span>
                              <span>Rp 15.000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Tax</span>
                              <span>Rp 0</span>
                            </div>
                            <div className="flex justify-between font-semibold pt-2 border-t border-gray-100">
                              <span>Total</span>
                              <span>
                                Rp{" "}
                                {(
                                  Number.parseInt(
                                    user.orders.find((o) => o.id === selectedOrder)?.total.replace(/\./g, "") || "0",
                                  ) + 15000
                                ).toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                          <h3 className="font-semibold mb-3">Shipping Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-500 text-sm">Shipping Address</p>
                              <p className="font-medium">{user.addresses[0].recipient}</p>
                              <p>{user.addresses[0].street}</p>
                              <p>
                                {user.addresses[0].city}, {user.addresses[0].province} {user.addresses[0].postalCode}
                              </p>
                              <p>{user.addresses[0].phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm">Shipping Method</p>
                              <p className="font-medium">JNE Regular</p>
                              <p className="text-gray-500 text-sm mt-4">Payment Method</p>
                              <p className="font-medium">Bank Transfer (BCA)</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center pt-4">
                          <Button className="bg-pink-500 hover:bg-pink-600">Buy Again</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Wishlist</CardTitle>
                      <CardDescription>Products you've saved for later</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user.wishlist.length > 0 ? (
                        <div className="space-y-4">
                          {user.wishlist.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg"
                            >
                              <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                  <div>
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                                  </div>
                                  <p className="font-semibold">Rp {item.price}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                  <Button className="bg-pink-500 hover:bg-pink-600">Add to Cart</Button>
                                  <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                          <p className="text-gray-500 mb-4">
                            Browse our products and click the heart icon to add items to your wishlist.
                          </p>
                          <Link href="/#products">
                            <Button className="bg-pink-500 hover:bg-pink-600">Browse Products</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>My Addresses</CardTitle>
                        <CardDescription>Manage your shipping addresses</CardDescription>
                      </div>
                      <Button className="bg-pink-500 hover:bg-pink-600">Add New Address</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`border ${
                              address.isDefault ? "border-pink-500" : "border-gray-200"
                            } rounded-lg p-4 relative`}
                          >
                            {address.isDefault && (
                              <Badge className="absolute top-4 right-4 bg-pink-100 text-pink-800 hover:bg-pink-100">
                                Default
                              </Badge>
                            )}
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{address.name}</h3>
                                </div>
                                <p className="text-gray-700">{address.recipient}</p>
                                <p className="text-gray-700">{address.street}</p>
                                <p className="text-gray-700">
                                  {address.city}, {address.province} {address.postalCode}
                                </p>
                                <p className="text-gray-700">{address.phone}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  {!address.isDefault && <DropdownMenuItem>Set as Default</DropdownMenuItem>}
                                  <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              {!address.isDefault && (
                                <Button variant="outline" size="sm">
                                  Set as Default
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Manage your payment options</CardDescription>
                      </div>
                      <Button className="bg-pink-500 hover:bg-pink-600">Add Payment Method</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No payment methods yet</h3>
                        <p className="text-gray-500 mb-4">Add a payment method to make checkout faster and easier.</p>
                        <Button className="bg-pink-500 hover:bg-pink-600">Add Payment Method</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="email">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="email">Email</TabsTrigger>
                          <TabsTrigger value="sms">SMS</TabsTrigger>
                        </TabsList>
                        <TabsContent value="email" className="space-y-4 pt-4">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Order Updates</p>
                              <p className="text-sm text-gray-500">Receive updates about your orders</p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="order-updates-email"
                                type="checkbox"
                                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Promotions</p>
                              <p className="text-sm text-gray-500">Receive promotions and discounts</p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="promotions-email"
                                type="checkbox"
                                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Product Updates</p>
                              <p className="text-sm text-gray-500">Receive updates about new products</p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="product-updates-email"
                                type="checkbox"
                                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                              />
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="sms" className="space-y-4 pt-4">
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Order Updates</p>
                              <p className="text-sm text-gray-500">Receive updates about your orders</p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="order-updates-sms"
                                type="checkbox"
                                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                                defaultChecked
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Promotions</p>
                              <p className="text-sm text-gray-500">Receive promotions and discounts</p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="promotions-sms"
                                type="checkbox"
                                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">Product Updates</p>
                              <p className="text-sm text-gray-500">Receive updates about new products</p>
                            </div>
                            <div className="flex items-center h-5">
                              <input
                                id="product-updates-sms"
                                type="checkbox"
                                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-pink-500 hover:bg-pink-600">Save Preferences</Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Language</p>
                          <p className="text-sm text-gray-500">Select your preferred language</p>
                        </div>
                        <Select defaultValue="en">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="id">Bahasa Indonesia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Currency</p>
                          <p className="text-sm text-gray-500">Select your preferred currency</p>
                        </div>
                        <Select defaultValue="idr">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="idr">Indonesian Rupiah (IDR)</SelectItem>
                            <SelectItem value="usd">US Dollar (USD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Delete Account</p>
                          <p className="text-sm text-gray-500">
                            Permanently delete your account and all data associated with it
                          </p>
                        </div>
                        <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-pink-500 hover:bg-pink-600">Save Settings</Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
          </>
  )
}
