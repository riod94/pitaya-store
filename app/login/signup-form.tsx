"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Helper: validasi email format
function isValidEmail(email: string) {
	return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
const disposableDomains = [
	"mailinator.com",
	"tempmail.com",
	"guerrillamail.com",
	"10minutemail.com",
	"yopmail.com",
	"trashmail.com",
	"getnada.com",
	"sharklasers.com",
];
function isDisposableEmail(email: string) {
	return disposableDomains.some((domain) => email.endsWith("@" + domain));
}
function isStrongPassword(pwd: string) {
	return pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /[0-9]/.test(pwd);
}

export default function SignupForm() {
	const t = useTranslations();
	const router = useRouter();
	const [regName, setRegName] = useState("");
	const [regEmail, setRegEmail] = useState("");
	const [regPassword, setRegPassword] = useState("");
	const [regError, setRegError] = useState("");
	const [regSuccess, setRegSuccess] = useState("");
	const [regLoading, setRegLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();
		setRegError("");
		setRegSuccess("");
		if (!regName || !regEmail || !regPassword) {
			setRegError(t("Full Name, email, and password is required"));
			return;
		}
		if (!isValidEmail(regEmail)) {
			setRegError(t("Email format is invalid"));
			return;
		}
		if (isDisposableEmail(regEmail)) {
			setRegError(t("Email is not allowed"));
			return;
		}
		if (!isStrongPassword(regPassword)) {
			setRegError(
				t(
					"Password minimum 8 characters and combination of letters and numbers"
				)
			);
			return;
		}
		setRegLoading(true);
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: regName,
					email: regEmail,
					password: regPassword,
				}),
			});
			const data = await res.json();
			if (!res.ok && data.message) {
				setRegError(t(data.message));
				return;
			}
			setRegSuccess(t("Registration successful Redirecting to homepage"));
			await signIn("credentials", {
				email: regEmail,
				password: regPassword,
				redirect: false,
			});
			router.replace("/");
		} catch (err) {
			setRegError(t("Something went wrong."));
		} finally {
			setRegLoading(false);
		}
	}

	return (
		<form onSubmit={handleRegister}>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="full-name">{t("Login.fullName")}</Label>
					<Input
						id="full-name"
						placeholder={t("Login.fullNamePlaceholder")}
						value={regName}
						onChange={(e) => setRegName(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="register-email">
						{t("Login.registerEmail")}
					</Label>
					<Input
						id="register-email"
						type="email"
						placeholder={t("Login.registerEmailPlaceholder")}
						value={regEmail}
						onChange={(e) => setRegEmail(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="register-password">
						{t("Login.registerPassword")}
					</Label>
					<div className="relative">
						<Input
							id="register-password"
							type={showPassword ? "text" : "password"}
							placeholder={t("Login.registerPasswordPlaceholder")}
							value={regPassword}
							onChange={(e) => setRegPassword(e.target.value)}
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
					<p className="text-xs text-gray-500">
						{t("Login.passwordHint")}
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Checkbox id="terms" required />
					<Label htmlFor="terms" className="text-sm font-normal">
						{t("Login.agree")}{" "}
						<Link
							href="/terms"
							className="text-pink-500 hover:text-pink-600 transition-colors"
						>
							{t("Login.terms")}
						</Link>{" "}
						{t("Login.and")}{" "}
						<Link
							href="/privacy"
							className="text-pink-500 hover:text-pink-600 transition-colors"
						>
							{t("Login.privacy")}
						</Link>
					</Label>
				</div>
				<Button
					type="submit"
					className="w-full bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white"
					disabled={regLoading}
				>
					{regLoading ? t("loading") : t("Login.createAccount")}
				</Button>
				{regError && (
					<div className="text-red-500 text-sm mt-2">{regError}</div>
				)}
				{regSuccess && (
					<div className="text-green-600 text-sm mt-2">{regSuccess}</div>
				)}
			</div>
		</form>
	);
}
