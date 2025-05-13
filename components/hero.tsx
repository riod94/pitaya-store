import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-100 rounded-full blur-xl opacity-70"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-100 rounded-full blur-xl opacity-70"></div>
              <div className="relative">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  Premium Quality{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-teal-500">
                    Nuts & Seeds
                  </span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg">
                  Discover our selection of fresh, high-quality nuts and seeds. Perfect for healthy snacking, cooking,
                  or gifting to loved ones.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white px-6 py-2 rounded-full text-base font-medium">
                    Shop Now
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-pink-500 hover:text-pink-500 px-6 py-2 rounded-full text-base font-medium"
                  >
                    Learn More
                  </Button>
                </div>

                <div className="flex items-center mt-12 space-x-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                        <Image
                          src={`/placeholder.svg?height=40&width=40`}
                          alt="Customer"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Trusted by 500+ customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-100 rounded-full blur-xl opacity-70"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-100 rounded-full blur-xl opacity-70"></div>

              <div className="relative bg-white p-4 rounded-3xl shadow-xl overflow-hidden">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Premium nuts and seeds"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <p className="text-sm font-medium text-pink-500 mb-1">Premium Selection</p>
                    <h3 className="text-xl font-bold text-gray-800">Freshly Sourced Ingredients</h3>
                  </div>
                </div>

                <div className="absolute top-8 right-8">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-pink-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 transform rotate-6">
                <div className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm font-bold">100% Natural</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
