"use client"
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "./components/GeneralTab";
import { AppearanceTab } from "./components/AppearanceTab";
import { NotificationsTab } from "./components/NotificationsTab";
import { ShippingTab } from "./components/ShippingTab";
import { PaymentTab } from "./components/PaymentTab";

class SettingsService {
	async getSettings() {
		const res = await fetch("/api/admin/settings", { cache: "no-store" });
		if (!res.ok) throw new Error("Gagal memuat settings");
		const json = await res.json();
		const data = json?.data ?? json; // createApiResponse wraps in {data}

		// Map API shape -> UI state shape yang ada sekarang
		const store = data.storeSettings || {};
		const site = data.siteSettings || {};
		const providers = data.shippingProviders || [];
		const zones = data.shippingZones || [];
		const payments = data.paymentMethods || [];

		// Simpan raw data untuk update
		const rawProviders = providers.map((p: any) => ({ id: p.id, name: p.name, code: p.code, isActive: !!p.isActive }));
		const rawPayments = payments.map((pm: any) => ({ id: pm.id, name: pm.name, code: pm.code, type: pm.type, isActive: !!pm.isActive }));

		const mapProv = (name: string) => {
			const n = name.toLowerCase();
			if (n.includes("j&t")) return "jt";
			if (n.includes("jnt")) return "jt";
			if (n.includes("sicepat")) return "sicepat";
			if (n.includes("pos")) return "pos";
			if (n.includes("jne")) return "jne";
			if (n.includes("gosend")) return "gosend";
			return undefined;
		};

		const shippingMethods: Record<string, boolean> = {};
		providers.forEach((p: any) => {
			const key = mapProv(p.name || p.code || "");
			if (key) shippingMethods[key] = !!p.isActive;
		});

		const paymentMethods: Record<string, boolean> = {};
		payments.forEach((pm: any) => {
			const t = (pm.type || pm.code || pm.name || "").toString().toLowerCase();
			if (t.includes("bank") || t.includes("transfer")) paymentMethods.bankTransfer = !!pm.isActive;
			else if (t.includes("wallet") || t.includes("ewallet") || t.includes("gopay") || t.includes("ovo") || t.includes("dana")) paymentMethods.eWallet = !!pm.isActive;
			else if (t.includes("cod")) paymentMethods.cod = !!pm.isActive;
			else if (t.includes("card") || t.includes("credit") || t.includes("debit")) paymentMethods.card = !!pm.isActive;
			else if (t.includes("qris")) paymentMethods.qris = !!pm.isActive;
		});

		return {
			general: {
				storeName: store.store_name ?? "",
				emailAddress: store.store_email ?? "",
				phoneNumber: store.store_phone ?? "",
				currency: store.store_currency ?? "idr",
				addressLine1: store.store_address_line1 ?? "",
				addressLine2: store.store_address_line2 ?? "",
				city: store.store_city ?? "",
				province: store.store_province ?? "",
				postalCode: store.store_postal_code ?? "",
				country: store.store_country ?? "id",
				weekdayHours: store.store_weekday_hours ?? "",
				weekendHours: store.store_weekend_hours ?? "",
				closedHolidays: !!store.store_closed_holidays,
			},
			appearance: {
				theme: site.site_theme ?? "default",
				logo: site.site_logo ?? "/logo-pitaya-transparan.png",
				homepageLayout: {
					showHero: !!site.site_show_hero,
					showFeatured: !!site.site_show_featured,
					showCategories: !!site.site_show_categories,
					showTestimonials: !!site.site_show_testimonials,
				},
			},
			notifications: {
				emailNotifications: {
					newOrder: !!store.notifications_new_order,
					orderStatus: !!store.notifications_order_status,
					lowStock: !!store.notifications_low_stock,
					customerMessages: !!store.notifications_customer_messages,
				},
				additionalRecipients: store.notifications_additional_emails ?? "",
			},
			shipping: {
				shippingMethods,
				freeShipping: {
					enabled: !!store.shipping_enable_free_shipping,
					threshold: Number(store.free_shipping_min ?? 0) || 0,
				},
				shippingZones: zones.map((z: any) => ({ id: z.id, name: z.name, areas: z.area || [] })),
			},
			payment: {
				paymentMethods,
				bankAccountDetails: {
					bankName: store.bank_name ?? "",
					accountNumber: store.bank_account_number ?? "",
					accountHolderName: store.bank_account_name ?? "",
					branch: store.bank_branch ?? "",
				},
			},
			// Add paymentMethods array at root level for PaymentTab
			paymentMethods: rawPayments,
			_raw: {
				shippingProviders: rawProviders,
				paymentMethods: rawPayments,
			},
		} as any;
	}

