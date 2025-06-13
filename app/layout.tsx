import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";

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

	return (
		<html lang={locale} className="scroll-smooth">
			<body className={inter.className}>
				<NextIntlClientProvider>{children}</NextIntlClientProvider>
			</body>
		</html>
	);
}
