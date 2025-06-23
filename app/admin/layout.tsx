import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex h-screen overflow-hidden">
				<AdminSidebar />
				<div className="flex-1 overflow-auto">
					<SessionProvider>
						<AdminHeader />
					</SessionProvider>
					<main className="p-6">{children}</main>
				</div>
			</div>
		</div>
	);
}
