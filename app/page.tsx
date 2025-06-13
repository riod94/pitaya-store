import Hero from "@/components/hero"
import ProductSection from "@/components/product-section"
import CTASection from "@/components/cta-section"
import MarketplaceSection from "@/components/marketplace-section"
import FAQSection from "@/components/faq-section"

export default function Home() {
  return (
    <main className="min-h-screen">
            <Hero />
      <ProductSection />
      <CTASection />
      <MarketplaceSection />
      <FAQSection />
          </main>
  )
}
