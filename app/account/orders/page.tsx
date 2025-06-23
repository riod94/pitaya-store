"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { useState } from "react";

const addresses = [
	{
		id: 1,
		name: "Home",
		recipient: "John Doe",
		street: "Jl. Sudirman No. 123",
		city: "Jakarta Pusat",
		province: "DKI Jakarta",
		postalCode: "10220",
		phone: "+62 812 3456 7890",
		isDefault: true,
	},
	{
		id: 2,
		name: "Office",
		recipient: "John Doe",
		street: "Jl. Gatot Subroto No. 456",
		city: "Jakarta Selatan",
		province: "DKI Jakarta",
		postalCode: "12930",
		phone: "+62 812 3456 7890",
		isDefault: false,
	},
];

const orders = [
	{
		id: "ORD-001",
		date: "2023-05-10",
		total: "256.000",
		status: "Completed",
		items: [
			{
				name: "Pistachio Cangkang",
				size: "100g",
				quantity: 2,
				price: "64.000",
			},
			{
				name: "Almond Panggang",
				size: "250g",
				quantity: 1,
				price: "51.000",
			},
		],
	},
	{
		id: "ORD-002",
		date: "2023-05-20",
		total: "128.400",
		status: "Processing",
		items: [
			{
				name: "Mede Panggang",
				size: "250g",
				quantity: 1,
				price: "54.000",
			},
			{
				name: "Cranberry",
				size: "100g",
				quantity: 1,
				price: "18.300",
			},
		],
	},
	{
		id: "ORD-003",
		date: "2023-06-05",
		total: "352.600",
		status: "Shipped",
		items: [
			{
				name: "Hazelnut",
				size: "250g",
				quantity: 1,
				price: "81.900",
			},
			{
				name: "Walnut Panggang",
				size: "500g",
				quantity: 1,
				price: "102.900",
			},
		],
	},
];

export default function OrderPage() {
	const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

	return (
		<div className="space-y-6">
			{!selectedOrder ? (
				<Card>
					<CardHeader>
						<CardTitle>My Orders</CardTitle>
						<CardDescription>View and track your orders</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{orders.map((order) => (
								<div
									key={order.id}
									className="border border-gray-200 rounded-lg p-4 hover:border-pink-500 transition-colors cursor-pointer"
									onClick={() => setSelectedOrder(order.id)}
								>
									<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
										<div>
											<div className="flex items-center gap-2 mb-2">
												<span className="font-medium">
													{order.id}
												</span>
												<span className="text-gray-500">•</span>
												<span className="text-gray-500">
													{order.date}
												</span>
											</div>
											<p className="text-sm text-gray-500">
												{order.items
													.map((item) => item.name)
													.join(", ")}
											</p>
										</div>
										<div className="flex items-center gap-4">
											<div className="text-right">
												<p className="font-semibold">
													Rp {order.total}
												</p>
												<Badge
													className={`${
														order.status === "Completed"
															? "bg-green-100 text-green-800 hover:bg-green-100"
															: order.status === "Processing"
															? "bg-blue-100 text-blue-800 hover:bg-blue-100"
															: "bg-purple-100 text-purple-800 hover:bg-purple-100"
													}`}
												>
													{order.status}
												</Badge>
											</div>
											<Button variant="ghost" size="icon" className="rounded-full">
												<ArrowLeft className="h-4 w-4 rotate-180" />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			) : (
				selectedOrder && (
					<div className="space-y-6">
						<Card>
							<CardHeader className="flex flex-row items-center">
								<Button
									variant="ghost"
									size="icon"
									className="mr-2"
									onClick={() => setSelectedOrder(null)}
								>
									<ArrowLeft className="h-4 w-4" />
								</Button>
								<div>
									<CardTitle>Order Details</CardTitle>
									<CardDescription>
										{orders.find((o) => o.id === selectedOrder)?.id} •{" "}
										{orders.find((o) => o.id === selectedOrder)?.date}
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									<div className="flex justify-between items-center pb-4 border-b border-gray-100">
										<Badge
											className={`${
												orders.find((o) => o.id === selectedOrder)
													?.status === "Completed"
													? "bg-green-100 text-green-800 hover:bg-green-100"
													: orders.find(
															(o) => o.id === selectedOrder
													  )?.status === "Processing"
													? "bg-blue-100 text-blue-800 hover:bg-blue-100"
													: "bg-purple-100 text-purple-800 hover:bg-purple-100"
											}`}
										>
											{
												orders.find((o) => o.id === selectedOrder)
													?.status
											}
										</Badge>
										<div className="flex gap-2">
											<Button variant="outline" size="sm" className="rounded-full">
												<Eye className="h-4 w-4 mr-2" /> Track Order
											</Button>
											<Button variant="outline" size="sm" className="rounded-full">
												<Download className="h-4 w-4 mr-2" />{" "}
												Invoice
											</Button>
										</div>
									</div>

									<div>
										<h3 className="font-semibold mb-3">Items</h3>
										<div className="space-y-4">
											{orders
												.find((o) => o.id === selectedOrder)
												?.items.map((item, index) => (
													<div key={index} className="flex gap-4">
														<div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0"></div>
														<div className="flex-1">
															<div className="flex justify-between">
																<div>
																	<h4 className="font-medium">
																		{item.name}
																	</h4>
																	<p className="text-sm text-gray-500">
																		Size: {item.size}
																	</p>
																</div>
																<p className="font-semibold">
																	Rp {item.price}
																</p>
															</div>
															<p className="text-sm text-gray-500 mt-1">
																Quantity: {item.quantity}
															</p>
														</div>
													</div>
												))}
										</div>
									</div>

									<div className="border-t border-gray-100 pt-4">
										<h3 className="font-semibold mb-3">
											Order Summary
										</h3>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-gray-500">
													Subtotal
												</span>
												<span>
													Rp{" "}
													{
														orders.find(
															(o) => o.id === selectedOrder
														)?.total
													}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-500">
													Shipping
												</span>
												<span>Rp 15.000</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-500">Tax</span>
												<span>Rp 0</span>
											</div>
											<div className="flex justify-between font-semibold pt-2 border-t border-gray-100">
												<span>Total</span>
												<span>
													Rp{" "}
													{(
														Number.parseInt(
															orders
																.find(
																	(o) => o.id === selectedOrder
																)
																?.total.replace(/\./g, "") ||
																"0"
														) + 15000
													).toLocaleString("id-ID")}
												</span>
											</div>
										</div>
									</div>

									<div className="border-t border-gray-100 pt-4">
										<h3 className="font-semibold mb-3">
											Shipping Information
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<p className="text-gray-500 text-sm">
													Shipping Address
												</p>
												<p className="font-medium">
													{addresses[0].recipient}
												</p>
												<p>{addresses[0].street}</p>
												<p>
													{addresses[0].city},{" "}
													{addresses[0].province}{" "}
													{addresses[0].postalCode}
												</p>
												<p>{addresses[0].phone}</p>
											</div>
											<div>
												<p className="text-gray-500 text-sm">
													Shipping Method
												</p>
												<p className="font-medium">JNE Regular</p>
												<p className="text-gray-500 text-sm mt-4">
													Payment Method
												</p>
												<p className="font-medium">
													Bank Transfer (BCA)
												</p>
											</div>
										</div>
									</div>

									<div className="flex justify-center pt-4">
										<Button className="bg-pink-500 hover:bg-pink-600 rounded-full">
											Buy Again
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)
			)}
		</div>
	);
}
