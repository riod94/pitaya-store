"use client";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Logout({ onClick }: { onClick?: () => void }) {
	const t = useTranslations();
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		await setLoading(true);
		await signOut({ redirect: true, redirectTo: "/login" });
		await onClick?.();
		await setLoading(false);
	};

	return (
		<Button
			variant="outline"
			className="w-full mt-2 rounded-full bg-red-50 text-red-500 border-red-500 hover:bg-red-100 hover:text-red-500"
			onClick={handleLogout}
			disabled={loading}
		>
			{loading ? t("logout") + "..." : t("logout")}
		</Button>
	);
}
