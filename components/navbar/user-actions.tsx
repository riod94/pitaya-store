"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User2 } from "lucide-react";
import LocaleSwitcher from "../locale-switcher";
import { User } from "next-auth";

interface UserActionsProps {
	isLoggedIn: boolean;
	user?: User;
}

export default function UserActions({ isLoggedIn, user }: UserActionsProps) {
	const t = useTranslations("Navbar");

	return (
		<div className="hidden md:flex items-center space-x-4">
			<LocaleSwitcher />
			<Link href="/cart">
				<Button
					variant="ghost"
					size="icon"
					className="text-gray-700 hover:text-pink-500 relative rounded-full"
					aria-label={t("cart")}
				>
					<ShoppingBag className="h-5 w-5" />
					<span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
						3
					</span>
				</Button>
			</Link>
			{isLoggedIn ? (
				<Link href="/account">
					<Button
						variant="ghost"
						className="text-gray-700 hover:text-pink-500 rounded-full"
						aria-label={t("myAccount")}
					>
						<User2 className="h-5 w-5" />{" "}
						<span className="ml-2 truncate">{user?.name}</span>
					</Button>
				</Link>
			) : (
				<Link href="/login">
					<Button className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white rounded-full">
						{t("signIn")}
					</Button>
				</Link>
			)}
		</div>
	);
}
