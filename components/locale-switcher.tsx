import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./locale-switcher-select";

export default function LocaleSwitcher() {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect
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
