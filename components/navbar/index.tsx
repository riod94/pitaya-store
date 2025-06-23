"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import MobileMenu from "./mobile-menu";
import UserActions from "./user-actions";
import { useSession } from "next-auth/react";

export default function Navbar() {
	const t = useTranslations("Navbar");
	const session = useSession();
	const user = session?.data?.user;
	const isLoggedIn = !!user?.id;

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

					{/* User Actions - Client Component */}
					<UserActions isLoggedIn={isLoggedIn} user={user} />

					{/* Mobile Menu - Client Component */}
					<MobileMenu isLoggedIn={isLoggedIn} user={user} />
				</div>
			</div>
		</header>
	);
}
