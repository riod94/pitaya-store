"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

// Product data based on the price list (simplified version)
const allProducts = [
	{
		id: 1,
		name: "Pistachio Cangkang",
		prices: {
			"100g": 64000,
			"250g": 139200,
			"500g": 276000,
			"1kg": 528000,
		},
		image: "/placeholder.svg?height=80&width=80",
	},
	{
		id: 2,
		name: "Mede Panggang",
		prices: {
			"100g": 27900,
			"250g": 54000,
			"500g": 105300,
			"1kg": 208800,
		},
		image: "/placeholder.svg?height=80&width=80",
	},
	{
		id: 3,
		name: "Almond Panggang",
		prices: {
			"100g": 25500,
			"250g": 51000,
			"500g": 100300,
			"1kg": 193800,
		},
		image: "/placeholder.svg?height=80&width=80",
	},
];

export default function CheckoutPage() {
	const t = useTranslations("Checkout");
	const searchParams = useSearchParams();
	const productId = searchParams.get("productId");
	const [selectedProduct, setSelectedProduct] = useState<any>(null);
	const [quantity, setQuantity] = useState(1);
	const [size, setSize] = useState("100g");
	const [step, setStep] = useState(1);
	const [checkoutType, setCheckoutType] = useState("account"); // "account" or "guest"
	const [orderComplete, setOrderComplete] = useState(false);
	const [orderId, setOrderId] = useState("");

	// Load product if productId is provided
	useEffect(() => {
		if (productId) {
			const product = allProducts.find(
				(p) => p.id === Number.parseInt(productId)
			);
			if (product) {
				setSelectedProduct(product);
			}
		}
	}, [productId]);

	const calculateSubtotal = () => {
		if (!selectedProduct) return 0;
		return selectedProduct.prices[size] * quantity;
	};

	const shipping = 15000;
	const subtotal = calculateSubtotal();
	const total = subtotal + shipping;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (step < 3) {
			setStep(step + 1);
		} else {
			// Generate a random order ID
			const newOrderId = `ORD-${Math.floor(
				100000 + Math.random() * 900000
			)}`;
			setOrderId(newOrderId);
			setOrderComplete(true);
		}
	};

	if (orderComplete) {
		return (
			<>
				<main className="min-h-screen pt-20 pb-16">
					<div className="container mx-auto px-4">
						<div className="max-w-2xl mx-auto">
							<div className="bg-white rounded-xl shadow-sm p-8 text-center">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-8 w-8 text-green-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
								<h1 className="text-2xl font-bold mb-2">
									{t("successTitle")}
								</h1>
								<p className="text-gray-600 mb-6">{t("successDesc")}</p>
								<div className="bg-gray-50 rounded-lg p-4 mb-6">
									<p className="text-sm text-gray-500">
										{t("orderId")}
									</p>
									<p className="font-semibold text-lg">{orderId}</p>
								</div>
								<p className="text-gray-600 mb-6">
									{checkoutType === "guest" ? (
										<>
											{t("guestSuccessDesc")}
											<br />
											<Link
												href="/track-order"
												className="text-pink-500 hover:text-pink-600"
											>
												{t("trackOrderCta")}
											</Link>
										</>
									) : (
										<>
											{t("accountSuccessDesc")}
											<br />
											<Link
												href="/account"
												className="text-pink-500 hover:text-pink-600"
											>
												{t("accountCta")}
											</Link>
										</>
									)}
								</p>
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Link href="/">
										<Button variant="outline">
											{t("continueShopping")}
										</Button>
									</Link>
									{checkoutType === "guest" ? (
										<Link href="/track-order">
											<Button className="bg-pink-500 hover:bg-pink-600">
												{t("trackOrderCta")}
											</Button>
										</Link>
									) : (
										<Link href="/account">
											<Button className="bg-pink-500 hover:bg-pink-600">
												{t("viewOrder")}
											</Button>
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>
				</main>
			</>
		);
	}

	return (
		<>
			<main className="min-h-screen pt-20 pb-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="flex items-center gap-2 mb-8">
						<Link
							href={productId ? `/products/${productId}` : "/cart"}
							className="text-gray-500 hover:text-pink-500"
						>
							<ArrowLeft className="h-5 w-5" />
						</Link>
						<h1 className="text-2xl font-bold">{t("title")}</h1>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Main Content */}
						<div className="lg:col-span-2">
							<div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
								<div className="p-6">
									<div className="flex items-center justify-between mb-6">
										<h2 className="text-lg font-semibold">
											{t("as")}
										</h2>
									</div>

									<Tabs
										defaultValue={checkoutType}
										value={checkoutType}
										onValueChange={setCheckoutType}
										className="w-full"
									>
										<TabsList className="grid w-full grid-cols-2 mb-6">
											<TabsTrigger value="account">
												{t("tabAccount")}
											</TabsTrigger>
											<TabsTrigger value="guest">
												{t("tabGuest")}
											</TabsTrigger>
										</TabsList>
										<TabsContent value="account">
											<div className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="email">
														{t("email")}
													</Label>
													<Input
														id="email"
														type="email"
														placeholder={t("emailPlaceholder")}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="password">
														{t("password")}
													</Label>
													<Input
														id="password"
														type="password"
														placeholder={t("passwordPlaceholder")}
													/>
												</div>
												<Button className="w-full bg-pink-500 hover:bg-pink-600">
													{t("signInContinue")}
												</Button>
												<p className="text-sm text-center text-gray-500">
													{t("noAccount")}{" "}
													<Link
														href="/login"
														className="text-pink-500 hover:text-pink-600"
													>
														{t("createAccount")}
													</Link>
												</p>
											</div>
										</TabsContent>
										<TabsContent value="guest">
											<p className="text-gray-600 mb-4">
												{t("guestDesc")}
											</p>
											<Button
												className="w-full bg-pink-500 hover:bg-pink-600"
												onClick={() => setStep(2)}
											>
												{t("continueGuest")}
											</Button>
										</TabsContent>
									</Tabs>
								</div>
							</div>

							{step >= 2 && (
								<div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
									<div className="p-6">
										<h2 className="text-lg font-semibold mb-6">
											{t("shippingTitle")}
										</h2>
										<form
											onSubmit={handleSubmit}
											className="space-y-4"
										>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="firstName">
														{t("firstName")}
													</Label>
													<Input
														id="firstName"
														placeholder={t(
															"firstNamePlaceholder"
														)}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="lastName">
														{t("lastName")}
													</Label>
													<Input
														id="lastName"
														placeholder={t("lastNamePlaceholder")}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="email">
														{t("email")}
													</Label>
													<Input
														id="email"
														type="email"
														placeholder={t("emailPlaceholder")}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="phone">
														{t("phone")}
													</Label>
													<Input
														id="phone"
														placeholder={t("phonePlaceholder")}
														required
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label htmlFor="address">
													{t("address")}
												</Label>
												<Input
													id="address"
													placeholder={t("addressPlaceholder")}
													required
												/>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												<div className="space-y-2">
													<Label htmlFor="city">{t("city")}</Label>
													<Input
														id="city"
														placeholder={t("cityPlaceholder")}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="province">
														{t("province")}
													</Label>
													<Input
														id="province"
														placeholder={t("provincePlaceholder")}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="postalCode">
														{t("postalCode")}
													</Label>
													<Input
														id="postalCode"
														placeholder={t(
															"postalCodePlaceholder"
														)}
														required
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label htmlFor="notes">{t("notes")}</Label>
												<Textarea
													id="notes"
													placeholder={t("notesPlaceholder")}
													rows={3}
												/>
											</div>

											<div className="flex justify-end">
												<Button
													type="submit"
													className="bg-pink-500 hover:bg-pink-600"
												>
													{t("continuePayment")}
												</Button>
											</div>
										</form>
									</div>
								</div>
							)}

							{step >= 3 && (
								<div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
									<div className="p-6">
										<h2 className="text-lg font-semibold mb-6">
											{t("paymentTitle")}
										</h2>
										<form
											onSubmit={handleSubmit}
											className="space-y-6"
										>
											<RadioGroup defaultValue="bank-transfer">
												<div className="space-y-4">
													<div className="flex items-center justify-between border rounded-lg p-4">
														<div className="flex items-center gap-4">
															<RadioGroupItem
																value="bank-transfer"
																id="bank-transfer"
															/>
															<Label
																htmlFor="bank-transfer"
																className="flex items-center gap-2 cursor-pointer"
															>
																<div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="h-6 w-6 text-blue-600"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke="currentColor"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth={2}
																			d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
																		/>
																	</svg>
																</div>
																<div>
																	<p className="font-medium">
																		{t("bankTransfer")}
																	</p>
																	<p className="text-sm text-gray-500">
																		{t("bankTransferDesc")}
																	</p>
																</div>
															</Label>
														</div>
													</div>

													<div className="flex items-center justify-between border rounded-lg p-4">
														<div className="flex items-center gap-4">
															<RadioGroupItem
																value="e-wallet"
																id="e-wallet"
															/>
															<Label
																htmlFor="e-wallet"
																className="flex items-center gap-2 cursor-pointer"
															>
																<div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="h-6 w-6 text-green-600"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke="currentColor"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth={2}
																			d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
																		/>
																	</svg>
																</div>
																<div>
																	<p className="font-medium">
																		{t("eWallet")}
																	</p>
																	<p className="text-sm text-gray-500">
																		{t("eWalletDesc")}
																	</p>
																</div>
															</Label>
														</div>
													</div>

													<div className="flex items-center justify-between border rounded-lg p-4">
														<div className="flex items-center gap-4">
															<RadioGroupItem
																value="credit-card"
																id="credit-card"
															/>
															<Label
																htmlFor="credit-card"
																className="flex items-center gap-2 cursor-pointer"
															>
																<div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center">
																	<CreditCard className="h-6 w-6 text-purple-600" />
																</div>
																<div>
																	<p className="font-medium">
																		{t("creditCard")}
																	</p>
																	<p className="text-sm text-gray-500">
																		{t("creditCardDesc")}
																	</p>
																</div>
															</Label>
														</div>
													</div>
												</div>
											</RadioGroup>

											<div className="flex items-center space-x-2">
												<Checkbox id="terms" required />
												<Label htmlFor="terms" className="text-sm">
													{t("agree")}{" "}
													<Link
														href="/terms"
														className="text-pink-500 hover:text-pink-600"
													>
														{t("terms")}
													</Link>{" "}
													{t("and")}{" "}
													<Link
														href="/privacy"
														className="text-pink-500 hover:text-pink-600"
													>
														{t("privacy")}
													</Link>
												</Label>
											</div>

											<div className="flex justify-end">
												<Button
													type="submit"
													className="bg-pink-500 hover:bg-pink-600"
												>
													{t("placeOrder")}
												</Button>
											</div>
										</form>
									</div>
								</div>
							)}
						</div>

						{/* Order Summary */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
								<div className="p-6">
									<h2 className="text-lg font-semibold mb-4">
										{t("summaryTitle")}
									</h2>

									{selectedProduct ? (
										<div className="mb-6">
											<div className="flex gap-4 mb-4">
												<div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
													<Image
														src={
															selectedProduct.image ||
															"/placeholder.svg"
														}
														alt={selectedProduct.name}
														width={80}
														height={80}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="flex-1">
													<h3 className="font-medium">
														{selectedProduct.name}
													</h3>
													<div className="flex justify-between mt-1">
														<div>
															<p className="text-sm text-gray-500">
																Size: {size}
															</p>
															<p className="text-sm text-gray-500">
																Quantity: {quantity}
															</p>
														</div>
														<p className="font-semibold">
															Rp{" "}
															{selectedProduct.prices[
																size
															].toLocaleString("id-ID")}
														</p>
													</div>
												</div>
											</div>

											<div className="flex gap-2 mb-4">
												<Button
													variant="outline"
													className="flex-1"
													onClick={() => setSize("100g")}
													disabled={size === "100g"}
												>
													100g
												</Button>
												<Button
													variant="outline"
													className="flex-1"
													onClick={() => setSize("250g")}
													disabled={size === "250g"}
												>
													250g
												</Button>
												<Button
													variant="outline"
													className="flex-1"
													onClick={() => setSize("500g")}
													disabled={size === "500g"}
												>
													500g
												</Button>
												<Button
													variant="outline"
													className="flex-1"
													onClick={() => setSize("1kg")}
													disabled={size === "1kg"}
												>
													1kg
												</Button>
											</div>

											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center border border-gray-200 rounded-full">
													<button
														className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-pink-500"
														onClick={() =>
															quantity > 1 &&
															setQuantity(quantity - 1)
														}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M20 12H4"
															/>
														</svg>
													</button>
													<span className="w-8 text-center">
														{quantity}
													</span>
													<button
														className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-pink-500"
														onClick={() =>
															setQuantity(quantity + 1)
														}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 6v6m0 0v6m0-6h6m-6 0H6"
															/>
														</svg>
													</button>
												</div>
												<p className="font-semibold">
													Rp{" "}
													{(
														selectedProduct.prices[size] *
														quantity
													).toLocaleString("id-ID")}
												</p>
											</div>
										</div>
									) : (
										<div className="flex items-center justify-center py-8 mb-6">
											<div className="text-center">
												<ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
												<p className="text-gray-500">
													{t("noItems")}
												</p>
											</div>
										</div>
									)}

									<Separator className="my-4" />

									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-gray-600">
												{t("subtotal")}
											</span>
											<span className="font-medium">
												Rp {subtotal.toLocaleString("id-ID")}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">
												{t("shipping")}
											</span>
											<span className="font-medium">
												Rp {shipping.toLocaleString("id-ID")}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">
												{t("discount")}
											</span>
											<span className="font-medium text-green-600">
												- Rp 0
											</span>
										</div>
										<Separator />
										<div className="flex justify-between">
											<span className="font-semibold">
												{t("total")}
											</span>
											<span className="font-bold text-lg">
												Rp {total.toLocaleString("id-ID")}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
