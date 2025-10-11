import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Save } from "lucide-react";

interface GeneralTabProps {
	settings: any;
	updateField: (section: string, field: string, value: any) => void;
	handleSaveChanges: () => void;
	loading: boolean;
}

export function GeneralTab({ settings, updateField, handleSaveChanges, loading }: GeneralTabProps) {
	return (
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
							<Input
								id="store-name"
								value={settings.general?.storeName || ""}
								onChange={(e) => updateField("general", "storeName", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="store-email">Email Address</Label>
							<Input
								id="store-email"
								type="email"
								value={settings.general?.emailAddress || ""}
								onChange={(e) => updateField("general", "emailAddress", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="store-phone">Phone Number</Label>
							<Input
								id="store-phone"
								value={settings.general?.phoneNumber || ""}
								onChange={(e) => updateField("general", "phoneNumber", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="store-currency">Currency</Label>
							<Select
								value={settings.general?.currency || "idr"}
								onValueChange={(value) => updateField("general", "currency", value)}
							>
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
								value={settings.general?.addressLine1 || ""}
								onChange={(e) => updateField("general", "addressLine1", e.target.value)}
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="address-line2">
								Address Line 2 (Optional)
							</Label>
							<Input
								id="address-line2"
								value={settings.general?.addressLine2 || ""}
								onChange={(e) => updateField("general", "addressLine2", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="city">City</Label>
							<Input
								id="city"
								value={settings.general?.city || ""}
								onChange={(e) => updateField("general", "city", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="province">Province</Label>
							<Input
								id="province"
								value={settings.general?.province || ""}
								onChange={(e) => updateField("general", "province", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="postal-code">Postal Code</Label>
							<Input
								id="postal-code"
								value={settings.general?.postalCode || ""}
								onChange={(e) => updateField("general", "postalCode", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="country">Country</Label>
							<Select
								value={settings.general?.country || "id"}
								onValueChange={(value) => updateField("general", "country", value)}
							>
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
								value={settings.general?.weekdayHours || ""}
								onChange={(e) => updateField("general", "weekdayHours", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="weekend-hours">
								Weekend Hours
							</Label>
							<Input
								id="weekend-hours"
								value={settings.general?.weekendHours || ""}
								onChange={(e) => updateField("general", "weekendHours", e.target.value)}
							/>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Switch
							id="closed-holidays"
							checked={settings.general?.closedHolidays || false}
							onCheckedChange={(checked) => updateField("general", "closedHolidays", checked)}
						/>
						<Label htmlFor="closed-holidays">
							Closed on public holidays
						</Label>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					className="bg-pink-500 hover:bg-pink-600"
					onClick={handleSaveChanges}
					disabled={loading}
				>
					<Save className="mr-2 h-4 w-4" /> {loading ? "Menyimpan..." : "Save Changes"}
				</Button>
			</CardFooter>
		</Card>
	);
}
