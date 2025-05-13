"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddToCartProps {
  productId: number
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  fullWidth?: boolean
}

export function AddToCart({
  productId,
  variant = "default",
  size = "default",
  className = "",
  showIcon = true,
  fullWidth = false,
}: AddToCartProps) {
  const [isAdded, setIsAdded] = useState(false)
  const router = useRouter()

  const handleAddToCart = () => {
    // Here you would normally add the product to the cart
    // For now, we'll just show a success state
    setIsAdded(true)

    // Reset after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const handleBuyNow = () => {
    router.push(`/checkout?productId=${productId}`)
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${fullWidth ? "w-full" : ""}`}
      onClick={handleAddToCart}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check className={`${showIcon ? "mr-2 h-4 w-4" : "h-4 w-4"}`} />
          Added
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="mr-2 h-4 w-4" />}
          Add to Cart
        </>
      )}
    </Button>
  )
}

export function BuyNow({
  productId,
  variant = "secondary",
  size = "default",
  className = "",
  fullWidth = false,
}: Omit<AddToCartProps, "showIcon">) {
  const router = useRouter()

  const handleBuyNow = () => {
    router.push(`/checkout?productId=${productId}`)
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${fullWidth ? "w-full" : ""}`}
      onClick={handleBuyNow}
    >
      Buy Now
    </Button>
  )
}
