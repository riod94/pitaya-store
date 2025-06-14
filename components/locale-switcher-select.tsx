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

type Props = {
	locale: string;
	items: Array<{ value: string; label: string }>;
	label: string;
};

export default function LocaleSwitcherSelect({ locale, items, label }: Props) {
	const [isPending, startTransition] = useTransition();

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
						"rounded-lg bg-transparent hover:bg-white hover:text-pink-500 py-0 px-2 transition-colors border-0",
						isPending && "pointer-events-none opacity-60"
					)}
				>
					{locale.toUpperCase()}
				</SelectTrigger>
				<SelectContent
					align="end"
					className="min-w-[8rem] overflow-hidden rounded-lg py-1 shadow-lg "
				>
					{items.map((item) => (
						<SelectItem
							key={item.value}
							value={item.value}
							className={`transition-colors ${
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
