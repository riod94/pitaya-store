CREATE TYPE "public"."voucher_type" AS ENUM('discount', 'shipping');--> statement-breakpoint
ALTER TYPE "public"."payment_method_type" ADD VALUE 'cod_internal_courier' BEFORE 'crypto';--> statement-breakpoint
CREATE TABLE "shipping_zone" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"area" json,
	"shipping_discount" numeric(15, 2) DEFAULT '0',
	"is_active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shipping_zone_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "voucher" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"type" "voucher_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"value" numeric(15, 2),
	"percent" integer,
	"min_order" numeric(15, 2),
	"max_discount" numeric(15, 2),
	"quota" integer,
	"start_date" timestamp,
	"end_date" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "voucher_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shipping_discount_amount" numeric(15, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "voucher_id" integer;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shipping_voucher_id" integer;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "shipping_zone_id" integer;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_voucher_id_voucher_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."voucher"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_shipping_voucher_id_voucher_id_fk" FOREIGN KEY ("shipping_voucher_id") REFERENCES "public"."voucher"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_shipping_zone_id_shipping_zone_id_fk" FOREIGN KEY ("shipping_zone_id") REFERENCES "public"."shipping_zone"("id") ON DELETE no action ON UPDATE no action;