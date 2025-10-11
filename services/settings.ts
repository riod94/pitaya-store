import { db, storeSettings, siteSettings, shippingProviders, paymentMethods, shippingZones } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import type {
  SettingsResponse,
  StoreSettingsPayload,
  SiteSettingsPayload,
  TogglePayload,
  UpdateSettingsPayload,
} from "@/types/settings";

type SettingType = typeof storeSettings.$inferSelect["type"];

type SettingMeta = {
  key: string;
  label: string;
  description: string;
  category: string;
  type: SettingType;
  defaultValue: string | null;
  sortOrder: number;
};

const storeSettingsMeta: SettingMeta[] = [
  {
    key: "store_name",
    label: "Nama Toko",
    description: "Nama resmi toko",
    category: "general",
    type: "text",
    defaultValue: "Pitaya Store",
    sortOrder: 1
  },
  {
    key: "store_email",
    label: "Email Toko",
    description: "Email resmi toko",
    category: "contact",
    type: "text",
    defaultValue: "info@pitaya.com",
    sortOrder: 2
  },
  {
    key: "store_phone",
    label: "Nomor Telepon",
    description: "Nomor telepon customer service",
    category: "contact",
    type: "text",
    defaultValue: "+62 123 4567 890",
    sortOrder: 3
  },
  {
    key: "store_currency",
    label: "Mata Uang",
    description: "Mata uang utama toko",
    category: "general",
    type: "text",
    defaultValue: "idr",
    sortOrder: 4
  },
  {
    key: "store_address_line1",
    label: "Alamat Baris Pertama",
    description: "Alamat utama",
    category: "contact",
    type: "text",
    defaultValue: "Jl. Sudirman No. 123",
    sortOrder: 5
  },
  {
    key: "store_address_line2",
    label: "Alamat Baris Kedua",
    description: "Alamat tambahan",
    category: "contact",
    type: "text",
    defaultValue: "Karet Tengsin",
    sortOrder: 6
  },
  {
    key: "store_city",
    label: "Kota",
    description: "Kota domisili",
    category: "contact",
    type: "text",
    defaultValue: "Jakarta",
    sortOrder: 7
  },
  {
    key: "store_province",
    label: "Provinsi",
    description: "Provinsi domisili",
    category: "contact",
    type: "text",
    defaultValue: "DKI Jakarta",
    sortOrder: 8
  },
  {
    key: "store_postal_code",
    label: "Kode Pos",
    description: "Kode pos",
    category: "contact",
    type: "text",
    defaultValue: "10220",
    sortOrder: 9
  },
  {
    key: "store_country",
    label: "Negara",
    description: "Negara domisili",
    category: "contact",
    type: "text",
    defaultValue: "id",
    sortOrder: 10
  },
  {
    key: "store_weekday_hours",
    label: "Jam Weekday",
    description: "Jam operasional weekday",
    category: "general",
    type: "text",
    defaultValue: "09:00 - 18:00",
    sortOrder: 11
  },
  {
    key: "store_weekend_hours",
    label: "Jam Weekend",
    description: "Jam operasional weekend",
    category: "general",
    type: "text",
    defaultValue: "10:00 - 16:00",
    sortOrder: 12
  },
  {
    key: "store_closed_holidays",
    label: "Tutup Hari Libur",
    description: "Status tutup saat libur",
    category: "general",
    type: "boolean",
    defaultValue: "false",
    sortOrder: 13
  },
  {
    key: "min_order_amount",
    label: "Minimum Order",
    description: "Nilai minimum order",
    category: "general",
    type: "number",
    defaultValue: "25000",
    sortOrder: 14
  },
  {
    key: "free_shipping_min",
    label: "Minimum Gratis Ongkir",
    description: "Ambang gratis ongkir",
    category: "shipping",
    type: "number",
    defaultValue: "500000",
    sortOrder: 15
  },
  {
    key: "shipping_enable_free_shipping",
    label: "Aktifkan Gratis Ongkir",
    description: "Status gratis ongkir",
    category: "shipping",
    type: "boolean",
    defaultValue: "true",
    sortOrder: 16
  },
  {
    key: "notifications_new_order",
    label: "Notifikasi Order Baru",
    description: "Notifikasi email order baru",
    category: "notifications",
    type: "boolean",
    defaultValue: "true",
    sortOrder: 17
  },
  {
    key: "notifications_order_status",
    label: "Notifikasi Status Order",
    description: "Notifikasi perubahan status",
    category: "notifications",
    type: "boolean",
    defaultValue: "true",
    sortOrder: 18
  },
  {
    key: "notifications_low_stock",
    label: "Notifikasi Stok Menipis",
    description: "Notifikasi stok menipis",
    category: "notifications",
    type: "boolean",
    defaultValue: "true",
    sortOrder: 19
  },
  {
    key: "notifications_customer_messages",
    label: "Notifikasi Pesan Pelanggan",
    description: "Notifikasi pesan pelanggan",
    category: "notifications",
    type: "boolean",
    defaultValue: "true",
    sortOrder: 20
  },
  {
    key: "notifications_additional_emails",
    label: "Email Tambahan",
    description: "Email tambahan",
    category: "notifications",
    type: "text",
    defaultValue: "",
    sortOrder: 21
  },
  {
    key: "bank_name",
    label: "Nama Bank",
    description: "Nama bank",
    category: "payment",
    type: "text",
    defaultValue: "Bank Central Asia (BCA)",
    sortOrder: 22
  },
  {
    key: "bank_account_number",
    label: "Nomor Rekening",
    description: "Nomor rekening",
    category: "payment",
    type: "text",
    defaultValue: "1234567890",
    sortOrder: 23
  },
  {
    key: "bank_account_name",
    label: "Nama Pemilik Rekening",
    description: "Nama pemilik rekening",
    category: "payment",
    type: "text",
    defaultValue: "PT PITAYA INDONESIA",
    sortOrder: 24
  },
  {
    key: "bank_branch",
    label: "Cabang Bank",
    description: "Cabang bank",
    category: "payment",
    type: "text",
    defaultValue: "Jakarta Sudirman",
    sortOrder: 25
  }
];

