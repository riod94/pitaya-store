import Image from "next/image";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
	const t = useTranslations("Footer");
	return (
		<footer className="bg-gray-900 text-white pt-16 pb-8">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					<div>
						<Image
							src="/logo-pitaya-transparan.png"
							alt="PITAYA Logo"
							width={180}
							height={48}
							className="mb-4"
						/>
						<p className="text-gray-400 mb-4">{t("desc")}</p>
						<div className="flex space-x-4">
							<Link
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-instagram"
								>
									<rect
										width="20"
										height="20"
										x="2"
										y="2"
										rx="5"
										ry="5"
									/>
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
								</svg>
							</Link>
							<Link
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-facebook"
								>
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
								</svg>
							</Link>
							<Link
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-twitter"
								>
									<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
								</svg>
							</Link>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">
							{t("quickLinks")}
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-gray-400 hover:text-white transition-colors"
								>
									{t("home")}
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-gray-400 hover:text-white transition-colors"
								>
									{t("products")}
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-gray-400 hover:text-white transition-colors"
								>
									{t("aboutUs")}
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-gray-400 hover:text-white transition-colors"
								>
									{t("contact")}
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">
							{t("productsTitle")}
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									{t("nuts")}
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									{t("seeds")}
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									{t("driedFruits")}
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									{t("giftPackages")}
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">
							{t("contactUsTitle")}
						</h3>
						<ul className="space-y-3">
							<li className="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-map-pin mr-2 mt-1 text-pink-500"
								>
									<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
									<circle cx="12" cy="10" r="3" />
								</svg>
								<span className="text-gray-400">{t("address")}</span>
							</li>
							<li className="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-phone mr-2 mt-1 text-pink-500"
								>
									<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
								</svg>
								<span className="text-gray-400">{t("phone")}</span>
							</li>
							<li className="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-mail mr-2 mt-1 text-pink-500"
								>
									<rect width="20" height="16" x="2" y="4" rx="2" />
									<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
								</svg>
								<span className="text-gray-400">{t("email")}</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-800 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-500 text-sm mb-4 md:mb-0">
							{t("copyright", { year: new Date().getFullYear() })}
						</p>
						<div className="flex space-x-4">
							<Link
								href="/privacy-policy"
								className="text-gray-500 hover:text-gray-400 text-sm"
							>
								{t("privacyPolicyLabel")}
							</Link>
							<Link
								href="/terms-and-conditions"
								className="text-gray-500 hover:text-gray-400 text-sm"
							>
								{t("termsOfServiceLabel")}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
