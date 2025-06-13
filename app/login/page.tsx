"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Login');
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <Image
                src="/logo-pitaya-transparan.png"
                alt={t('logoAlt')}
                width={180}
                height={50}
                className="h-12 w-auto mx-auto mb-6"
              />
              <h1 className="text-2xl font-bold">{t('welcome')}</h1>
              <p className="text-gray-600 mt-2">{t('desc')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full rounded-none">
                  <TabsTrigger value="login" className="rounded-none py-4">
                    {t('tabLogin')}
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-none py-4">
                    {t('tabRegister')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="p-6">
                  <form>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input id="email" type="email" placeholder={t('emailPlaceholder')} required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">{t('password')}</Label>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-pink-500 hover:text-pink-600 transition-colors"
                          >
                            {t('forgot')}
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('passwordPlaceholder')}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm font-normal">
                          {t('remember')}
                        </Label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white"
                      >
                        {t('signIn')}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">{t('orContinue')}</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path
                              fill="#4285F4"
                              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                            />
                            <path
                              fill="#34A853"
                              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                            />
                            <path
                              fill="#EA4335"
                              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                            />
                          </g>
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      {t('noAccount')} <button
                        type="button"
                        className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
                        onClick={() => setActiveTab("register")}
                      >
                        {t('signUp')}
                      </button>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="p-6">
                  <form>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">{t('fullName')}</Label>
                        <Input id="full-name" placeholder={t('fullNamePlaceholder')} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">{t('registerEmail')}</Label>
                        <Input id="register-email" type="email" placeholder={t('registerEmailPlaceholder')} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">{t('registerPassword')}</Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('registerPasswordPlaceholder')}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          {t('passwordHint')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('confirmPasswordPlaceholder')}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm font-normal">
                          {t('agree')} <Link href="/terms" className="text-pink-500 hover:text-pink-600 transition-colors">{t('terms')}</Link> {t('and')} <Link href="/privacy" className="text-pink-500 hover:text-pink-600 transition-colors">{t('privacy')}</Link>
                        </Label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white"
                      >
                        {t('createAccount')}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">{t('orSignUp')}</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path
                              fill="#4285F4"
                              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                            />
                            <path
                              fill="#34A853"
                              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                            />
                            <path
                              fill="#EA4335"
                              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                            />
                          </g>
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
                        onClick={() => setActiveTab("login")}
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                By signing in or creating an account, you agree to our{" "}
                <Link href="/terms" className="text-pink-500 hover:text-pink-600 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-pink-500 hover:text-pink-600 transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
