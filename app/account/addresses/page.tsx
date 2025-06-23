import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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

export default function AddressesPage() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>My Addresses</CardTitle>
						<CardDescription>
							Manage your shipping addresses
						</CardDescription>
					</div>
					<Button className="bg-pink-500 hover:bg-pink-600 rounded-full">
						Add New Address
					</Button>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{addresses.map((address) => (
							<div
								key={address.id}
								className={`border ${
									address.isDefault
										? "border-pink-500"
										: "border-gray-200"
								} rounded-lg p-4 relative`}
							>
								{address.isDefault && (
									<Badge className="absolute top-4 right-4 bg-pink-100 text-pink-800 hover:bg-pink-100">
										Default
									</Badge>
								)}
								<div className="flex items-start justify-between">
									<div>
										<div className="flex items-center gap-2 mb-1">
											<h3 className="font-semibold">
												{address.name}
											</h3>
										</div>
										<p className="text-gray-700">
											{address.recipient}
										</p>
										<p className="text-gray-700">{address.street}</p>
										<p className="text-gray-700">
											{address.city}, {address.province}{" "}
											{address.postalCode}
										</p>
										<p className="text-gray-700">{address.phone}</p>
									</div>
								</div>
								<div className="flex gap-2 mt-4">
									<Button
										variant="outline"
										size="sm"
										className="rounded-full"
									>
										Edit
									</Button>
									{!address.isDefault && (
										<>
											<Button
												variant="outline"
												size="sm"
												className="rounded-full"
											>
												Set as Default
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
											>
												Delete
											</Button>
										</>
									)}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
