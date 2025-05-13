import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "PITAYA - Premium Nuts and Seeds",
	description:
		"Discover our selection of high-quality nuts and seeds. Perfect for healthy snacking, cooking, or gifting to loved ones.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="scroll-smooth">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
