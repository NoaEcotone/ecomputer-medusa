# Product Attributes Module - Registratie Instructies

## 📦 Module Structuur

De module is aangemaakt in: `C:\ecomputer\ecomputer\backend\src\modules\product-attributes\`

**Bestanden:**
- `models/product-attributes.ts` - Data model definitie
- `service.ts` - Service met CRUD operaties
- `index.ts` - Module definitie en export

---

## ⚙️ Stap 1: Registreer de Module

Open het bestand `C:\ecomputer\ecomputer\backend\medusa-config.ts` en voeg de module toe aan de configuratie.

**Zoek naar de `modules` array** (of maak deze aan als die er niet is) en voeg het volgende toe:

```typescript
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    // ... bestaande configuratie
  },
  modules: [
    {
      resolve: "./src/modules/product-attributes",
    },
  ],
})
```

**Als je al andere modules hebt**, voeg deze dan toe aan de bestaande array:

```typescript
modules: [
  {
    resolve: "./src/modules/product-attributes",
  },
  // ... andere modules
],
```

---

## 🗄️ Stap 2: Genereer Database Migratie

Open een **Command Prompt** of **PowerShell** in de backend directory:

```bash
cd C:\ecomputer\ecomputer\backend
```

Voer het volgende commando uit om de migratie te genereren:

```bash
pnpm medusa db:generate productAttributes
```

Dit commando:
- ✅ Genereert een migratie bestand in `src/modules/product-attributes/migrations/`
- ✅ Definieert de `product_attributes` tabel structuur

---

## 🚀 Stap 3: Voer Migratie Uit

Voer de migratie uit om de tabel aan te maken in de database:

```bash
pnpm medusa db:migrate
```

Dit commando:
- ✅ Maakt de `product_attributes` tabel aan in PostgreSQL
- ✅ Voegt alle kolommen toe (processor_type, ram_size, etc.)

---

## ✅ Stap 4: Herstart de Backend

Stop de backend server (Ctrl+C) en start deze opnieuw:

```bash
pnpm dev
```

De module is nu geregistreerd en klaar voor gebruik!

---

## 🔍 Verificatie

Je kunt controleren of de module correct is geregistreerd door:

1. **Backend logs** te checken tijdens het opstarten - je zou geen errors moeten zien
2. **Database** te checken - de `product_attributes` tabel zou moeten bestaan
3. **Later:** Via de import script zullen we de module gebruiken

---

## 📝 Module Gebruik

De module service is nu beschikbaar als `productAttributes` in de Medusa container.

**Voorbeeld gebruik in een API route of workflow:**

```typescript
const productAttributesService = container.resolve("productAttributes")

// Create attributes
await productAttributesService.createProductAttributes({
  product_id: "prod_123",
  processor_type: "Intel Core i7-1355U",
  processor_family: "intel-core-i7",
  ram_size: 16,
  storage_capacity: 512,
  storage_type: "NVMe",
  screen_size: 15.6,
  screen_resolution: "1920x1080",
  graphics_type: "Geïntegreerd",
  graphics_card: "Intel Iris Xe Graphics",
  condition: "Nieuw",
  operating_system: "Windows 11 Pro"
})

// Retrieve attributes
const attributes = await productAttributesService.retrieveProductAttributes("attr_id")

// List with filters
const filtered = await productAttributesService.listProductAttributes({
  ram_size: 16,
  processor_family: "intel-core-i7"
})
```

---

## 🎯 Volgende Stap

Na het registreren van de module gaan we verder met **Fase 3: Conversie + Import Script** dat:
- Je Shopify CSV leest
- Producten aanmaakt via Medusa API
- Attributes toevoegt aan elk product
- Metadata toevoegt voor extra specs
