import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect, { Variant } from "./locale-switcher-select";

interface Props {
	variant?: Variant;
	isFullText?: boolean;
}

export default function LocaleSwitcher({
	variant = "default",
	isFullText = false,
}: Props) {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect
			isFullText={isFullText}
			variant={variant}
			locale={locale}
			items={[
				{
					value: "id",
					label: t("id"),
				},
				{
					value: "en",
					label: t("en"),
				},
			]}
			label={t("label")}
		/>
	);
}
