"use client";

import { Bell, LogOut, Search, Settings, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminHeader() {
	const session = useSession();

	return (
		<header className="bg-white border-b border-gray-200 py-3 px-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center w-1/3">
					{/* <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input type="search" placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200 focus:bg-white" />
          </div> */}
				</div>

				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-500 hover:text-gray-700 relative"
					>
						<Bell className="h-5 w-5" />
						<span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="relative h-8 w-8 rounded-full"
							>
								<Avatar className="h-8 w-8">
									<AvatarFallback className="bg-pink-100 text-pink-800">
										{session.data?.user?.name
											?.slice(0, 2)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end" forceMount>
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">
										{session.data?.user?.name}
									</p>
									<p className="text-xs leading-none text-muted-foreground">
										{session.data?.user?.email}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User2 />
								<Link href="/admin/profile">Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings />
								<Link href="/admin/settings">Settings</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-red-500">
								<LogOut className="mr-2 h-4 w-4" /> Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
