import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

interface NotificationsTabProps {
	settings: any;
	updateField: (section: string, field: string, value: any) => void;
	updateNestedField: (section: string, subsection: string, field: string, value: any) => void;
	handleSaveChanges: () => void;
	loading: boolean;
}

export function NotificationsTab({ settings, updateField, updateNestedField, handleSaveChanges, loading }: NotificationsTabProps) {
	return (
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
							<Switch
								id="new-order"
								checked={settings.notifications?.emailNotifications?.newOrder || false}
								onCheckedChange={(checked) => updateNestedField("notifications", "emailNotifications", "newOrder", checked)}
							/>
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
							<Switch
								id="order-status"
								checked={settings.notifications?.emailNotifications?.orderStatus || false}
								onCheckedChange={(checked) => updateNestedField("notifications", "emailNotifications", "orderStatus", checked)}
							/>
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
							<Switch
								id="low-stock"
								checked={settings.notifications?.emailNotifications?.lowStock || false}
								onCheckedChange={(checked) => updateNestedField("notifications", "emailNotifications", "lowStock", checked)}
							/>
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
							<Switch
								id="customer-messages"
								checked={settings.notifications?.emailNotifications?.customerMessages || false}
								onCheckedChange={(checked) => updateNestedField("notifications", "emailNotifications", "customerMessages", checked)}
							/>
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
							value={settings.notifications?.additionalRecipients || ""}
							onChange={(e) => updateField("notifications", "additionalRecipients", e.target.value)}
						/>
						<p className="text-sm text-muted-foreground">
							These email addresses will also receive the
							notifications you've enabled above
						</p>
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