	async saveSettings(currentState: any) {
		// Kirim payload lengkap termasuk shippingProviders dan paymentMethods
		const payload = {
			storeSettings: {
				store_name: currentState?.general?.storeName,
				store_email: currentState?.general?.emailAddress,
				store_phone: currentState?.general?.phoneNumber,
				store_currency: currentState?.general?.currency,
				store_address_line1: currentState?.general?.addressLine1,
				store_address_line2: currentState?.general?.addressLine2,
				store_city: currentState?.general?.city,
				store_province: currentState?.general?.province,
				store_postal_code: currentState?.general?.postalCode,
				store_country: currentState?.general?.country,
				store_weekday_hours: currentState?.general?.weekdayHours,
				store_weekend_hours: currentState?.general?.weekendHours,
				store_closed_holidays: !!currentState?.general?.closedHolidays,
				shipping_enable_free_shipping: !!currentState?.shipping?.freeShipping?.enabled,
				free_shipping_min: currentState?.shipping?.freeShipping?.threshold,
				notifications_new_order: !!currentState?.notifications?.emailNotifications?.newOrder,
				notifications_order_status: !!currentState?.notifications?.emailNotifications?.orderStatus,
				notifications_low_stock: !!currentState?.notifications?.emailNotifications?.lowStock,
				notifications_customer_messages: !!currentState?.notifications?.emailNotifications?.customerMessages,
				notifications_additional_emails: currentState?.notifications?.additionalRecipients,
				bank_name: currentState?.payment?.bankAccountDetails?.bankName,
				bank_account_number: currentState?.payment?.bankAccountDetails?.accountNumber,
				bank_account_name: currentState?.payment?.bankAccountDetails?.accountHolderName,
				bank_branch: currentState?.payment?.bankAccountDetails?.branch,
			},
			siteSettings: {
				site_theme: currentState?.appearance?.theme,
				site_show_hero: !!currentState?.appearance?.homepageLayout?.showHero,
				site_show_featured: !!currentState?.appearance?.homepageLayout?.showFeatured,
				site_show_categories: !!currentState?.appearance?.homepageLayout?.showCategories,
				site_show_testimonials: !!currentState?.appearance?.homepageLayout?.showTestimonials,
			},
			shippingProviders: (currentState?._raw?.shippingProviders || []).map((sp: any) => ({
				id: sp.id,
				isActive: sp.isActive
			})),
			paymentMethods: (currentState?._raw?.paymentMethods || []).map((pm: any) => ({
				id: pm.id,
				isActive: pm.isActive
			})),
		} as any;

		const res = await fetch("/api/admin/settings", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData?.error || "Gagal menyimpan settings");
		}
	}
}

