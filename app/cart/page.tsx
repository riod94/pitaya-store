import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useTranslations } from 'next-intl';

// Sample cart data
const cartItems = [
  {
    id: 1,
    name: "Pistachio Cangkang",
    price: 64000,
    quantity: 2,
    size: "100g",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Almond Panggang",
    price: 51000,
    quantity: 1,
    size: "250g",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Hazelnut",
    price: 81900,
    quantity: 1,
    size: "250g",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function CartPage() {
  const t = useTranslations('Cart');
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Shipping cost (could be calculated based on location, weight, etc.)
  const shipping = 15000

  // Total
  const total = subtotal + shipping

  return (
    <>
            <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-gray-500 hover:text-pink-500 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">{t('cartItems', {count: cartItems.length})}</h2>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" /> {t('clearCart')}
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">{t('size')}: {item.size}</p>
                              </div>
                              <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border border-gray-200 rounded-full">
                                <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-pink-500">
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-pink-500">
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button className="text-gray-400 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">{t('promoTitle')}</h2>
                    <div className="flex gap-2">
                      <Input placeholder={t('promoPlaceholder')} className="max-w-xs" />
                      <Button variant="outline">{t('apply')}</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">{t('summaryTitle')}</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('subtotal')}</span>
                        <span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('shipping')}</span>
                        <span className="font-medium">Rp {shipping.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('discount')}</span>
                        <span className="font-medium text-green-600">- Rp 0</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">{t('total')}</span>
                        <span className="font-bold text-lg">Rp {total.toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white py-6">
                        {t('checkout')}
                      </Button>
                      <Link href="/#products">
                        <Button variant="outline" className="w-full">
                          {t('continueShopping')}
                        </Button>
                      </Link>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium mb-2">{t('weAccept')}</h3>
                      <div className="flex gap-2">
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('emptyTitle')}</h2>
              <p className="text-gray-600 mb-8">{t('emptyDesc')}</p>
              <Link href="/#products">
                <Button className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white">
                  {t('emptyCta')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
          </>
  )
}
