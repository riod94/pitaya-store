import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag } from "lucide-react"

// Product data based on the price list
const products = [
  {
    id: 1,
    name: "Pistachio Cangkang",
    prices: {
      "100g": "64.000",
      "250g": "139.200",
      "500g": "276.000",
      "1kg": "528.000",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Premium quality pistachios with shells, perfect for snacking.",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Mede Panggang",
    prices: {
      "100g": "27.900",
      "250g": "54.000",
      "500g": "105.300",
      "1kg": "208.800",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Roasted cashews with a rich, buttery flavor.",
  },
  {
    id: 3,
    name: "Almond Panggang",
    prices: {
      "100g": "25.500",
      "250g": "51.000",
      "500g": "100.300",
      "1kg": "193.800",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Roasted almonds, a nutritious and delicious snack option.",
    badge: "Popular",
  },
  {
    id: 4,
    name: "Walnut Panggang",
    prices: {
      "100g": "29.400",
      "250g": "54.600",
      "500g": "102.900",
      "1kg": "196.900",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Roasted walnuts with a distinctive rich flavor.",
  },
  {
    id: 5,
    name: "Hazelnut",
    prices: {
      "100g": "33.800",
      "250g": "81.900",
      "500g": "158.600",
      "1kg": "304.200",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Premium hazelnuts, perfect for snacking or baking.",
    badge: "New",
  },
  {
    id: 6,
    name: "Cranberry",
    prices: {
      "100g": "18.300",
      "250g": "45.000",
      "500g": "87.000",
      "1kg": "168.400",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Dried cranberries, a sweet and tangy addition to your diet.",
  },
  {
    id: 7,
    name: "Chia Seed",
    prices: {
      "100g": "10.000",
      "250g": "23.600",
      "500g": "45.700",
      "1kg": "87.700",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Nutrient-rich chia seeds for a healthy lifestyle.",
  },
  {
    id: 8,
    name: "Kismis Hitam",
    prices: {
      "100g": "8.000",
      "250g": "15.800",
      "500g": "30.200",
      "1kg": "58.500",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Black raisins, naturally sweet and packed with nutrients.",
  },
]

export default function ProductSection() {
  return (
    <section className="py-16 bg-gray-50" id="products">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Premium <span className="text-pink-500">Products</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our selection of high-quality nuts and seeds, sourced from the best suppliers and carefully
            processed to preserve their natural goodness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative"
            >
              {/* Badge */}
              {product.badge && (
                <Badge className="absolute top-4 left-4 z-10 bg-pink-500 hover:bg-pink-600">{product.badge}</Badge>
              )}

              {/* Wishlist button */}
              <button className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Heart className="h-4 w-4 text-gray-600 hover:text-pink-500 transition-colors" />
              </button>

              {/* Image container */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                {/* Price selector */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(product.prices)
                      .slice(0, 2)
                      .map(([weight, price]) => (
                        <div key={weight} className="flex-1">
                          <div className="text-center p-2 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 cursor-pointer transition-colors">
                            <p className="text-xs text-gray-500">{weight}</p>
                            <p className="font-semibold">Rp {price}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(product.prices)
                      .slice(2, 4)
                      .map(([weight, price]) => (
                        <div key={weight} className="flex-1">
                          <div className="text-center p-2 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 cursor-pointer transition-colors">
                            <p className="text-xs text-gray-500">{weight}</p>
                            <p className="font-semibold">Rp {price}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Button */}
                <Button className="w-full bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white rounded-xl flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50 px-6 py-2 rounded-full">
            View Full Price List
          </Button>
        </div>
      </div>
    </section>
  )
}
