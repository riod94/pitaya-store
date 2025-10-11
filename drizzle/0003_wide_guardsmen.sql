ALTER TYPE "public"."payment_method_type" ADD VALUE 'qris';--> statement-breakpoint
CREATE TABLE "qris_setting" (
	"id" serial PRIMARY KEY NOT NULL,
	"merchant_name" text NOT NULL,
	"qr_code_image" text NOT NULL,
	"qr_code_image_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