export default function SettingsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const tabFromUrl = searchParams.get("tab") || "general";
	
	const settingsService = new SettingsService();
	const [settings, setSettings] = useState<any>({});
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState(tabFromUrl);

	const loadSettings = async () => {
		try {
			console.log('📥 Loading settings from API...');
			const apiData = await settingsService.getSettings();
			console.log('📦 Raw API data:', apiData);
			
			// Transform API data to match component expectations
			const transformedData = await settingsService.getSettings();
			console.log('🔄 Transformed data:', transformedData);
			console.log('💳 Payment methods array:', transformedData.paymentMethods);
			
			setSettings(transformedData);
		} catch (error) {
			console.error('❌ Error loading settings:', error);
			toast.error("Gagal memuat settings");
		}
	};

	useEffect(() => {
		loadSettings();
	}, []);

	// Sync tab with URL
	useEffect(() => {
		setActiveTab(tabFromUrl);
	}, [tabFromUrl]);

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		router.push(`/admin/settings?tab=${value}`, { scroll: false });
	};

	const handleZonesChange = () => {
		// Reload settings to get updated shipping zones
		loadSettings();
	};

	const handleSaveChanges = async () => {
		setLoading(true);
		try {
			await settingsService.saveSettings(settings);
			toast.success("Settings berhasil disimpan", {
				description: "Perubahan telah tersimpan ke database",
			});
		} catch (e: any) {
			console.error(e);
			toast.error("Gagal menyimpan settings", {
				description: e?.message || "Terjadi kesalahan saat menyimpan settings",
			});
		} finally {
			setLoading(false);
		}
	};

	const updateField = (section: string, field: string, value: any) => {
		setSettings((prev: any) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: value,
			},
		}));
	};

	const updateNestedField = (section: string, subsection: string, field: string, value: any) => {
		setSettings((prev: any) => ({
			...prev,
			[section]: {
				...prev[section],
				[subsection]: {
					...prev[section]?.[subsection],
					[field]: value,
				},
			},
		}));
	};

	const toggleShippingProvider = (key: string) => {
		setSettings((prev: any) => {
			const current = prev?.shipping?.shippingMethods?.[key] ?? false;
			const newVal = !current;
			// Update UI state
			const updated = {
				...prev,
				shipping: {
					...prev.shipping,
					shippingMethods: {
						...prev.shipping?.shippingMethods,
						[key]: newVal,
					},
				},
			};
			// Update raw providers
			const rawProviders = (prev._raw?.shippingProviders || []).map((p: any) => {
				const pKey = (p.name || p.code || "").toLowerCase();
				if (pKey.includes(key) || pKey.includes(key.replace("jt", "j&t"))) {
					return { ...p, isActive: newVal };
				}
				return p;
			});
			updated._raw = { ...prev._raw, shippingProviders: rawProviders };
			return updated;
		});
	};

	const togglePaymentMethod = (code: string) => {
		console.log('🔄 Toggle payment method:', code);
		setSettings((prev: any) => {
			// paymentMethods is an array, find and toggle by code
			const paymentMethods = prev.paymentMethods || [];
			console.log('📋 Current payment methods:', paymentMethods);
			
			const updatedPaymentMethods = paymentMethods.map((pm: any) => {
				if (pm.code === code) {
					console.log(`✅ Toggling ${pm.name} from ${pm.isActive} to ${!pm.isActive}`);
					return { ...pm, isActive: !pm.isActive };
				}
				return pm;
			});
			
			console.log('📋 Updated payment methods:', updatedPaymentMethods);
			
			const newState = {
				...prev,
				paymentMethods: updatedPaymentMethods,
				_raw: {
					...prev._raw,
					paymentMethods: updatedPaymentMethods
				}
			};
			
			console.log('💾 New state:', newState);
			return newState;
		});
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your store settings and preferences.
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
				<TabsList className="grid w-full md:grid-cols-5">
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="appearance">Appearance</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="shipping">Shipping</TabsTrigger>
					<TabsTrigger value="payment">Payment</TabsTrigger>
				</TabsList>

				<TabsContent value="general">
					<GeneralTab
						settings={settings}
						updateField={updateField}
						handleSaveChanges={handleSaveChanges}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="appearance">
					<AppearanceTab
						settings={settings}
						updateField={updateField}
						updateNestedField={updateNestedField}
						handleSaveChanges={handleSaveChanges}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="notifications">
					<NotificationsTab
						settings={settings}
						updateField={updateField}
						updateNestedField={updateNestedField}
						handleSaveChanges={handleSaveChanges}
						loading={loading}
					/>
				</TabsContent>

				<TabsContent value="shipping">
					<ShippingTab
						settings={settings}
						updateNestedField={updateNestedField}
						toggleShippingProvider={toggleShippingProvider}
						handleSaveChanges={handleSaveChanges}
						loading={loading}
						onZonesChange={handleZonesChange}
					/>
				</TabsContent>

				<TabsContent value="payment">
					<PaymentTab
						settings={settings}
						togglePaymentMethod={togglePaymentMethod}
						handleSaveChanges={handleSaveChanges}
						loading={loading}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
