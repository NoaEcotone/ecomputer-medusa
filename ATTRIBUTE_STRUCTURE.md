# Ecomputer Product Attribute Structure

## 📊 Data Analyse Resultaten

**Totaal aantal producten in Shopify export:** 49 laptops

---

## 🎯 Filterbare Product Attributes

Deze attributes worden opgeslagen als **structured fields** in Medusa voor filtering en search functionaliteit.

### 1. **Processor Type** (`processor_type`)
- **Type:** String
- **Aantal unieke waarden:** 17
- **Voorbeelden:** 
  - Intel Core i5-1335U
  - Intel Core i7-11850H
  - Intel Core i9-10885H
  - R5-7535U

### 2. **Processor Family** (`processor_family`)
- **Type:** String (enum)
- **Waarden:**
  - `intel-core-i5`
  - `intel-core-i7`
  - `intel-core-i9`
  - `intel-core-ultra-7`
  - `ryzen-5`

### 3. **RAM Geheugen** (`ram_size`)
- **Type:** Number (GB)
- **Waarden:** 8, 16, 32, 64

### 4. **Opslag Capaciteit** (`storage_capacity`)
- **Type:** Number (GB)
- **Waarden:** 256, 500, 512, 1000 (1TB)

### 5. **Opslag Type** (`storage_type`)
- **Type:** String (enum)
- **Waarden:**
  - `SSD`
  - `NVMe SSD`
  - `M.2 NVMe SSD`
- **Genormaliseerd naar:** `SSD`, `NVMe`, `M.2 NVMe`

### 6. **Schermdiagonaal** (`screen_size`)
- **Type:** Number (inches)
- **Waarden:** 13.3, 14, 15.6, 16, 17.3, 23.8, 24, 27
- **Note:** Monitors (23.8", 24", 27") worden apart behandeld

### 7. **Schermresolutie** (`screen_resolution`)
- **Type:** String
- **Waarden:**
  - `1920x1080` (FHD)
  - `1920x1200` (WUXGA)
  - `2560x1440` (QHD)
  - `2880x1800` (WQXGA)
- **Genormaliseerd:** Alleen cijfers, zonder spaties/symbolen

### 8. **Videokaart Type** (`graphics_type`)
- **Type:** String (enum)
- **Waarden:**
  - `Geïntegreerd` (Intel Iris Xe, Intel UHD, AMD Radeon)
  - `Dedicated` (NVIDIA, AMD dedicated)

### 9. **Videokaart** (`graphics_card`)
- **Type:** String
- **Voorbeelden:**
  - Intel Iris Xe Graphics
  - Intel UHD Graphics
  - AMD Radeon Graphics
  - NVIDIA T1200

### 10. **Conditie** (`condition`)
- **Type:** String (enum)
- **Waarden:**
  - `Nieuw`
  - `Renewed` (refurbished/gereviseerd)

### 11. **Besturingssysteem** (`operating_system`)
- **Type:** String
- **Waarde:** Windows 11 Pro (alle producten)

---

## 📦 Metadata Fields (niet filterbaar)

Deze specs worden opgeslagen als **JSON metadata** voor display-only doeleinden:

- `keyboard_language` - Keyboard Taal
- `keyboard_backlight` - Keyboard Verlichting
- `webcam` - Webcam (Ja/Nee)
- `fingerprint_reader` - Finger Print Reader
- `bluetooth` - Bluetooth
- `wifi` - Draadloos (Wifi)
- `lan` - Netwerk / LAN
- `weight` - Gewicht
- `dimensions` - Afmetingen
- `usb_ports` - USB poorten (object met types)
  - `usb_a` - USB-A poorten
  - `usb_c` - USB-C poorten
  - `thunderbolt_3` - Thunderbolt 3
  - `thunderbolt_4` - Thunderbolt 4
- `hdmi` - HDMI
- `display_port` - Display Poort
- `touchscreen` - Touch Screen
- `speakers` - Speaker
- `original_price` - Nieuwprijs was

---

## 🏗️ Medusa Implementation

### Custom Module Structure

```typescript
// src/modules/product-attributes/models/product-attributes.ts

import { model } from "@medusajs/framework/utils"

const ProductAttributes = model.define("product_attributes", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  
  // Processor
  processor_type: model.text().nullable(),
  processor_family: model.enum([
    "intel-core-i5",
    "intel-core-i7", 
    "intel-core-i9",
    "intel-core-ultra-7",
    "ryzen-5"
  ]).nullable(),
  
  // Memory & Storage
  ram_size: model.number().nullable(),
  storage_capacity: model.number().nullable(),
  storage_type: model.enum(["SSD", "NVMe", "M.2 NVMe"]).nullable(),
  
  // Display
  screen_size: model.number().nullable(),
  screen_resolution: model.text().nullable(),
  
  // Graphics
  graphics_type: model.enum(["Geïntegreerd", "Dedicated"]).nullable(),
  graphics_card: model.text().nullable(),
  
  // General
  condition: model.enum(["Nieuw", "Renewed"]).nullable(),
  operating_system: model.text().nullable(),
})

export default ProductAttributes
```

---

## 🔄 Data Normalisatie Regels

### RAM Geheugen
- `"16GB"` → `16`
- `"32GB"` → `32`

### Opslag Capaciteit
- `"256GB"` → `256`
- `"512GB"` → `512`
- `"1TB"` → `1000`

### Schermdiagonaal
- `"15,6"` → `15.6`
- `"15.6"` → `15.6`
- `"15.6''"` → `15.6`

### Schermresolutie
- `"1920 x  1080 FHD"` → `"1920x1080"`
- `"1920 × 1080  FHD"` → `"1920x1080"`

### Opslag Type
- `"M.2 NVMe SSD"` → `"M.2 NVMe"`
- `"NVMe SSD"` → `"NVMe"`
- `"SSD"` → `"SSD"`

### Videokaart Type
- Als bevat "Intel Iris Xe" of "Intel UHD" of "AMD Radeon" → `"Geïntegreerd"`
- Als bevat "NVIDIA" of "AMD Radeon RX/Pro" → `"Dedicated"`

### Conditie
- `"nieuw"` → `"Nieuw"`
- `"renewed"` → `"Renewed"`

---

## 📝 Next Steps

1. ✅ **Fase 1 voltooid:** Attribute structure gedefinieerd
2. **Fase 2:** Medusa custom module maken
3. **Fase 3:** Conversie script bouwen
4. **Fase 4:** Import testen
5. **Fase 5:** Storefront filtering implementeren (later)
