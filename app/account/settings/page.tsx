import { signOut } from "@/auth";
import LocaleSwitcher from "@/components/locale-switcher";
import Logout from "@/components/logout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
	const t = useTranslations();

	const handleLogout = () => {
		signOut({ redirectTo: "/login" });
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Account Settings</CardTitle>
					<CardDescription>
						Manage your account preferences
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between py-2">
						<div>
							<p className="font-medium">{t("language")}</p>
							<p className="text-sm text-gray-500">
								{t("languageDesc")}
							</p>
						</div>
						<LocaleSwitcher isFullText variant="outline" />
					</div>
					{/* <div className="flex items-center justify-between py-2">
						<div>
							<p className="font-medium">Currency</p>
							<p className="text-sm text-gray-500">
								Select your preferred currency
							</p>
						</div>
						<Select defaultValue="idr">
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select currency" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="idr">
									Indonesian Rupiah (IDR)
								</SelectItem>
								<SelectItem value="usd">US Dollar (USD)</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center justify-between py-2">
						<div>
							<p className="font-medium">Two-Factor Authentication</p>
							<p className="text-sm text-gray-500">
								Add an extra layer of security
							</p>
						</div>
						<Button variant="outline">Enable</Button>
					</div> */}
					<div className="flex items-center justify-between py-2">
						<div>
							<p className="font-medium">{t("deleteAccount")}</p>
							<p className="text-sm text-gray-500">
								{t("deleteAccountDesc")}
							</p>
						</div>
						<Button
							variant="outline"
							className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
						>
							{t("deleteAccount")}
						</Button>
					</div>
				</CardContent>
				<CardFooter>
					<Logout />
				</CardFooter>
			</Card>
		</div>
	);
}
