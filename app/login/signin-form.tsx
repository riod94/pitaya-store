"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function isValidEmail(email: string) {
	return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export default function SigninForm() {
	const t = useTranslations();
	const router = useRouter();
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [loginError, setLoginError] = useState("");
	const [loginLoading, setLoginLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setLoginLoading(true);
		setLoginError("");
		if (!isValidEmail(loginEmail)) {
			setLoginError(t("Format email tidak valid"));
			return;
		}
		if (!loginPassword) {
			setLoginError(t("Password wajib diisi"));
			return;
		}

		const isSignedIn = await signIn("credentials", {
			email: loginEmail,
			password: loginPassword,
			redirect: false,
		});
		if (isSignedIn?.error) {
			setLoginError(t("Invalid user"));
			toast.warning(t("Invalid user"));
			setLoginLoading(false);
			return;
		} else {
			console.log(isSignedIn);
			setLoginLoading(false);
			toast.success(t("signInSuccess"));
			router.replace("/");
		}
	}

	return (
		<form onSubmit={handleLogin} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">{t("Login.email")}</Label>
				<Input
					id="email"
					type="email"
					placeholder={t("Login.emailPlaceholder")}
					value={loginEmail}
					onChange={(e) => setLoginEmail(e.target.value)}
					required
				/>
			</div>
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label htmlFor="password">{t("Login.password")}</Label>
					<Link
						href="/forgot-password"
						className="text-sm text-pink-500 hover:text-pink-600 transition-colors"
					>
						{t("Login.forgot")}
					</Link>
				</div>
				<div className="relative">
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder={t("Login.passwordPlaceholder")}
						value={loginPassword}
						onChange={(e) => setLoginPassword(e.target.value)}
						required
					/>
					<button
						type="button"
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>
			{/* <div className="flex items-center space-x-2">
				<Checkbox id="remember" />
				<Label htmlFor="remember" className="text-sm font-normal">
					{t("Login.remember")}
				</Label>
			</div> */}
			<Button
				type="submit"
				className="w-full bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white"
				disabled={loginLoading}
			>
				{loginLoading ? t("loading") : t("Login.signIn")}
			</Button>
			{loginError && (
				<div className="text-red-500 text-sm mt-2">{loginError}</div>
			)}
		</form>
	);
}
