import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

export default function ProfilePage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Profile</h1>
				<p className="text-muted-foreground">
					Manage your profile settings and preferences.
				</p>
			</div>
			<Card>
				<CardHeader>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Profile Information</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="full-name">Full Name</Label>
								<Input id="full-name" defaultValue="Admin User" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									defaultValue="admin@pitaya.com"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<Input
									id="role"
									defaultValue="Administrator"
									disabled
								/>
							</div>
						</div>
					</div>

					<Separator />

					<div className="space-y-4">
						<h3 className="text-lg font-medium">Change Password</h3>
						<div className="grid gap-4">
							<div className="space-y-2">
								<Label htmlFor="current-password">
									Current Password
								</Label>
								<Input id="current-password" type="password" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="new-password">New Password</Label>
								<Input id="new-password" type="password" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirm-password">
									Confirm New Password
								</Label>
								<Input id="confirm-password" type="password" />
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
		</div>
	);
}
