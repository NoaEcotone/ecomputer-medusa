import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260202140839 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_attributes" ("id" text not null, "product_id" text not null, "processor_type" text null, "processor_family" text check ("processor_family" in ('intel-core-i5', 'intel-core-i7', 'intel-core-i9', 'intel-core-ultra-7', 'ryzen-5', 'other')) null, "ram_size" integer null, "storage_capacity" integer null, "storage_type" text check ("storage_type" in ('SSD', 'NVMe', 'M.2 NVMe')) null, "screen_size" integer null, "screen_resolution" text null, "graphics_type" text check ("graphics_type" in ('Geïntegreerd', 'Dedicated')) null, "graphics_card" text null, "condition" text check ("condition" in ('Nieuw', 'Renewed')) null, "operating_system" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_attributes_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_attributes_product_id" ON "product_attributes" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_attributes_deleted_at" ON "product_attributes" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_attributes" cascade;`);
  }

}
