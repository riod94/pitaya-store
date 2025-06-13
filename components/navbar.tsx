"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import LocaleSwitcher from "./locale-switcher";
import { useTranslations } from "next-intl";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const t = useTranslations("Navbar");

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16 md:h-20">
					{/* Logo */}
					<Link href="/" className="flex items-center">
						<Image
							src="/logo-pitaya-transparan.png"
							alt="PITAYA"
							width={140}
							height={40}
							className="h-10 w-auto"
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						<Link
							href="/"
							className="text-gray-700 hover:text-pink-500 font-medium transition-colors"
						>
							{t("home")}
						</Link>
						<Link
							href="/products"
							className="text-gray-700 hover:text-pink-500 font-medium transition-colors"
						>
							{t("products")}
						</Link>
						<Link
							href="/about"
							className="text-gray-700 hover:text-pink-500 font-medium transition-colors"
						>
							{t("about")}
						</Link>
						<Link
							href="/contact"
							className="text-gray-700 hover:text-pink-500 font-medium transition-colors"
						>
							{t("contact")}
						</Link>
					</nav>

					{/* Action Buttons */}
					<div className="hidden md:flex items-center space-x-4">
						<LocaleSwitcher />
						<Link href="/cart">
							<Button
								variant="ghost"
								size="icon"
								className="text-gray-700 hover:text-pink-500 relative"
								aria-label={t("cart")}
							>
								<ShoppingBag className="h-5 w-5" />
								<span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
									3
								</span>
							</Button>
						</Link>
						<Link href="/account">
							<Button
								variant="ghost"
								size="icon"
								className="text-gray-700 hover:text-pink-500"
								aria-label={t("myAccount")}
							>
								<User className="h-5 w-5" />
							</Button>
						</Link>
						<Link href="/login">
							<Button className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white rounded-full">
								{t("signIn")}
							</Button>
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[400px]">
							<div className="flex flex-col h-full">
								<div className="flex items-center justify-between py-4 border-b">
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
										href="/account"
										className="text-lg font-medium text-gray-700 hover:text-pink-500"
										onClick={() => setIsOpen(false)}
									>
										{t("myAccount")}
									</Link>
									<Link
										href="/cart"
										className="text-lg font-medium text-gray-700 hover:text-pink-500"
										onClick={() => setIsOpen(false)}
									>
										{t("cart")}
									</Link>
								</nav>
								<div className="mt-auto pb-8">
									<Link href="/login" onClick={() => setIsOpen(false)}>
										<Button className="w-full bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white rounded-full">
											{t("signIn")}
										</Button>
									</Link>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
