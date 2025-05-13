import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Plus, MoreHorizontal, Search, Filter } from "lucide-react"

// Sample product data
const products = [
  {
    id: "1",
    name: "Pistachio Cangkang",
    image: "/placeholder.svg?height=40&width=40",
    price: {
      "100g": "64.000",
      "250g": "139.200",
      "500g": "276.000",
      "1kg": "528.000",
    },
    stock: 45,
    status: "In Stock",
  },
  {
    id: "2",
    name: "Mede Panggang",
    image: "/placeholder.svg?height=40&width=40",
    price: {
      "100g": "27.900",
      "250g": "54.000",
      "500g": "105.300",
      "1kg": "208.800",
    },
    stock: 32,
    status: "In Stock",
  },
  {
    id: "3",
    name: "Almond Panggang",
    image: "/placeholder.svg?height=40&width=40",
    price: {
      "100g": "25.500",
      "250g": "51.000",
      "500g": "100.300",
      "1kg": "193.800",
    },
    stock: 18,
    status: "Low Stock",
  },
  {
    id: "4",
    name: "Walnut Panggang",
    image: "/placeholder.svg?height=40&width=40",
    price: {
      "100g": "29.400",
      "250g": "54.600",
      "500g": "102.900",
      "1kg": "196.900",
    },
    stock: 27,
    status: "In Stock",
  },
  {
    id: "5",
    name: "Hazelnut",
    image: "/placeholder.svg?height=40&width=40",
    price: {
      "100g": "33.800",
      "250g": "81.900",
      "500g": "158.600",
      "1kg": "304.200",
    },
    stock: 0,
    status: "Out of Stock",
  },
]

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and pricing.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-pink-500 hover:bg-pink-600">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input type="search" placeholder="Search products..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price (100g)</TableHead>
              <TableHead>Price (250g)</TableHead>
              <TableHead>Price (500g)</TableHead>
              <TableHead>Price (1kg)</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-md overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>Rp {product.price["100g"]}</TableCell>
                <TableCell>Rp {product.price["250g"]}</TableCell>
                <TableCell>Rp {product.price["500g"]}</TableCell>
                <TableCell>Rp {product.price["1kg"]}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                      product.status === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : product.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
