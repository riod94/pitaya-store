import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"

// Sample content data
const heroContent = {
  title: "Premium Quality Nuts & Seeds",
  subtitle:
    "Discover our selection of fresh, high-quality nuts and seeds. Perfect for healthy snacking, cooking, or gifting to loved ones.",
  image: "/placeholder.svg?height=200&width=300",
}

const banners = [
  {
    id: "1",
    title: "Summer Sale",
    description: "Get 20% off on all products",
    image: "/placeholder.svg?height=100&width=300",
    active: true,
  },
  {
    id: "2",
    title: "New Arrivals",
    description: "Check out our new products",
    image: "/placeholder.svg?height=100&width=300",
    active: false,
  },
]

const testimonials = [
  {
    id: "1",
    name: "John Doe",
    role: "Regular Customer",
    content: "The quality of nuts from PITAYA is exceptional. I've been a regular customer for over a year now.",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Health Enthusiast",
    content: "I love the variety of seeds available. They're perfect for my morning smoothies and salads.",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">Manage your website content and marketing materials.</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Edit your homepage hero section content.</CardDescription>
              </div>
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Edit className="mr-2 h-4 w-4" /> Edit Hero
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Content</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Title</p>
                      <p className="text-base">{heroContent.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Subtitle</p>
                      <p className="text-base">{heroContent.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hero Image</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Image
                      src={heroContent.image || "/placeholder.svg"}
                      alt="Hero Image"
                      width={300}
                      height={200}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Promotional Banners</h2>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="mr-2 h-4 w-4" /> Add Banner
            </Button>
          </div>

          <div className="grid gap-6">
            {banners.map((banner) => (
              <Card key={banner.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <Image
                        src={banner.image || "/placeholder.svg"}
                        alt={banner.title}
                        width={300}
                        height={100}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold">{banner.title}</h3>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              banner.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {banner.active ? "Active" : "Inactive"}
                          </div>
                        </div>
                        <p className="text-gray-600">{banner.description}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Customer Testimonials</h2>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="mr-2 h-4 w-4" /> Add Testimonial
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{testimonial.role}</p>
                      <p className="text-gray-600">{testimonial.content}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
