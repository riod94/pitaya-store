import postgres from "postgres"
import { relations } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  decimal,
  pgEnum,
  real,
  serial,
  json,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

const connectionString = process.env.DATABASE_URL || ""
const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool)

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'admin', 'super_admin'])
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended'])
export const productStatusEnum = pgEnum('product_status', ['active', 'inactive', 'discontinued'])
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
export const platformStatusEnum = pgEnum('platform_status', ['active', 'inactive'])
export const paymentMethodTypeEnum = pgEnum('payment_method_type', [
  'bank_transfer',
  'e_wallet',
  'credit_card',
  'debit_card',
  'cash_on_delivery',
  'cod_internal_courier', // metode baru
  'crypto',
  'virtual_account',
])
export const providerStatusEnum = pgEnum('provider_status', ['active', 'inactive'])
export const settingTypeEnum = pgEnum('setting_type', ['text', 'number', 'boolean', 'json', 'image', 'color'])

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  profilePictureUrl: text("profile_picture_url"),
  role: userRoleEnum("role").notNull().default('customer'),
  status: userStatusEnum("status").notNull().default('active'),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Platforms untuk multi-channel orders
export const platforms = pgTable("platform", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  logo: text("logo").notNull(),
  color: text("color").notNull(),
  status: platformStatusEnum("status").notNull().default('active'),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Kategori produk
export const categories = pgTable("category", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Satuan produk
export const units = pgTable("unit", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // pcs, kg, liter, meter, dll
  symbol: text("symbol").notNull(), // pcs, kg, L, m
  description: text("description"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Tabel produk utama
export const products = pgTable("product", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  categoryId: integer("category_id").references(() => categories.id),
  unitId: integer("unit_id").references(() => units.id),

  // Harga
  costPrice: decimal("cost_price", { precision: 15, scale: 2 }).notNull(), // Harga pokok/beli
  hpp: decimal("hpp", { precision: 15, scale: 2 }).notNull(), // Harga Pokok Penjualan
  sellingPrice: decimal("selling_price", { precision: 15, scale: 2 }).notNull(), // Harga jual

  // Fisik produk
  weight: real("weight"), // dalam gram
  dimensions: json("dimensions").$type<{ length?: number, width?: number, height?: number }>(),

  // Stok
  stockQuantity: integer("stock_quantity").notNull().default(0),
  minStockLevel: integer("min_stock_level").default(0),
  maxStockLevel: integer("max_stock_level"),

  // Media
  images: json("images").$type<string[]>().default([]),
  thumbnailUrl: text("thumbnail_url"),

  // Status dan metadata
  status: productStatusEnum("status").notNull().default('active'),
  isTrackingStock: boolean("is_tracking_stock").notNull().default(true),
  allowBackorder: boolean("allow_backorder").notNull().default(false),
  featured: boolean("featured").notNull().default(false),

  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Varian produk (warna, ukuran, dll)
export const productVariants = pgTable("product_variant", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(), // Contoh: "Merah - Size L"

  // Atribut varian
  attributes: json("attributes").$type<Record<string, string>>(), // {color: "red", size: "L"}

  // Harga khusus varian (opsional, jika berbeda dari produk utama)
  costPrice: decimal("cost_price", { precision: 15, scale: 2 }),
  hpp: decimal("hpp", { precision: 15, scale: 2 }),
  sellingPrice: decimal("selling_price", { precision: 15, scale: 2 }),

  // Stok varian
  stockQuantity: integer("stock_quantity").notNull().default(0),
  weight: real("weight"), // berat khusus varian jika berbeda

  // Media varian
  images: json("images").$type<string[]>().default([]),
  thumbnailUrl: text("thumbnail_url"),

  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Alamat customer
export const addresses = pgTable("address", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // home, office, billing, shipping
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone"),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default('Indonesia'),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Tabel orders
export const orders = pgTable("order", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id").references(() => users.id), // null jika guest order
  platformId: integer("platform_id").notNull().references(() => platforms.id),

  // Customer info (untuk guest orders atau backup)
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),

  // Alamat pengiriman
  shippingAddress: json("shipping_address").$type<{
    recipientName: string;
    recipientPhone?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>().notNull(),

  // Alamat billing (jika berbeda)
  billingAddress: json("billing_address").$type<{
    recipientName: string;
    recipientPhone?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>(),

  // Harga
  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 15, scale: 2 }).notNull().default('0'),
  taxAmount: decimal("tax_amount", { precision: 15, scale: 2 }).notNull().default('0'),
  discountAmount: decimal("discount_amount", { precision: 15, scale: 2 }).notNull().default('0'),
  shippingDiscountAmount: decimal("shipping_discount_amount", { precision: 15, scale: 2 }).notNull().default('0'), // diskon ongkir dari voucher

  // Biaya tambahan (opsional)
  transactionFee: decimal("transaction_fee", { precision: 15, scale: 2 }).default('0'), // Biaya transaksi
  serviceFee: decimal("service_fee", { precision: 15, scale: 2 }).default('0'), // Biaya layanan
  otherFees: decimal("other_fees", { precision: 15, scale: 2 }).default('0'), // Biaya lainnya

  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),

  // Status dan tracking
  status: orderStatusEnum("status").notNull().default('pending'),
  paymentStatus: text("payment_status").notNull().default('pending'), // pending, paid, failed, refunded
  fulfillmentStatus: text("fulfillment_status").notNull().default('unfulfilled'), // unfulfilled, partial, fulfilled

  // Payment Method Reference
  paymentMethodId: integer("payment_method_id").references(() => paymentMethods.id),
  voucherId: integer("voucher_id").references(() => vouchers.id), // voucher belanja
  shippingVoucherId: integer("shipping_voucher_id").references(() => vouchers.id), // voucher ongkir
  shippingZoneId: integer("shipping_zone_id").references(() => shippingZones.id), // shipping zone untuk validasi COD Internal Courier

  // Shipping info
  shippingMethod: text("shipping_method"),
  trackingNumber: text("tracking_number"),
  shippingProviderId: integer("shipping_provider_id").references(() => shippingProviders.id), // Reference ke shipping provider
  shippingProvider: text("shipping_provider"), // Fallback untuk legacy data

  // Notes
  customerNotes: text("customer_notes"),
  adminNotes: text("admin_notes"),
  note: text("note"), // Catatan tambahan yang bersifat opsional

  // Timestamps
  orderDate: timestamp("order_date").notNull().defaultNow(),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  cancelledAt: timestamp("cancelled_at"),

  // Admin yang membuat order (jika manual)
  createdByUserId: text("created_by_user_id").references(() => users.id),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Item dalam order
export const orderItems = pgTable("order_item", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id),
  productVariantId: integer("product_variant_id").references(() => productVariants.id),

  // Snapshot data saat order (harga bisa berubah)
  productName: text("product_name").notNull(),
  productSku: text("product_sku").notNull(),
  variantName: text("variant_name"), // jika ada varian
  variantAttributes: json("variant_attributes").$type<Record<string, string>>(),

  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 15, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 15, scale: 2 }).notNull(),

  // Snapshot weight untuk shipping calculation
  weight: real("weight"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  addresses: many(addresses),
  orders: many(orders),
  createdOrders: many(orders, { relationName: "createdByUser" }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  user: one(users, { fields: [authenticators.userId], references: [users.id] }),
}))

export const platformsRelations = relations(platforms, ({ many }) => ({
  orders: many(orders),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id], relationName: "parentCategory" }),
  children: many(categories, { relationName: "parentCategory" }),
  products: many(products),
}))

