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
						"rounded-lg p-2 transition-colors hover:bg-slate-200 border-0",
						isPending && "pointer-events-none opacity-60"
					)}
				>
					{locale.toUpperCase()}
				</SelectTrigger>
				<SelectContent
					align="end"
					className="min-w-[8rem] overflow-hidden rounded-lg bg-white py-1 shadow-lg"
				>
					{items.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							<span className="text-slate-900">{item.label}</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
