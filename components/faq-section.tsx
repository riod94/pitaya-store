"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { useTranslations } from 'next-intl'


export default function FAQSection() {
  const t = useTranslations('FAQSection');
  const faqList = [1,2,3,4,5,6];
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t('title')}</h2>
          <p className="text-gray-600">{t('desc')}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqList.map((i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:text-pink-500">
                    {t(`faq.${i}.question`)}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">{t(`faq.${i}.answer`)}</AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">{t('cta')}</p>
          <div className="inline-flex gap-4">
            <a
              href="/contact"
              className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white px-6 py-3 rounded-full inline-block font-medium"
            >
              {t('contactUs')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
