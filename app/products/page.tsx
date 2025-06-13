"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag, Search, SlidersHorizontal } from "lucide-react"

// Product data based on the price list
const allProducts = [
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
    category: "Nuts",
    tags: ["premium", "snack"],
    priceRange: "high",
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
    category: "Nuts",
    tags: ["roasted", "snack"],
    priceRange: "medium",
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
    category: "Nuts",
    tags: ["roasted", "snack"],
    priceRange: "medium",
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
    category: "Nuts",
    tags: ["roasted", "snack"],
    priceRange: "medium",
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
    category: "Nuts",
    tags: ["premium", "baking"],
    priceRange: "high",
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
    category: "Dried Fruits",
    tags: ["sweet", "snack"],
    priceRange: "low",
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
    category: "Seeds",
    tags: ["superfood", "healthy"],
    priceRange: "low",
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
    category: "Dried Fruits",
    tags: ["sweet", "snack"],
    priceRange: "low",
  },
  {
    id: 9,
    name: "Pumpkin Seeds",
    prices: {
      "100g": "15.500",
      "250g": "36.000",
      "500g": "70.000",
      "1kg": "135.000",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Roasted pumpkin seeds, rich in nutrients and perfect for snacking.",
    category: "Seeds",
    tags: ["roasted", "healthy"],
    priceRange: "low",
  },
  {
    id: 10,
    name: "Sunflower Seeds",
    prices: {
      "100g": "12.000",
      "250g": "28.000",
      "500g": "54.000",
      "1kg": "105.000",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "Crunchy sunflower seeds, a great source of vitamin E.",
    category: "Seeds",
    tags: ["crunchy", "healthy"],
    priceRange: "low",
  },
  {
    id: 11,
    name: "Mixed Nuts Premium",
    prices: {
      "100g": "45.000",
      "250g": "110.000",
      "500g": "215.000",
      "1kg": "420.000",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "A premium blend of assorted nuts for the perfect snack mix.",
    badge: "Premium",
    category: "Mixed",
    tags: ["premium", "assorted"],
    priceRange: "high",
  },
  {
    id: 12,
    name: "Trail Mix",
    prices: {
      "100g": "35.000",
      "250g": "85.000",
      "500g": "165.000",
      "1kg": "320.000",
    },
    image: "/placeholder.svg?height=300&width=300",
    description: "A delicious mix of nuts, seeds, and dried fruits for energy on the go.",
    category: "Mixed",
    tags: ["energy", "assorted"],
    priceRange: "medium",
  },
]

const categories = ["All", "Nuts", "Seeds", "Dried Fruits", "Mixed"]
const priceRanges = ["All", "low", "medium", "high"]
const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(allProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState("All")
  const [sortBy, setSortBy] = useState("name-asc")
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort products
  useEffect(() => {
    let filteredProducts = [...allProducts]

    // Apply search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory)
    }

    // Apply price range filter
    if (selectedPriceRange !== "All") {
      filteredProducts = filteredProducts.filter((product) => product.priceRange === selectedPriceRange)
    }

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "price-asc":
        filteredProducts.sort(
          (a, b) =>
            Number.parseInt(a.prices["100g"].replace(".", "")) - Number.parseInt(b.prices["100g"].replace(".", "")),
        )
        break
      case "price-desc":
        filteredProducts.sort(
          (a, b) =>
            Number.parseInt(b.prices["100g"].replace(".", "")) - Number.parseInt(a.prices["100g"].replace(".", "")),
        )
        break
    }

    setProducts(filteredProducts)
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy])

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedPriceRange("All")
    setSortBy("name-asc")
  }

  return (
    <>
            <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">All Products</h1>
            <p className="text-gray-600">Discover our selection of premium nuts, seeds, and dried fruits.</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${showFilters ? "bg-gray-100" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              <div className="w-40">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Panel */}
            {showFilters && (
              <div className="lg:w-64 flex-shrink-0 bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Category</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategory === category}
                            onCheckedChange={() => setSelectedCategory(category)}
                          />
                          <Label htmlFor={`category-${category}`} className="ml-2 text-sm font-normal cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <div key={range} className="flex items-center">
                          <Checkbox
                            id={`price-${range}`}
                            checked={selectedPriceRange === range}
                            onCheckedChange={() => setSelectedPriceRange(range)}
                          />
                          <Label
                            htmlFor={`price-${range}`}
                            className="ml-2 text-sm font-normal cursor-pointer capitalize"
                          >
                            {range === "All"
                              ? "All Prices"
                              : range === "low"
                                ? "Budget Friendly"
                                : range === "medium"
                                  ? "Mid Range"
                                  : "Premium"}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative"
                    >
                      {/* Badge */}
                      {product.badge && (
                        <Badge className="absolute top-4 left-4 z-10 bg-pink-500 hover:bg-pink-600">
                          {product.badge}
                        </Badge>
                      )}

                      {/* Wishlist button */}
                      <button className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Heart className="h-4 w-4 text-gray-600 hover:text-pink-500 transition-colors" />
                      </button>

                      {/* Image container */}
                      <Link href={`/products/${product.id}`}>
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-5">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-500 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                        {/* Price */}
                        <div className="mb-4">
                          <p className="font-semibold">
                            Rp {product.prices["100g"]} <span className="text-sm font-normal">/ 100g</span>
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white"
                            size="sm"
                          >
                            <ShoppingBag className="h-4 w-4 mr-1" /> Add to Cart
                          </Button>
                          <Link href={`/checkout?productId=${product.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              Buy Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any products matching your criteria. Try adjusting your filters or search term.
                  </p>
                  <Button onClick={resetFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
          </>
  )
}
