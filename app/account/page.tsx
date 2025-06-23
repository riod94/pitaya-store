import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample user data
const user = {
	name: "John Doe",
	email: "john.doe@example.com",
	phone: "+62 812 3456 7890",
	avatar: "/placeholder.svg?height=100&width=100",
};

export default function AccountPage() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
					<CardDescription>Update your personal details</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input id="name" defaultValue={user.name} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									defaultValue={user.email}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Phone Number</Label>
								<Input id="phone" defaultValue={user.phone} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="birthdate">Date of Birth</Label>
								<Input id="birthdate" type="date" />
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" className="rounded-full">Cancel</Button>
					<Button className="bg-pink-500 hover:bg-pink-600 rounded-full">
						Save Changes
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Profile Picture</CardTitle>
					<CardDescription>Update your profile image</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row items-center gap-6">
						<Avatar className="h-24 w-24">
							<AvatarImage
								src={user.avatar || "/placeholder.svg"}
								alt={user.name}
							/>
							<AvatarFallback className="text-2xl">
								{user.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap gap-2">
								<Button variant="outline" className="rounded-full">Upload New Picture</Button>
								<Button
									variant="outline"
									className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
								>
									Remove
								</Button>
							</div>
							<p className="text-sm text-gray-500">
								Allowed formats: JPG, PNG. Maximum file size: 2MB.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Password</CardTitle>
					<CardDescription>Change your password</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="current-password">Current Password</Label>
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
					</form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" className="rounded-full">Cancel</Button>
					<Button className="bg-pink-500 hover:bg-pink-600 rounded-full">
						Update Password
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
