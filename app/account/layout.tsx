import type { ReactNode } from "react";
import AccountSidebar from "@/components/account/sidebar";
import { SessionProvider } from "next-auth/react";

export default async function AccountLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<main className="pt-20 pb-16 bg-gray-100">
			<div className="container mx-auto">
				<div className="flex flex-col md:flex-row gap-4 w-full">
					{/* Sidebar */}
					<SessionProvider>
						<div className="w-full md:w-64 p-2 md:my-4">
							<AccountSidebar />
						</div>
					</SessionProvider>
					{/* Content */}
					<div className="flex-1 w-full p-2 md:my-4">{children}</div>
				</div>
			</div>
		</main>
	);
}
