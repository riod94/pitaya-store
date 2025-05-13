"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally handle the form submission
    setFormSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-pink-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
              <p className="text-lg text-gray-600">
                Have questions about our products or services? We're here to help. Reach out to us and we'll get back to
                you as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Our Location</h3>
                <p className="text-gray-600">Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220, Indonesia</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-teal-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
                <p className="text-gray-600">+62 123 4567 890</p>
                <p className="text-gray-600">+62 098 7654 321</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Address</h3>
                <p className="text-gray-600">info@pitaya.com</p>
                <p className="text-gray-600">support@pitaya.com</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                {formSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-4">
                      Your message has been sent successfully. We'll get back to you as soon as possible.
                    </p>
                    <Button
                      onClick={() => setFormSubmitted(false)}
                      className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="Enter your first name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Enter your last name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter your email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input id="phone" placeholder="Enter your phone number" />
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <Label htmlFor="subject">Subject</Label>
                      <Select>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="product">Product Question</SelectItem>
                          <SelectItem value="order">Order Status</SelectItem>
                          <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 mb-6">
                      <Label>How did you hear about us?</Label>
                      <RadioGroup defaultValue="social">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="social" id="social" />
                            <Label htmlFor="social" className="font-normal">
                              Social Media
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="friend" id="friend" />
                            <Label htmlFor="friend" className="font-normal">
                              Friend/Family
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="search" id="search" />
                            <Label htmlFor="search" className="font-normal">
                              Search Engine
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other" className="font-normal">
                              Other
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2 mb-6">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        rows={5}
                        className="resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white w-full"
                    >
                      <Send className="h-4 w-4 mr-2" /> Send Message
                    </Button>
                  </form>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6">Find Us</h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="aspect-video w-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6664672948397!2d106.82496851476908!3d-6.175392395532956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJl.%20Jend.%20Sudirman%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sen!2sid!4v1620120000000!5m2!1sen!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold mb-2">PITAYA Headquarters</h3>
                    <p className="text-gray-600 mb-4">
                      Our main office and retail store is located in the heart of Jakarta's business district. We
                      welcome visitors during our business hours.
                    </p>
                    <div className="flex items-center text-pink-500">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>Get Directions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-600">
                  Find answers to common questions about our products, ordering, and shipping.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question: "How long does shipping take?",
                    answer:
                      "Shipping times vary depending on your location. For Jakarta and surrounding areas, delivery typically takes 1-2 business days. For other regions in Indonesia, it may take 2-5 business days. International shipping is available and typically takes 7-14 business days.",
                  },
                  {
                    question: "Are your products organic?",
                    answer:
                      "Many of our products are certified organic, which is clearly indicated on the product page. We're committed to offering organic options whenever possible, but some products may not have organic certification while still being grown with minimal intervention.",
                  },
                  {
                    question: "Do you offer wholesale pricing?",
                    answer:
                      "Yes, we offer wholesale pricing for businesses. Please contact our wholesale department at wholesale@pitaya.com or fill out the contact form selecting 'Wholesale Inquiry' as the subject for more information.",
                  },
                  {
                    question: "What is your return policy?",
                    answer:
                      "We stand behind the quality of our products. If you're not satisfied with your purchase for any reason, please contact us within 7 days of receiving your order. We'll arrange for a replacement or refund as appropriate.",
                  },
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">
                  Don't see your question here? Contact us and we'll be happy to help.
                </p>
                <Button className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
