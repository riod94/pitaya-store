import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Notification Preferences</CardTitle>
					<CardDescription>
						Manage how you receive notifications
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="email">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="email">Email</TabsTrigger>
							<TabsTrigger value="sms">SMS</TabsTrigger>
						</TabsList>
						<TabsContent value="email" className="space-y-4 pt-4">
							<div className="flex items-center justify-between py-2">
								<div>
									<p className="font-medium">Order Updates</p>
									<p className="text-sm text-gray-500">
										Receive updates about your orders
									</p>
								</div>
								<div className="flex items-center h-5">
									<input
										id="order-updates-email"
										type="checkbox"
										className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
										defaultChecked
									/>
								</div>
							</div>
							<div className="flex items-center justify-between py-2">
								<div>
									<p className="font-medium">Promotions</p>
									<p className="text-sm text-gray-500">
										Receive promotions and discounts
									</p>
								</div>
								<div className="flex items-center h-5">
									<input
										id="promotions-email"
										type="checkbox"
										className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
										defaultChecked
									/>
								</div>
							</div>
							<div className="flex items-center justify-between py-2">
								<div>
									<p className="font-medium">Product Updates</p>
									<p className="text-sm text-gray-500">
										Receive updates about new products
									</p>
								</div>
								<div className="flex items-center h-5">
									<input
										id="product-updates-email"
										type="checkbox"
										className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
									/>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="sms" className="space-y-4 pt-4">
							<div className="flex items-center justify-between py-2">
								<div>
									<p className="font-medium">Order Updates</p>
									<p className="text-sm text-gray-500">
										Receive updates about your orders
									</p>
								</div>
								<div className="flex items-center h-5">
									<input
										id="order-updates-sms"
										type="checkbox"
										className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
										defaultChecked
									/>
								</div>
							</div>
							<div className="flex items-center justify-between py-2">
								<div>
									<p className="font-medium">Promotions</p>
									<p className="text-sm text-gray-500">
										Receive promotions and discounts
									</p>
								</div>
								<div className="flex items-center h-5">
									<input
										id="promotions-sms"
										type="checkbox"
										className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
									/>
								</div>
							</div>
							<div className="flex items-center justify-between py-2">
								<div>
									<p className="font-medium">Product Updates</p>
									<p className="text-sm text-gray-500">
										Receive updates about new products
									</p>
								</div>
								<div className="flex items-center h-5">
									<input
										id="product-updates-sms"
										type="checkbox"
										className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
									/>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
				<CardFooter>
					<Button className="bg-pink-500 hover:bg-pink-600">
						Save Preferences
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
