export type SettingValue = string | boolean | number | null;

export type SettingsRecord = Record<string, SettingValue>;

export type SettingToggleDto = {
  id: number;
  name: string;
  code: string | null;
  type: string | null;
  isActive: boolean;
};

export type ShippingZoneDto = {
  id: number;
  name: string;
  description: string | null;
  area: string[];
  isActive: boolean;
};

export type SettingsResponse = {
  storeSettings: SettingsRecord;
  siteSettings: SettingsRecord;
  shippingProviders: SettingToggleDto[];
  paymentMethods: SettingToggleDto[];
  shippingZones: ShippingZoneDto[];
};

export type TogglePayload = { id: number; isActive: boolean }[];

export type StoreSettingsPayload = Record<string, string | boolean | number | null | undefined>;

export type SiteSettingsPayload = Record<string, string | boolean | number | null | undefined>;

export type UpdateSettingsPayload = {
  storeSettings?: StoreSettingsPayload;
  siteSettings?: SiteSettingsPayload;
  shippingProviders?: TogglePayload;
  paymentMethods?: TogglePayload;
};
