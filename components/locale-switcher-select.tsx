"use client";

import clsx from "clsx";
import { useState, useTransition } from "react";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";
import { useTranslations } from "next-intl";

export type Variant = "default" | "outline";

type Props = {
	variant: Variant;
	locale: string;
	items: Array<{ value: string; label: string }>;
	label: string;
	isFullText?: boolean;
};

export default function LocaleSwitcherSelect({
	variant,
	locale,
	items,
	label,
	isFullText = false,
}: Props) {
	const t = useTranslations("LocaleSwitcher");
	const [isPending, startTransition] = useTransition();
	const theme =
		variant == "outline"
			? "border-2 border-gray-100 hover:border-pink-500"
			: "hover:bg-gray-100 border-0";

	function onChange(value: Locale) {
		startTransition(() => {
			setUserLocale(value);
		});
	}

	return (
		<div className="relative">
			<Select value={locale} onValueChange={onChange}>
				<SelectTrigger
					aria-label={label}
					className={clsx(
						theme,
						"rounded-full bg-transparent  hover:text-pink-500 py-0 px-2 transition-colors",
						isPending && "pointer-events-none opacity-60"
					)}
				>
					{isFullText ? t(locale) : locale.toUpperCase()}
				</SelectTrigger>
				<SelectContent
					align="end"
					className="min-w-[8rem] overflow-hidden rounded-lg py-1 shadow-lg "
				>
					{items.map((item) => (
						<SelectItem
							key={item.value}
							value={item.value}
							className={`transition-colors rounded-full ${
								item.value === locale ? "bg-white text-pink-500" : ""
							}`}
						>
							<span>{item.label}</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
