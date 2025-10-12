import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { headers } from "next/headers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "PITAYA - Premium Nuts and Seeds",
	description:
		"Discover our selection of high-quality nuts and seeds. Perfect for healthy snacking, cooking, or gifting to loved ones.",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const locale = await getLocale();
	const messages = await getMessages();
	const headersList = await headers();
	const pathname = headersList.get("x-pathname") || "";
	const isAdminRoute = pathname.startsWith("/admin");

	return (
		<html lang={locale} className="scroll-smooth">
			<body className={inter.className}>
				<QueryProvider>
					<NextIntlClientProvider locale={locale} messages={messages}>
						{isAdminRoute ? (
							children
						) : (
							<>
								<SessionProvider>
									<Navbar />
								</SessionProvider>
								{children}
								<Footer />
							</>
						)}
					</NextIntlClientProvider>
				</QueryProvider>
				<Toaster richColors closeButton position="top-right" />
			</body>
		</html>
	);
}
