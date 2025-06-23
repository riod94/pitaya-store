import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const wishlist = [
	{
		id: 1,
		name: "Pistachio Cangkang",
		price: "64.000",
		size: "100g",
		image: "/placeholder.svg?height=80&width=80",
	},
	{
		id: 5,
		name: "Hazelnut",
		price: "81.900",
		size: "250g",
		image: "/placeholder.svg?height=80&width=80",
	},
];

export default function WishlistPage() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>My Wishlist</CardTitle>
					<CardDescription>
						Products you've saved for later
					</CardDescription>
				</CardHeader>
				<CardContent>
					{wishlist.length > 0 ? (
						<div className="space-y-4">
							{wishlist.map((item) => (
								<div
									key={item.id}
									className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg"
								>
									<div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
										<Image
											src={item.image || "/placeholder.svg"}
											alt={item.name}
											width={80}
											height={80}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1">
										<div className="flex flex-col sm:flex-row sm:justify-between gap-2">
											<div>
												<h3 className="font-medium">{item.name}</h3>
												<p className="text-sm text-gray-500">
													Size: {item.size}
												</p>
											</div>
											<p className="font-semibold">
												Rp {item.price}
											</p>
										</div>
										<div className="flex flex-wrap gap-2 mt-4">
											<Button className="bg-pink-500 hover:bg-pink-600">
												Add to Cart
											</Button>
											<Button
												variant="outline"
												className="text-red-500 hover:text-red-600 hover:bg-red-50"
											>
												Remove
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								Your wishlist is empty
							</h3>
							<p className="text-gray-500 mb-4">
								Browse our products and click the heart icon to add
								items to your wishlist.
							</p>
							<Link href="/#products">
								<Button className="bg-pink-500 hover:bg-pink-600">
									Browse Products
								</Button>
							</Link>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
