import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Payment Methods</CardTitle>
						<CardDescription>Manage your payment options</CardDescription>
					</div>
					<Button className="bg-pink-500 hover:bg-pink-600">
						Add Payment Method
					</Button>
				</CardHeader>
				<CardContent>
					<div className="text-center py-12">
						<CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							No payment methods yet
						</h3>
						<p className="text-gray-500 mb-4">
							Add a payment method to make checkout faster and easier.
						</p>
						<Button className="bg-pink-500 hover:bg-pink-600">
							Add Payment Method
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
