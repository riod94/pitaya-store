import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('About');
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-pink-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('heroTitle')}</h1>
              <p className="text-lg text-gray-600 mb-8">
                {t('heroDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">{t('storyTitle')}</h2>
                <p className="text-gray-600 mb-4">{t('story1')}</p>
                <p className="text-gray-600 mb-4">{t('story2')}</p>
                <p className="text-gray-600">{t('story3')}</p>
              </div>
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-100 rounded-full blur-xl opacity-70"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-100 rounded-full blur-xl opacity-70"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="PITAYA farm to table"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('valuesTitle')}</h2>
              <p className="text-gray-600">{t('valuesDesc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('value1.title')}</h3>
                <p className="text-gray-600">{t('value1.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('value2.title')}</h3>
                <p className="text-gray-600">{t('value2.desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('value3.title')}</h3>
                <p className="text-gray-600">{t('value3.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('teamTitle')}</h2>
              <p className="text-gray-600">{t('teamDesc')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((idx) => {
                const member = t.raw(`team.${idx}`);
                return (
                  <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="h-64 bg-gray-200">
                      <Image
                        src={`/placeholder.svg?height=300&width=300&text=${member.name}`}
                        alt={member.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-pink-500 mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-pink-500 to-teal-500 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{t('ctaTitle')}</h2>
              <p className="text-lg mb-8 opacity-90">{t('ctaDesc')}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/#products">
                  <Button className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-medium">
                    {t('ctaShop')}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-full text-lg font-medium"
                  >
                    {t('ctaContact')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
