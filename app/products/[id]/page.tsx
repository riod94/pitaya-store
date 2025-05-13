import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Minus, Plus, Share2, ShoppingBag, Star, Truck } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// This would normally come from a database
const product = {
  id: 1,
  name: "Pistachio Cangkang",
  description:
    "Premium quality pistachios with shells, perfect for snacking. Our pistachios are carefully selected, roasted to perfection, and lightly salted to enhance their natural flavor. Rich in protein, fiber, and antioxidants, they make a delicious and nutritious snack for any occasion.",
  prices: {
    "100g": "64.000",
    "250g": "139.200",
    "500g": "276.000",
    "1kg": "528.000",
  },
  rating: 4.8,
  reviewCount: 124,
  stock: 45,
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  nutrition: {
    calories: "567 kcal",
    protein: "20.6g",
    fat: "45.3g",
    carbs: "27.2g",
    fiber: "10.3g",
  },
  features: [
    "Premium quality",
    "Freshly roasted",
    "No additives",
    "Rich in antioxidants",
    "Source of protein",
    "Heart-healthy fats",
  ],
  relatedProducts: [
    {
      id: 2,
      name: "Mede Panggang",
      price: "27.900",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Almond Panggang",
      price: "25.500",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Walnut Panggang",
      price: "29.400",
      image: "/placeholder.svg?height=200&width=200",
    },
  ],
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link href="/" className="text-gray-500 hover:text-pink-500 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/#products" className="text-gray-500 hover:text-pink-500 transition-colors">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-pink-500 transition-colors" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden border ${
                      index === 0 ? "border-pink-500" : "border-gray-200"
                    } cursor-pointer`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100 px-3 py-1 rounded-full">
                    Best Seller
                  </Badge>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-green-600">In Stock ({product.stock})</span>
                </div>
                <p className="text-gray-600 mb-6">{product.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Select Size</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {Object.entries(product.prices).map(([size, price]) => (
                    <div
                      key={size}
                      className="border border-gray-200 hover:border-pink-500 rounded-lg p-3 text-center cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-medium">{size}</p>
                      <p className="text-lg font-semibold">Rp {price}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pink-500">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center">1</span>
                    <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pink-500">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Button className="flex-1 bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white py-6 h-auto">
                    <ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart
                  </Button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <Truck className="h-5 w-5 text-teal-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Free shipping on orders over Rp 500.000</p>
                    <p className="text-sm text-gray-600">Delivery estimated within 2-3 business days</p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="pt-4">
                  <h3 className="font-semibold mb-3">Product Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="nutrition" className="pt-4">
                  <h3 className="font-semibold mb-3">Nutritional Information</h3>
                  <p className="text-sm text-gray-500 mb-3">Per 100g serving</p>
                  <div className="space-y-2">
                    {Object.entries(product.nutrition).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Customer Reviews</h3>
                    <Button variant="outline" size="sm">
                      Write a Review
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                          <span className="font-medium">John D.</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        These pistachios are amazing! So fresh and flavorful. Will definitely buy again.
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                          <span className="font-medium">Sarah M.</span>
                        </div>
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                          {[...Array(1)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Good quality and taste. Packaging was nice but a few nuts were broken.
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Load More Reviews
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((item) => (
                <Link href={`/products/${item.id}`} key={item.id}>
                  <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 group-hover:text-pink-500 transition-colors">
                        {item.name}
                      </h3>
                      <p className="font-semibold mt-1">Rp {item.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
