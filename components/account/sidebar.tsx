"use client";
import {
	Bell,
	CreditCard,
	Heart,
	MapPin,
	Package,
	Settings,
	User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "../ui/card";

const menuItems = [
	{
		title: "Profile",
		href: "/account",
		icon: User,
	},
	{
		title: "Orders",
		href: "/account/orders",
		icon: Package,
	},
	// {
	// 	title: "Wishlist",
	// 	href: "/account/wishlist",
	// 	icon: Heart,
	// },
	{
		title: "Addresses",
		href: "/account/addresses",
		icon: MapPin,
	},
	// {
	// 	title: "Payment Methods",
	// 	href: "/account/payments",
	// 	icon: CreditCard,
	// },
	// {
	// 	title: "Notifications",
	// 	href: "/account/notifications",
	// 	icon: Bell,
	// },
	{
		title: "Settings",
		href: "/account/settings",
		icon: Settings,
	},
];

export default function AccountSidebar() {
	const pathname = usePathname();
	const session = useSession();
	const user = session.data?.user;

	return (
		<div className="w-full md:w-64 flex-shrink-0 sticky top-24 z-20">
			<Card>
				<div className="bg-white rounded-xl shadow-sm overflow-hidden">
					<div className="p-6 border-b border-gray-100">
						<div className="flex items-center gap-4">
							<Avatar className="h-16 w-16">
								<AvatarImage
									src={user?.avatar || "/placeholder.svg"}
									alt={user?.name || ""}
								/>
								<AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<h2 className="font-semibold text-lg">{user?.name}</h2>
								<p className="text-gray-500 text-sm">{user?.email}</p>
							</div>
						</div>
					</div>
					<nav className="flex flex-row md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-visible p-2 justify-between items-center md:items-start min-h-[56px]">
						{menuItems.map((item) => (
							<Link
								key={item.title}
								href={item.href}
								className={`flex flex-1 flex-col md:flex-row items-center justify-center md:justify-start py-2 md:py-3 gap-1 md:gap-0 rounded-xl transition-colors whitespace-nowrap font-medium text-xs md:text-base text-center md:text-left md:w-full md: px-2 ${
									pathname === item.href
										? "bg-pink-100 text-pink-500"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<item.icon className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-0 md:mr-3" />
								<span>{item.title}</span>
							</Link>
						))}
					</nav>
				</div>
			</Card>
		</div>
	);
}