export const unitsRelations = relations(units, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  unit: one(units, { fields: [products.unitId], references: [units.id] }),
  variants: many(productVariants),
  orderItems: many(orderItems),
}))

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  orderItems: many(orderItems),
}))

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  platform: one(platforms, { fields: [orders.platformId], references: [platforms.id] }),
  createdByUser: one(users, { fields: [orders.createdByUserId], references: [users.id], relationName: "createdByUser" }),
  orderItems: many(orderItems),
  shippingProvider: one(shippingProviders, { fields: [orders.shippingProviderId], references: [shippingProviders.id] }),
  paymentMethod: one(paymentMethods, { fields: [orders.paymentMethodId], references: [paymentMethods.id] }),
  voucher: one(vouchers, { fields: [orders.voucherId], references: [vouchers.id] }),
  shippingVoucher: one(vouchers, { fields: [orders.shippingVoucherId], references: [vouchers.id] }),
  shippingZone: one(shippingZones, { fields: [orders.shippingZoneId], references: [shippingZones.id] }),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
  productVariant: one(productVariants, { fields: [orderItems.productVariantId], references: [productVariants.id] }),
}))

// Shipping Providers
export const shippingProviders = pgTable("shipping_provider", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Contoh: "JNE", "J&T", "SiCepat"
  code: text("code").notNull().unique(), // Contoh: "jne", "jnt", "sicepat"
  description: text("description"),
  logo: text("logo"), // URL logo provider
  color: text("color"), // Warna provider
  apiUrl: text("api_url"), // API endpoint untuk tracking
  apiKey: text("api_key"), // API key untuk integrasi
  trackingUrlTemplate: text("tracking_url_template"), // Template URL tracking: https://www.jne.co.id/id/tracking/trace/{trackingNumber}
  estimatedDeliveryDays: integer("estimated_delivery_days").default(0), // Estimasi hari pengiriman
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Vouchers (Promosi)
export const voucherTypeEnum = pgEnum('voucher_type', ['discount', 'shipping']);
export const vouchers = pgTable("voucher", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: voucherTypeEnum("type").notNull(), // 'discount' (belanja) atau 'shipping' (ongkir)
  title: text("title").notNull(),
  description: text("description"),
  value: decimal("value", { precision: 15, scale: 2 }), // nilai diskon (nominal)
  percent: integer("percent"), // diskon persentase (0-100)
  minOrder: decimal("min_order", { precision: 15, scale: 2 }), // minimal belanja
  maxDiscount: decimal("max_discount", { precision: 15, scale: 2 }), // maksimal diskon
  quota: integer("quota"), // kuota penggunaan
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Shipping Zones
export const shippingZones = pgTable("shipping_zone", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  area: json("area").$type<string[]>(), // array kodepos/kecamatan/kota
  shippingDiscount: decimal("shipping_discount", { precision: 15, scale: 2 }).default('0'), // diskon ongkir khusus zona ini
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Payment Methods
export const paymentMethods = pgTable("payment_method", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Contoh: "BCA Virtual Account", "GoPay", "OVO"
  type: paymentMethodTypeEnum("type").notNull(),
  code: text("code").notNull().unique(), // Contoh: "bca_va", "gopay", "ovo"
  description: text("description"),
  logo: text("logo"), // URL logo payment method
  color: text("color"), // Warna payment method
  instruction: text("instruction"), // Instruksi pembayaran untuk customer
  fees: decimal("fees", { precision: 15, scale: 2 }).default('0'), // Biaya admin/fee
  feeType: text("fee_type").default('fixed'), // 'fixed' atau 'percentage'
  minAmount: decimal("min_amount", { precision: 15, scale: 2 }), // Minimum transaksi
  maxAmount: decimal("max_amount", { precision: 15, scale: 2 }), // Maximum transaksi
  processingTime: text("processing_time"), // Waktu proses pembayaran
  apiConfig: json("api_config"), // Konfigurasi API untuk payment gateway
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Store Settings
export const storeSettings = pgTable("store_setting", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // Contoh: "store_name", "store_address", "whatsapp_number"
  value: text("value"), // Nilai setting
  label: text("label").notNull(), // Label untuk admin
  description: text("description"), // Deskripsi setting
  type: settingTypeEnum("type").notNull().default('text'), // Tipe input
  category: text("category").notNull(), // Kategori: 'general', 'contact', 'shipping', 'payment'
  isEditable: boolean("is_editable").notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Site Settings (untuk appearance website)
export const siteSettings = pgTable("site_setting", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // Contoh: "primary_color", "secondary_color", "logo", "favicon"
  value: text("value"), // Nilai setting
  label: text("label").notNull(), // Label untuk admin
  description: text("description"), // Deskripsi setting
  type: settingTypeEnum("type").notNull().default('text'), // Tipe input
  category: text("category").notNull(), // Kategori: 'branding', 'layout', 'colors', 'typography'
  isEditable: boolean("is_editable").notNull().default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Relations untuk tabel baru
export const shippingProvidersRelations = relations(shippingProviders, ({ many }) => ({
  orders: many(orders),
}))

export const paymentMethodsRelations = relations(paymentMethods, ({ many }) => ({
  orders: many(orders),
}))