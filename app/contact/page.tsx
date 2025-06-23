"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
	const [formSubmitted, setFormSubmitted] = useState(false);
	const t = useTranslations("Contact");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would normally handle the form submission
		setFormSubmitted(true);
	};

	return (
		<>
			<main className="min-h-screen pt-20 pb-16">
				{/* Hero Section */}
				<section className="bg-gradient-to-b from-pink-50 to-white py-16">
					<div className="container mx-auto px-4">
						<div className="max-w-3xl mx-auto text-center">
							<h1 className="text-4xl md:text-5xl font-bold mb-6">
								{t("heroTitle")}
							</h1>
							<p className="text-lg text-gray-600">{t("heroDesc")}</p>
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
								<h3 className="text-lg font-semibold mb-2">
									{t("locationTitle")}
								</h3>
								<p className="text-gray-600">{t("locationAddress")}</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm text-center">
								<div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Phone className="h-6 w-6 text-teal-500" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									{t("phoneTitle")}
								</h3>
								<p className="text-gray-600">{t("phone1")}</p>
								<p className="text-gray-600">{t("phone2")}</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm text-center">
								<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Mail className="h-6 w-6 text-purple-500" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									{t("emailTitle")}
								</h3>
								<p className="text-gray-600">{t("email1")}</p>
								<p className="text-gray-600">{t("email2")}</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm text-center">
								<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Clock className="h-6 w-6 text-yellow-500" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									{t("hoursTitle")}
								</h3>
								<p className="text-gray-600">{t("hours1")}</p>
								<p className="text-gray-600">{t("hours2")}</p>
							</div>
						</div>
					</div>
				</section>

				{/* Contact Form and Map */}
				<section className="py-16 bg-gray-50">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
							<div>
								<h2 className="text-3xl font-bold mb-6">
									{t("formTitle")}
								</h2>
								{formSubmitted ? (
									<div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
										<CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
										<h3 className="text-xl font-semibold mb-2">
											{t("successTitle")}
										</h3>
										<p className="text-gray-600 mb-4">
											{t("successDesc")}
										</p>
										<Button
											onClick={() => setFormSubmitted(false)}
											className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white"
										>
											{t("successCta")}
										</Button>
									</div>
								) : (
									<form
										onSubmit={handleSubmit}
										className="bg-white rounded-xl shadow-sm p-6"
									>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
											<div className="space-y-2">
												<Label htmlFor="first-name">
													{t("firstName")}
												</Label>
												<Input
													id="first-name"
													placeholder={t("firstNamePlaceholder")}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="last-name">
													{t("lastName")}
												</Label>
												<Input
													id="last-name"
													placeholder={t("lastNamePlaceholder")}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="email">{t("email")}</Label>
												<Input
													id="email"
													type="email"
													placeholder={t("emailPlaceholder")}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="phone">{t("phone")}</Label>
												<Input
													id="phone"
													placeholder={t("phonePlaceholder")}
												/>
											</div>
										</div>

										<div className="space-y-2 mb-6">
											<Label htmlFor="subject">{t("subject")}</Label>
											<Select>
												<SelectTrigger id="subject">
													<SelectValue
														placeholder={t("subjectPlaceholder")}
													/>
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="general">
														{t("subjectGeneral")}
													</SelectItem>
													<SelectItem value="product">
														{t("subjectProduct")}
													</SelectItem>
													<SelectItem value="order">
														{t("subjectOrder")}
													</SelectItem>
													<SelectItem value="wholesale">
														{t("subjectWholesale")}
													</SelectItem>
													<SelectItem value="feedback">
														{t("subjectFeedback")}
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2 mb-6">
											<Label>{t("howHear")}</Label>
											<RadioGroup defaultValue="social">
												<div className="flex flex-wrap gap-4">
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="social"
															id="social"
														/>
														<Label
															htmlFor="social"
															className="font-normal"
														>
															{t("hearSocial")}
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="friend"
															id="friend"
														/>
														<Label
															htmlFor="friend"
															className="font-normal"
														>
															{t("hearFriend")}
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="search"
															id="search"
														/>
														<Label
															htmlFor="search"
															className="font-normal"
														>
															{t("hearSearch")}
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="other"
															id="other"
														/>
														<Label
															htmlFor="other"
															className="font-normal"
														>
															{t("hearOther")}
														</Label>
													</div>
												</div>
											</RadioGroup>
										</div>

										<div className="space-y-2 mb-6">
											<Label htmlFor="message">{t("message")}</Label>
											<Textarea
												id="message"
												placeholder={t("messagePlaceholder")}
												rows={5}
												className="resize-none"
												required
											/>
										</div>

										<Button
											type="submit"
											className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white w-full"
										>
											<Send className="h-4 w-4 mr-2" />{" "}
											{t("sendMessage")}
										</Button>
									</form>
								)}
							</div>

							<div>
								<h2 className="text-3xl font-bold mb-6">
									{t("findUsTitle")}
								</h2>
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
										<h3 className="font-semibold mb-2">
											{t("hqTitle")}
										</h3>
										<p className="text-gray-600 mb-4">
											{t("hqDesc")}
										</p>
										<div className="flex items-center text-pink-500">
											<MapPin className="h-5 w-5 mr-2" />
											<span>{t("getDirections")}</span>
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
								<h2 className="text-3xl font-bold mb-4">
									{t("faqTitle")}
								</h2>
								<p className="text-gray-600">{t("faqDesc")}</p>
							</div>

							<div className="space-y-6">
								{[1, 2, 3, 4].map((idx) => {
									const faq = t.raw(`faq.${idx}`);
									return (
										<div
											key={idx}
											className="bg-white rounded-xl shadow-sm overflow-hidden"
										>
											<div className="p-6">
												<h3 className="text-lg font-semibold mb-2">
													{faq.question}
												</h3>
												<p className="text-gray-600">
													{faq.answer}
												</p>
											</div>
										</div>
									);
								})}
							</div>

							<div className="text-center mt-8">
								<p className="text-gray-600 mb-4">{t("faqMore")}</p>
								<Button className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white">
									{t("faqCta")}
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
