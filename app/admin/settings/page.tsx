import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Plus } from "lucide-react";

export default function SettingsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your store settings and preferences.
				</p>
			</div>

			<Tabs defaultValue="general" className="space-y-6">
				<TabsList>
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="appearance">Appearance</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="shipping">Shipping</TabsTrigger>
					<TabsTrigger value="payment">Payment</TabsTrigger>
				</TabsList>

				<TabsContent value="general">
					<Card>
						<CardHeader>
							<CardTitle>General Settings</CardTitle>
							<CardDescription>
								Manage your store information and contact details.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-lg font-medium">
									Store Information
								</h3>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="store-name">Store Name</Label>
										<Input id="store-name" defaultValue="PITAYA" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="store-email">Email Address</Label>
										<Input
											id="store-email"
											type="email"
											defaultValue="info@pitaya.com"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="store-phone">Phone Number</Label>
										<Input
											id="store-phone"
											defaultValue="+62 123 4567 890"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="store-currency">Currency</Label>
										<Select defaultValue="idr">
											<SelectTrigger id="store-currency">
												<SelectValue placeholder="Select currency" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="idr">
													Indonesian Rupiah (IDR)
												</SelectItem>
												<SelectItem value="usd">
													US Dollar (USD)
												</SelectItem>
												<SelectItem value="eur">
													Euro (EUR)
												</SelectItem>
												<SelectItem value="sgd">
													Singapore Dollar (SGD)
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-medium">Address</h3>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2 md:col-span-2">
										<Label htmlFor="address-line1">
											Address Line 1
										</Label>
										<Input
											id="address-line1"
											defaultValue="Jl. Sudirman No. 123"
										/>
									</div>
									<div className="space-y-2 md:col-span-2">
										<Label htmlFor="address-line2">
											Address Line 2 (Optional)
										</Label>
										<Input
											id="address-line2"
											defaultValue="Karet Tengsin"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="city">City</Label>
										<Input id="city" defaultValue="Jakarta" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="province">Province</Label>
										<Input id="province" defaultValue="DKI Jakarta" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="postal-code">Postal Code</Label>
										<Input id="postal-code" defaultValue="10220" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="country">Country</Label>
										<Select defaultValue="id">
											<SelectTrigger id="country">
												<SelectValue placeholder="Select country" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="id">
													Indonesia
												</SelectItem>
												<SelectItem value="sg">
													Singapore
												</SelectItem>
												<SelectItem value="my">Malaysia</SelectItem>
												<SelectItem value="th">Thailand</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-medium">Business Hours</h3>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="weekday-hours">
											Weekday Hours
										</Label>
										<Input
											id="weekday-hours"
											defaultValue="09:00 - 18:00"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="weekend-hours">
											Weekend Hours
										</Label>
										<Input
											id="weekend-hours"
											defaultValue="10:00 - 16:00"
										/>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Switch id="closed-holidays" />
									<Label htmlFor="closed-holidays">
										Closed on public holidays
									</Label>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button className="bg-pink-500 hover:bg-pink-600">
								<Save className="mr-2 h-4 w-4" /> Save Changes
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="appearance">
					<Card>
						<CardHeader>
							<CardTitle>Appearance Settings</CardTitle>
							<CardDescription>
								Customize how your store looks to customers.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-lg font-medium">Theme</h3>
								<div className="grid grid-cols-3 gap-4">
									<div className="border-2 border-pink-500 rounded-lg p-4 text-center cursor-pointer">
										<div className="h-20 bg-gradient-to-r from-pink-500 to-teal-500 rounded-md mb-2"></div>
										<p className="font-medium">Default</p>
									</div>
									<div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer">
										<div className="h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-md mb-2"></div>
										<p className="font-medium">Purple</p>
									</div>
									<div className="border border-gray-200 rounded-lg p-4 text-center cursor-pointer">
										<div className="h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-md mb-2"></div>
										<p className="font-medium">Autumn</p>
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-medium">Logo</h3>
								<div className="flex items-center gap-4">
									<div className="w-24 h-24 border border-gray-200 rounded-lg flex items-center justify-center">
										<img
											src="/logo-pitaya-transparan.png"
											alt="Logo"
											className="max-w-full max-h-full p-2"
										/>
									</div>
									<Button variant="outline">Change Logo</Button>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-medium">Homepage Layout</h3>
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<Switch id="show-hero" defaultChecked />
										<Label htmlFor="show-hero">
											Show hero section
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Switch id="show-featured" defaultChecked />
										<Label htmlFor="show-featured">
											Show featured products
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Switch id="show-categories" defaultChecked />
										<Label htmlFor="show-categories">
											Show product categories
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Switch id="show-testimonials" defaultChecked />
										<Label htmlFor="show-testimonials">
											Show testimonials
										</Label>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button className="bg-pink-500 hover:bg-pink-600">
								<Save className="mr-2 h-4 w-4" /> Save Changes
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="notifications">
					<Card>
						<CardHeader>
							<CardTitle>Notification Settings</CardTitle>
							<CardDescription>
								Configure how you receive notifications about your
								store.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-lg font-medium">
									Email Notifications
								</h3>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<div>
											<Label
												htmlFor="new-order"
												className="block mb-1"
											>
												New Order
											</Label>
											<p className="text-sm text-muted-foreground">
												Receive an email when a new order is placed
											</p>
										</div>
										<Switch id="new-order" defaultChecked />
									</div>
									<Separator />
									<div className="flex items-center justify-between">
										<div>
											<Label
												htmlFor="order-status"
												className="block mb-1"
											>
												Order Status Updates
											</Label>
											<p className="text-sm text-muted-foreground">
												Receive emails when order status changes
											</p>
										</div>
										<Switch id="order-status" defaultChecked />
									</div>
									<Separator />
									<div className="flex items-center justify-between">
										<div>
											<Label
												htmlFor="low-stock"
												className="block mb-1"
											>
												Low Stock Alerts
											</Label>
											<p className="text-sm text-muted-foreground">
												Get notified when products are running low
											</p>
										</div>
										<Switch id="low-stock" defaultChecked />
									</div>
									<Separator />
									<div className="flex items-center justify-between">
										<div>
											<Label
												htmlFor="customer-messages"
												className="block mb-1"
											>
												Customer Messages
											</Label>
											<p className="text-sm text-muted-foreground">
												Receive emails for new customer inquiries
											</p>
										</div>
										<Switch id="customer-messages" defaultChecked />
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-medium">
									Additional Recipients
								</h3>
								<div className="space-y-2">
									<Label htmlFor="additional-emails">
										Additional Email Addresses
									</Label>
									<Textarea
										id="additional-emails"
										placeholder="Enter email addresses separated by commas"
										className="min-h-[100px]"
									/>
									<p className="text-sm text-muted-foreground">
										These email addresses will also receive the
										notifications you've enabled above
									</p>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button className="bg-pink-500 hover:bg-pink-600">
								<Save className="mr-2 h-4 w-4" /> Save Changes
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="shipping">
					<Card>
						<CardHeader>
							<CardTitle>Shipping Settings</CardTitle>
							<CardDescription>
								Configure shipping options and delivery methods.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								<div className="space-y-4">
									<h3 className="text-lg font-medium">
										Shipping Methods
									</h3>
									<div className="space-y-4">
										<div className="flex items-center space-x-2">
											<Switch id="jne" defaultChecked />
											<Label htmlFor="jne">JNE</Label>
										</div>
										<div className="flex items-center space-x-2">
											<Switch id="j&t" defaultChecked />
											<Label htmlFor="j&t">J&T Express</Label>
										</div>
										<div className="flex items-center space-x-2">
											<Switch id="sicepat" defaultChecked />
											<Label htmlFor="sicepat">SiCepat</Label>
										</div>
										<div className="flex items-center space-x-2">
											<Switch id="pos" />
											<Label htmlFor="pos">POS Indonesia</Label>
										</div>
										<div className="flex items-center space-x-2">
											<Switch id="gosend" defaultChecked />
											<Label htmlFor="gosend">GoSend</Label>
										</div>
									</div>
								</div>

								<Separator />

								<div className="space-y-4">
									<h3 className="text-lg font-medium">
										Free Shipping
									</h3>
									<div className="flex items-center space-x-2">
										<Switch
											id="enable-free-shipping"
											defaultChecked
										/>
										<Label htmlFor="enable-free-shipping">
											Enable free shipping for orders above threshold
										</Label>
									</div>
									<div className="space-y-2">
										<Label htmlFor="free-shipping-threshold">
											Minimum Order Amount for Free Shipping (Rp)
										</Label>
										<Input
											id="free-shipping-threshold"
											type="number"
											defaultValue="500000"
										/>
									</div>
								</div>

								<Separator />

								<div className="space-y-4">
									<h3 className="text-lg font-medium">
										Shipping Zones
									</h3>
									<div className="space-y-2">
										<div className="flex items-center justify-between p-4 border rounded-lg">
											<div>
												<h4 className="font-medium">
													Jakarta & Surrounding Areas
												</h4>
												<p className="text-sm text-muted-foreground">
													Jakarta, Bogor, Depok, Tangerang, Bekasi
												</p>
											</div>
											<Button variant="outline" size="sm">
												Edit
											</Button>
										</div>
										<div className="flex items-center justify-between p-4 border rounded-lg">
											<div>
												<h4 className="font-medium">Java</h4>
												<p className="text-sm text-muted-foreground">
													West Java, Central Java, East Java,
													Yogyakarta
												</p>
											</div>
											<Button variant="outline" size="sm">
												Edit
											</Button>
										</div>
										<div className="flex items-center justify-between p-4 border rounded-lg">
											<div>
												<h4 className="font-medium">
													Other Islands
												</h4>
												<p className="text-sm text-muted-foreground">
													Sumatra, Kalimantan, Sulawesi, Bali, etc.
												</p>
											</div>
											<Button variant="outline" size="sm">
												Edit
											</Button>
										</div>
										<Button variant="outline" className="w-full mt-2">
											<Plus className="mr-2 h-4 w-4" /> Add Shipping
											Zone
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button className="bg-pink-500 hover:bg-pink-600">
								<Save className="mr-2 h-4 w-4" /> Save Changes
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="payment">
					<Card>
						<CardHeader>
							<CardTitle>Payment Settings</CardTitle>
							<CardDescription>
								Configure payment methods and options.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-lg font-medium">Payment Methods</h3>
								<div className="space-y-4">
									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div className="flex items-center gap-4">
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
												<h4 className="font-medium">
													Bank Transfer
												</h4>
												<p className="text-sm text-muted-foreground">
													Manual verification
												</p>
											</div>
										</div>
										<Switch id="bank-transfer" defaultChecked />
									</div>

									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div className="flex items-center gap-4">
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
												<h4 className="font-medium">E-Wallet</h4>
												<p className="text-sm text-muted-foreground">
													GoPay, OVO, DANA, LinkAja
												</p>
											</div>
										</div>
										<Switch id="e-wallet" defaultChecked />
									</div>

									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 bg-yellow-100 rounded-md flex items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6 text-yellow-600"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
													/>
												</svg>
											</div>
											<div>
												<h4 className="font-medium">
													Cash on Delivery
												</h4>
												<p className="text-sm text-muted-foreground">
													Pay when you receive
												</p>
											</div>
										</div>
										<Switch id="cod" />
									</div>

									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6 text-purple-600"
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
												<h4 className="font-medium">
													Credit/Debit Card
												</h4>
												<p className="text-sm text-muted-foreground">
													Visa, Mastercard, JCB
												</p>
											</div>
										</div>
										<Switch id="card" defaultChecked />
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="text-lg font-medium">
									Bank Account Details
								</h3>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="bank-name">Bank Name</Label>
										<Input
											id="bank-name"
											defaultValue="Bank Central Asia (BCA)"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="account-number">
											Account Number
										</Label>
										<Input
											id="account-number"
											defaultValue="1234567890"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="account-name">
											Account Holder Name
										</Label>
										<Input
											id="account-name"
											defaultValue="PT PITAYA INDONESIA"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="branch">Branch</Label>
										<Input
											id="branch"
											defaultValue="Jakarta Sudirman"
										/>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button className="bg-pink-500 hover:bg-pink-600">
								<Save className="mr-2 h-4 w-4" /> Save Changes
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
