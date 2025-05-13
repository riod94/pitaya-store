import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance and analytics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">Rp 12,543,000</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">243</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-500">
                <Package className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>2 new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">1,205</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>18% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex flex-col justify-center items-center">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">Monthly Sales (in thousands Rp)</h3>
                  </div>
                  <div className="w-full flex items-end justify-around h-[200px]">
                    {[
                      { name: "Jan", sales: 4000 },
                      { name: "Feb", sales: 3000 },
                      { name: "Mar", sales: 5000 },
                      { name: "Apr", sales: 4500 },
                      { name: "May", sales: 6000 },
                      { name: "Jun", sales: 5500 },
                    ].map((item) => (
                      <div key={item.name} className="flex flex-col items-center">
                        <div
                          className="w-12 bg-pink-500 rounded-t-md"
                          style={{ height: `${(item.sales / 6000) * 180}px` }}
                        ></div>
                        <div className="mt-2 text-xs">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Sales by Platform</CardTitle>
                <CardDescription>Distribution across marketplaces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex flex-col justify-center items-center">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[
                      { name: "Shopee", value: 35, color: "#EC3B83" },
                      { name: "Tokopedia", value: 30, color: "#7E3F98" },
                      { name: "TikTok Shop", value: 15, color: "#1A9CB0" },
                      { name: "Lazada", value: 12, color: "#40E0D0" },
                      { name: "Blibli", value: 8, color: "#F9D423" },
                    ].map((platform) => (
                      <div key={platform.name} className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: platform.color }}></div>
                        <div className="text-sm">
                          {platform.name}: {platform.value}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 relative w-48 h-48">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-sm font-medium">Sales</div>
                    </div>
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {[
                        { name: "Shopee", value: 35, color: "#EC3B83", startAngle: 0 },
                        { name: "Tokopedia", value: 30, color: "#7E3F98", startAngle: 126 },
                        { name: "TikTok Shop", value: 15, color: "#1A9CB0", startAngle: 234 },
                        { name: "Lazada", value: 12, color: "#40E0D0", startAngle: 288 },
                        { name: "Blibli", value: 8, color: "#F9D423", startAngle: 331.2 },
                      ].map((platform) => {
                        const angle = (platform.value / 100) * 360
                        return (
                          <circle
                            key={platform.name}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke={platform.color}
                            strokeWidth="20"
                            strokeDasharray={`${angle} ${360 - angle}`}
                            strokeDashoffset={-platform.startAngle}
                            transform="rotate(-90 50 50)"
                          />
                        )
                      })}
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics will be displayed here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Analytics content will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generated reports will be displayed here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Reports content will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
