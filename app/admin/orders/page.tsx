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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal, Search, Filter } from "lucide-react"
import Link from "next/link"

// Sample order data
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2023-05-10",
    total: "256.000",
    status: "Completed",
    platform: "Shopee",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2023-05-09",
    total: "128.400",
    status: "Processing",
    platform: "Tokopedia",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: "2023-05-08",
    total: "352.600",
    status: "Shipped",
    platform: "TikTok Shop",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    date: "2023-05-07",
    total: "87.700",
    status: "Completed",
    platform: "WhatsApp",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    date: "2023-05-06",
    total: "195.300",
    status: "Cancelled",
    platform: "Lazada",
  },
]

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and track their status.</p>
        </div>
        <Link href="/admin/orders/new">
          <Button className="bg-pink-500 hover:bg-pink-600">
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input type="search" placeholder="Search orders..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="shopee">Shopee</SelectItem>
              <SelectItem value="tokopedia">Tokopedia</SelectItem>
              <SelectItem value="tiktok">TikTok Shop</SelectItem>
              <SelectItem value="lazada">Lazada</SelectItem>
              <SelectItem value="blibli">Blibli</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        order.platform === "Shopee"
                          ? "bg-orange-500"
                          : order.platform === "Tokopedia"
                            ? "bg-green-500"
                            : order.platform === "TikTok Shop"
                              ? "bg-black"
                              : order.platform === "Lazada"
                                ? "bg-blue-500"
                                : order.platform === "Blibli"
                                  ? "bg-blue-600"
                                  : "bg-green-600"
                      }`}
                    ></div>
                    {order.platform}
                  </div>
                </TableCell>
                <TableCell>Rp {order.total}</TableCell>
                <TableCell>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Shipped"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Cancel Order</DropdownMenuItem>
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
