import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260204080915 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "rental_contract" drop constraint if exists "rental_contract_contract_number_unique";`);
    this.addSql(`create table if not exists "quote_request" ("id" text not null, "company_name" text not null, "contact_person" text not null, "email" text not null, "phone" text null, "desired_period_start" timestamptz not null, "desired_period_end" timestamptz not null, "requested_items" jsonb not null, "status" text check ("status" in ('nieuw', 'in_behandeling', 'offerte_verstuurd', 'geaccepteerd', 'afgewezen')) not null default 'nieuw', "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "quote_request_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_quote_request_deleted_at" ON "quote_request" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rental_contract" ("id" text not null, "contract_number" text not null, "customer_id" text not null, "type" text check ("type" in ('flex', 'jaar', 'offerte')) not null, "status" text check ("status" in ('in_afwachting', 'actief', 'eindigt_binnenkort', 'beëindigd', 'geannuleerd')) not null default 'in_afwachting', "start_date" timestamptz not null, "end_date" timestamptz null, "earliest_end_date" timestamptz not null, "monthly_amount" numeric not null, "deposit_amount" numeric not null, "deposit_paid" boolean not null default false, "deposit_refunded" boolean not null default false, "notes" text null, "raw_monthly_amount" jsonb not null, "raw_deposit_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_contract_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rental_contract_contract_number_unique" ON "rental_contract" ("contract_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_contract_contract_number" ON "rental_contract" ("contract_number") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_contract_customer_id" ON "rental_contract" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_contract_deleted_at" ON "rental_contract" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rental_contract_item" ("id" text not null, "contract_id" text not null, "product_id" text not null, "quantity" integer not null default 1, "serial_number" text null, "condition_on_delivery" text null, "condition_on_return" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_contract_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_contract_item_contract_id" ON "rental_contract_item" ("contract_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_contract_item_product_id" ON "rental_contract_item" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_contract_item_deleted_at" ON "rental_contract_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rental_pricing" ("id" text not null, "product_id" text not null, "flex_monthly_price" numeric null, "year_monthly_price" numeric null, "deposit_amount" numeric null, "flex_available" boolean not null default false, "year_available" boolean not null default false, "raw_flex_monthly_price" jsonb null, "raw_year_monthly_price" jsonb null, "raw_deposit_amount" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_pricing_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_pricing_product_id" ON "rental_pricing" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_pricing_deleted_at" ON "rental_pricing" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rental_return" ("id" text not null, "contract_id" text not null, "return_date" timestamptz not null, "condition" text not null, "damage_description" text null, "deposit_withheld" numeric not null default 0, "withhold_reason" text null, "raw_deposit_withheld" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_return_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_return_contract_id" ON "rental_return" ("contract_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_return_deleted_at" ON "rental_return" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "quote_request" cascade;`);

    this.addSql(`drop table if exists "rental_contract" cascade;`);

    this.addSql(`drop table if exists "rental_contract_item" cascade;`);

    this.addSql(`drop table if exists "rental_pricing" cascade;`);

    this.addSql(`drop table if exists "rental_return" cascade;`);
  }

}
