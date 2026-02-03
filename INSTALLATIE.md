# Ecomputer Storefront - Installatie Instructies

## 📦 Wat je hebt ontvangen

Een complete Next.js storefront met:
- ✅ Medusa API integratie
- ✅ Product filtering (11 attributes)
- ✅ Zwart-wit design
- ✅ Responsive layout
- ✅ Header & Footer
- ✅ Home & Laptops pagina's

---

## 🚀 Installatie Stappen

### Stap 1: Pak de ZIP uit

Pak `ecomputer-storefront.zip` uit naar een locatie op je computer, bijvoorbeeld:
```
C:\ecomputer\ecomputer-storefront\
```

### Stap 2: Installeer dependencies

Open Command Prompt en navigeer naar de storefront directory:

```bash
cd C:\ecomputer\ecomputer-storefront
pnpm install
```

**Geen pnpm?** Installeer het eerst:
```bash
npm install -g pnpm
```

### Stap 3: Controleer environment variabele

De `.env.local` file is al aanwezig met:
```env
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
```

**Zorg dat je Medusa backend draait op poort 9000!**

### Stap 4: Start de storefront

```bash
cd C:\ecomputer\ecomputer-storefront
pnpm dev
```

De storefront start op: `http://localhost:3000`

---

## ✅ Checklist

Voordat je de storefront start, zorg dat:

1. ✅ **Medusa backend draait** op `http://localhost:9000`
2. ✅ **49 producten zijn geïmporteerd** (via import-products.js)
3. ✅ **Alle producten zijn gekoppeld** aan Default Sales Channel
4. ✅ **Dependencies zijn geïnstalleerd** (`pnpm install`)

---

## 🎯 Wat je nu kunt doen

### Home Page
- Open: `http://localhost:3000`
- Zie de hero sectie met "Bekijk Laptops" button
- Navigatie werkt naar Laptops pagina

### Laptops Page
- Open: `http://localhost:3000/laptops`
- Zie alle 49 laptops
- Gebruik de filters aan de linkerkant:
  - Processor Type
  - RAM Geheugen
  - Opslag Capaciteit & Type
  - Schermgrootte & Resolutie
  - Videokaart Type
  - Conditie

### Filtering
- Selecteer meerdere filters
- Resultaten worden real-time bijgewerkt
- "Wis alles" knop reset alle filters
- Resultaat teller toont aantal matches

---

## 🔧 Troubleshooting

### Probleem: "Geen producten gevonden"

**Mogelijke oorzaken:**
1. Medusa backend draait niet
2. Backend draait op andere poort dan 9000
3. Producten zijn niet geïmporteerd
4. Producten hebben geen sales channel

**Oplossing:**
1. Check of backend draait: `http://localhost:9000/health`
2. Check Admin Dashboard: `http://localhost:9000/app`
3. Verifieer dat producten zichtbaar zijn in Admin
4. Verifieer dat producten gekoppeld zijn aan "Default Sales Channel"

### Probleem: "CORS error" in browser console

**Oplossing:**
Zorg dat je Medusa backend CORS heeft geconfigureerd voor `http://localhost:3000`.

In je `medusa-config.ts`:
```typescript
projectConfig: {
  http: {
    storeCors: "http://localhost:3000",
    // ... rest van config
  }
}
```

### Probleem: Filters tonen geen opties

**Oorzaak:** Product attributes zijn niet correct opgeslagen in metadata.

**Oplossing:** 
1. Open Admin Dashboard
2. Open een product
3. Check bij "Metadata" of de attributes er staan:
   - `processor_type`
   - `ram_size`
   - `storage_capacity`
   - etc.

Als ze er niet staan, voer het import script opnieuw uit.

---

## 📊 Project Structuur

```
ecomputer-storefront/
├── client/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Laptops.tsx
│   │   │   └── NotFound.tsx
│   │   ├── lib/             # Utilities
│   │   │   └── medusa.ts    # Medusa API client
│   │   ├── App.tsx          # Routes
│   │   └── index.css        # Global styles
│   └── index.html
├── .env.local               # Environment variables
├── package.json
└── INSTALLATIE.md           # Deze file
```

---

## 🎨 Design

### Kleurenschema (Zwart-Wit)
- **Achtergrond:** Lichtgrijs (#F9FAFB)
- **Cards:** Wit met grijze border
- **Text:** Zwart voor headings, grijs voor body
- **Hover:** Zwarte border op cards
- **Accent:** Zwart

### Typografie
- **Headings:** Space Grotesk (600)
- **Body:** Inter (400, 500, 600)

### Layout
- **Desktop:** Filters links (sticky), producten rechts (3 kolommen)
- **Tablet:** 2 kolommen producten
- **Mobile:** 1 kolom producten, filters bovenaan

---

## 🔄 Development Workflow

### Start beide servers

**Terminal 1 - Medusa Backend:**
```bash
cd C:\ecomputer\ecomputer\backend
pnpm dev
```

**Terminal 2 - Storefront:**
```bash
cd C:\ecomputer\ecomputer-storefront
pnpm dev
```

### Hot Reload
Beide servers hebben hot reload:
- Backend: Herstart automatisch bij code changes
- Storefront: Vite HMR (instant updates)

---

## ✅ Volgende Stappen

Nu de basis werkt, kun je toevoegen:

1. **Product detail pagina** - Toon alle specs en metadata
2. **Sorting** - Sorteer op prijs, naam, nieuwste
3. **Search** - Zoek op product naam of specs
4. **Images** - Voeg product afbeeldingen toe
5. **Pagination** - Voor betere performance
6. **Shopping cart** - Medusa cart integratie
7. **Checkout** - Complete checkout flow

---

## 📞 Hulp nodig?

Als je errors krijgt of iets niet werkt, check:
1. Browser console (F12 → Console tab)
2. Terminal output (beide servers)
3. Network tab (F12 → Network) voor API calls

Veel succes! 🚀
