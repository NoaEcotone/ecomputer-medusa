# Ecomputer - Laptop Verhuur Platform

Een custom e-commerce webshop voor het verhuren van refurbished/renewed HP laptops, gebouwd met Next.js en Medusa.js.

## 🏗️ Project Structuur

```
ecomputer/
├── backend/          # Medusa.js 2.x backend
│   ├── src/
│   │   ├── modules/  # Custom modules (later: huurlogica)
│   │   ├── api/      # Custom API routes
│   │   └── subscribers/
│   ├── medusa-config.ts
│   └── package.json
│
└── storefront/       # Next.js 14 frontend
    ├── app/          # App Router pagina's
    ├── components/   # Herbruikbare componenten
    ├── lib/          # Utilities en Medusa client
    └── package.json
```

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Medusa.js 2.x
- **Database**: PostgreSQL
- **Package Manager**: pnpm

## 📦 Installatie & Setup

### Vereisten

- Node.js 22+
- PostgreSQL 14+
- pnpm

### Backend Setup

1. Navigeer naar de backend directory:
   ```bash
   cd backend
   ```

2. Installeer dependencies (indien nog niet gebeurd):
   ```bash
   pnpm install
   ```

3. Start de Medusa backend:
   ```bash
   pnpm dev
   ```

   De backend draait op: http://localhost:9000
   Admin dashboard: http://localhost:9000/app

4. Login credentials admin dashboard:
   - Email: admin@ecomputer.nl
   - Password: supersecret123

### Storefront Setup

1. Open een nieuwe terminal en navigeer naar de storefront directory:
   ```bash
   cd storefront
   ```

2. Installeer dependencies (indien nog niet gebeurd):
   ```bash
   pnpm install
   ```

3. Start de Next.js development server:
   ```bash
   pnpm dev
   ```

   De storefront draait op: http://localhost:3000

## 🎨 Design

- **Kleurenschema**: Donker thema met blauwe accenten
- **Typografie**: Inter (Google Fonts)
- **Stijl**: Modern, clean, professioneel

## 📄 Pagina's

### Publieke Pagina's
- **Homepage** (`/`) - Hero, USP's, uitgelichte producten, "Hoe het werkt"
- **Catalogus** (`/laptops`) - Alle laptops met filters
- **Product Detail** (`/laptops/[handle]`) - Productinformatie en specificaties
- **Over Ons** (`/over-ons`) - Bedrijfsinformatie
- **Contact** (`/contact`) - Contactgegevens en formulier (placeholder)
- **404** - Custom not found pagina

## 🧩 Componenten

- `Header` - Navigatie
- `Footer` - Footer met links en contactinfo
- `Container` - Max-width wrapper
- `Button` - Primaire en secundaire buttons
- `Badge` - Collectie labels (Budget, Mid-range, High-end)
- `SectionHeading` - Sectie titels met subtitel
- `ProductCard` - Product kaart voor grid
- `SpecsTable` - Specificaties tabel

## 📊 Product Collecties

- **Budget** - i3/i5, 8GB RAM, 256GB SSD
- **Mid-range** - i5/i7, 16GB RAM, 512GB SSD
- **High-end** - i7/i9, 32-64GB RAM, 512GB-1TB SSD

## 🔧 Custom Metadata Velden

Producten ondersteunen de volgende metadata velden:
- `processor` - Processor type
- `ram` - RAM geheugen
- `storage` - Opslagcapaciteit
- `screen_size` - Schermgrootte
- `screen_resolution` - Schermresolutie
- `graphics` - Graphics card
- `battery_life` - Batterijduur
- `weight` - Gewicht
- `condition` - Conditie (Grade A, B, etc.)

## 📝 Producten Toevoegen

1. Open het Medusa admin dashboard: http://localhost:9000/app
2. Login met de admin credentials
3. Ga naar "Products" en klik op "New Product"
4. Vul de basis informatie in:
   - Title
   - Description
   - Handle (slug)
   - Collection (Budget/Mid-range/High-end)
   - Images
5. Voeg metadata toe voor laptop specificaties
6. Sla het product op

De producten verschijnen automatisch op de storefront.

## 🔮 Toekomstige Features (Fase 2+)

De volgende features zijn **niet** in deze fase gebouwd:
- Huurperiode logica en prijsstructuur
- Betaalintegratie (Mollie)
- Winkelwagen functionaliteit
- Checkout flow
- Klantaccounts & dashboard
- E-mail notificaties
- Blog

## 🛠️ Development

### Backend Development
```bash
cd backend
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm db:migrate   # Run database migrations
```

### Storefront Development
```bash
cd storefront
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 📚 Documentatie

- [Medusa.js Documentation](https://docs.medusajs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📧 Contact

Voor vragen over dit project:
- Email: info@ecomputer.nl
- Telefoon: +31 20 123 4567

---

**Fase 1 Status**: ✅ Fundament compleet
