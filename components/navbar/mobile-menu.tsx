"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
	SheetHeader,
} from "@/components/ui/sheet";
import { Menu, User2Icon, X } from "lucide-react";
import { User } from "next-auth";
import Logout from "../logout";

interface MobileMenuProps {
	isLoggedIn: boolean;
	user?: User;
}

export default function MobileMenu({ isLoggedIn, user }: MobileMenuProps) {
	const t = useTranslations("Navbar");
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="h-6 w-6" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-full [&>button:first-of-type]:hidden"
			>
				<SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
				<SheetHeader>
					<div className="flex items-center justify-between pb-4 border-b">
						<Image
							src="/logo-pitaya-transparan.png"
							alt="PITAYA"
							width={120}
							height={35}
							className="h-8 w-auto"
						/>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsOpen(false)}
						>
							<X className="h-5 w-5" />
						</Button>
					</div>
				</SheetHeader>
				<div className="flex flex-col h-full">
					<nav className="flex flex-col space-y-6 pt-8">
						<Link
							href="/"
							className="text-lg font-medium text-gray-700 hover:text-pink-500"
							onClick={() => setIsOpen(false)}
						>
							{t("home")}
						</Link>
						<Link
							href="/#products"
							className="text-lg font-medium text-gray-700 hover:text-pink-500"
							onClick={() => setIsOpen(false)}
						>
							{t("products")}
						</Link>
						<Link
							href="/about"
							className="text-lg font-medium text-gray-700 hover:text-pink-500"
							onClick={() => setIsOpen(false)}
						>
							{t("about")}
						</Link>
						<Link
							href="/contact"
							className="text-lg font-medium text-gray-700 hover:text-pink-500"
							onClick={() => setIsOpen(false)}
						>
							{t("contact")}
						</Link>
						<Link
							href="/cart"
							className="text-lg font-medium text-gray-700 hover:text-pink-500"
							onClick={() => setIsOpen(false)}
						>
							{t("cart")}
						</Link>
					</nav>
					<div className="mt-auto pb-12">
						{isLoggedIn ? (
							<>
								<Link href="/account" onClick={() => setIsOpen(false)}>
									<Button className="w-full bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white rounded-full">
										<User2Icon /> {user?.name}
									</Button>
								</Link>
								<Logout onClick={() => setIsOpen(false)} />
							</>
						) : (
							<Link href="/login" onClick={() => setIsOpen(false)}>
								<Button className="w-full bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white rounded-full">
									{t("signIn")}
								</Button>
							</Link>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
