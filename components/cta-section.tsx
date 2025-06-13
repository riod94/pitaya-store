import { Button } from "@/components/ui/button"

import { useTranslations } from 'next-intl'

export default function CTASection() {
  const t = useTranslations('CTASection');
  return (
    <section className="py-16 bg-gradient-to-r from-pink-500 to-teal-500 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('title')}</h2>
          <p className="text-lg mb-8 opacity-90">
            {t('desc')}
          </p>
          <Button className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-medium flex items-center gap-2 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-message-circle"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            {t('chatWhatsapp')}
          </Button>
          <p className="mt-4 text-sm opacity-80">{t('responseTime')}</p>
        </div>
      </div>
    </section>
  )
}