const siteSettingsMeta: SettingMeta[] = [
  {
    key: "site_theme",
    label: "Tema Situs",
    description: "Tema tampilan",
    category: "appearance",
    type: "text",
    defaultValue: "default",
    sortOrder: 1
  },
  {
    key: "site_show_hero",
    label: "Tampilkan Hero",
    description: "Hero di homepage",
    category: "appearance",
    type: "boolean",
    defaultValue: "true",
    sortOrder: 2
  },
  {
    key: "site_show_featured",
    label: "Tampilkan Produk Unggulan",
    description: "Section produk unggulan",
    category: "appearance",
    type: "boolean",
    defaultValue: "true",
    sortOrder: 3
  },
  {
    key: "site_show_categories",
    label: "Tampilkan Kategori",
    description: "Section kategori",
    category: "appearance",
    type: "boolean",
    defaultValue: "true",
    sortOrder: 4
  },
  {
    key: "site_show_testimonials",
    label: "Tampilkan Testimoni",
    description: "Section testimoni",
    category: "appearance",
    type: "boolean",
    defaultValue: "true",
    sortOrder: 5
  }
];

const storeSettingsLookup = storeSettingsMeta.reduce((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {} as Record<string, SettingMeta>);

const siteSettingsLookup = siteSettingsMeta.reduce((acc, item) => {
  acc[item.key] = item;
  return acc;
}, {} as Record<string, SettingMeta>);

function parseSettingValue(meta: SettingMeta, value: string | null) {
  if (meta.type === "boolean") {
    return value === "true";
  }
  if (meta.type === "number") {
    if (value === null || value === "") {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return value ?? "";
}

function serializeSettingValue(meta: SettingMeta, value: unknown) {
  if (meta.type === "boolean") {
    return value ? "true" : "false";
  }
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

export class SettingsRepository {
  async fetchStoreSettings() {
    return db.select().from(storeSettings);
  }

  async fetchSiteSettings() {
    return db.select().from(siteSettings);
  }

  async insertStoreSettings(values: SettingMeta[]) {
    if (!values.length) {
      return;
    }
    await db.insert(storeSettings).values(
      values.map((item) => ({
        key: item.key,
        value: item.defaultValue,
        label: item.label,
        description: item.description,
        type: item.type,
        category: item.category,
        sortOrder: item.sortOrder
      }))
    );
  }

  async insertSiteSettings(values: SettingMeta[]) {
    if (!values.length) {
      return;
    }
    await db.insert(siteSettings).values(
      values.map((item) => ({
        key: item.key,
        value: item.defaultValue,
        label: item.label,
        description: item.description,
        type: item.type,
        category: item.category,
        sortOrder: item.sortOrder
      }))
    );
  }

  async updateStoreSetting(key: string, value: string) {
    await db
      .update(storeSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(storeSettings.key, key));
  }

  async updateSiteSetting(key: string, value: string) {
    await db
      .update(siteSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteSettings.key, key));
  }

  async fetchShippingProviders() {
    return db.select().from(shippingProviders).orderBy(shippingProviders.id);
  }

  async fetchPaymentMethods() {
    return db.select().from(paymentMethods).orderBy(paymentMethods.id);
  }

  async fetchShippingZones() {
    return db.select().from(shippingZones).orderBy(shippingZones.id);
  }

  async updateShippingProvider(id: number, isActive: boolean) {
    await db
      .update(shippingProviders)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(shippingProviders.id, id));
  }

  async updatePaymentMethod(id: number, isActive: boolean) {
    await db
      .update(paymentMethods)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(paymentMethods.id, id));
  }
}

export class SettingsService {
  constructor(private readonly repository = new SettingsRepository()) {}

  async getSettings(): Promise<SettingsResponse> {
    let storeRows = await this.repository.fetchStoreSettings();
    const storeKeys = new Set(storeRows.map((item) => item.key));
    const missingStoreMeta = storeSettingsMeta.filter((item) => !storeKeys.has(item.key));
    if (missingStoreMeta.length) {
      await this.repository.insertStoreSettings(missingStoreMeta);
      storeRows = await this.repository.fetchStoreSettings();
    }

    let siteRows = await this.repository.fetchSiteSettings();
    const siteKeys = new Set(siteRows.map((item) => item.key));
    const missingSiteMeta = siteSettingsMeta.filter((item) => !siteKeys.has(item.key));
    if (missingSiteMeta.length) {
      await this.repository.insertSiteSettings(missingSiteMeta);
      siteRows = await this.repository.fetchSiteSettings();
    }

    const storeSettingsData: Record<string, string | boolean | number | null> = {};
    storeRows.forEach((row) => {
      const meta = storeSettingsLookup[row.key];
      if (meta) {
        storeSettingsData[row.key] = parseSettingValue(meta, row.value);
      }
    });

    const siteSettingsData: Record<string, string | boolean | number | null> = {};
    siteRows.forEach((row) => {
      const meta = siteSettingsLookup[row.key];
      if (meta) {
        siteSettingsData[row.key] = parseSettingValue(meta, row.value);
      }
    });

    const shippingRows = await this.repository.fetchShippingProviders();
    const paymentRows = await this.repository.fetchPaymentMethods();
    const shippingZoneRows = await this.repository.fetchShippingZones();

    return {
      storeSettings: storeSettingsData,
      siteSettings: siteSettingsData,
      shippingProviders: shippingRows.map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        type: null,
        isActive: item.isActive
      })),
      paymentMethods: paymentRows.map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        type: item.type ?? null,
        isActive: item.isActive
      })),
      shippingZones: shippingZoneRows.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description ?? null,
        area: Array.isArray(item.area) ? item.area : [],
        isActive: item.isActive
      }))
    };
  }

  async updateStoreSettings(values: StoreSettingsPayload) {
    if (!values) {
      return;
    }
    const entries = Object.entries(values).filter(([key]) => storeSettingsLookup[key]);
    if (!entries.length) {
      return;
    }
    for (const [key, value] of entries) {
      const meta = storeSettingsLookup[key];
      const serialized = serializeSettingValue(meta, value);
      await this.repository.updateStoreSetting(key, serialized);
    }
  }

  async updateSiteSettings(values: SiteSettingsPayload) {
    if (!values) {
      return;
    }
    const entries = Object.entries(values).filter(([key]) => siteSettingsLookup[key]);
    if (!entries.length) {
      return;
    }
    for (const [key, value] of entries) {
      const meta = siteSettingsLookup[key];
      const serialized = serializeSettingValue(meta, value);
      await this.repository.updateSiteSetting(key, serialized);
    }
  }

  async updateShippingProviders(values: TogglePayload) {
    if (!values?.length) {
      return;
    }
    for (const item of values) {
      await this.repository.updateShippingProvider(item.id, item.isActive);
    }
  }

  async updatePaymentMethods(values: TogglePayload) {
    if (!values?.length) {
      return;
    }
    for (const item of values) {
      await this.repository.updatePaymentMethod(item.id, item.isActive);
    }
  }

  async updateSettings(params: UpdateSettingsPayload) {
    await this.updateStoreSettings(params.storeSettings || {});
    await this.updateSiteSettings(params.siteSettings || {});
    await this.updateShippingProviders(params.shippingProviders || []);
    await this.updatePaymentMethods(params.paymentMethods || []);
  }
}
