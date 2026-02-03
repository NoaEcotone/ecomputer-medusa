# Ecomputer Setup - Fase 1 Compleet ✅

## Overzicht

De basis infrastructuur voor het Ecomputer laptop verhuur platform is succesvol opgezet. Het systeem bestaat uit een Medusa.js backend met admin dashboard en een Next.js storefront met moderne UI componenten.

## Wat is gebouwd

### Backend (Medusa.js 2.x)

De Medusa backend draait op **http://localhost:9000** en biedt een volledig functioneel admin dashboard voor productbeheer.

**Admin Dashboard Toegang:**
- URL: http://localhost:9000/app
- Email: admin@ecomputer.nl
- Password: supersecret123

**Database Configuratie:**
- PostgreSQL database: `ecomputer_medusa`
- Database user: `medusa_user`
- Alle migraties succesvol uitgevoerd

**Product Collecties:**
Drie collecties zijn aangemaakt voor de laptop categorieën:
- **Budget** (handle: `budget`) - Voor instapmodellen
- **Mid-range** (handle: `mid-range`) - Voor middenklasse laptops
- **High-end** (handle: `high-end`) - Voor premium laptops

**API Configuratie:**
- Publishable API Key: `pk_becd4b2b2789a1bd0fada899acb6be40d4328bfaf93e97d86bf486489264c305`
- CORS geconfigureerd voor lokale ontwikkeling en exposed URLs

### Storefront (Next.js 14 + Tailwind CSS)

De Next.js storefront draait op **http://localhost:3000** met een modern donker thema en blauwe accenten.

**Pagina's:**
- **Homepage** (`/`) - Hero sectie, USP's, uitgelichte producten, "Hoe het werkt"
- **Laptops Catalogus** (`/laptops`) - Productoverzicht met filters (klaar voor producten)
- **Product Detail** (`/laptops/[handle]`) - Gedetailleerde productpagina met specs
- **Over Ons** (`/over-ons`) - Bedrijfsinformatie en missie
- **Contact** (`/contact`) - Contactgegevens en formulier (placeholder)
- **404** - Custom not found pagina

**UI Componenten:**
- `Header` - Navigatie met logo en menu items
- `Footer` - Footer met links en contactinformatie
- `Container` - Responsive max-width wrapper
- `Button` - Primary en secondary button varianten
- `Badge` - Collectie labels (Budget, Mid-range, High-end)
- `SectionHeading` - Sectie titels met subtitel
- `ProductCard` - Product kaart voor grid weergave
- `SpecsTable` - Specificaties tabel voor productdetails

**Design Systeem:**
- Donker thema (bg: #0f1419, secondary: #1a1f26)
- Primaire kleur: Blauw (#3b82f6)
- Typografie: Inter (Google Fonts)
- Responsive breakpoints: sm, md, lg, xl

### Metadata Velden voor Producten

Producten ondersteunen de volgende custom metadata velden voor laptop specificaties:
- `processor` - Processor type (bijv. "Intel Core i5-8250U")
- `ram` - RAM geheugen (bijv. "16GB DDR4")
- `storage` - Opslagcapaciteit (bijv. "512GB SSD")
- `screen_size` - Schermgrootte (bijv. "15.6 inch")
- `screen_resolution` - Schermresolutie (bijv. "1920x1080 Full HD")
- `graphics` - Graphics card (bijv. "Intel UHD Graphics 620")
- `battery_life` - Batterijduur (bijv. "Tot 8 uur")
- `weight` - Gewicht (bijv. "1.8 kg")
- `condition` - Conditie (bijv. "Grade A - Excellent")

## Project Structuur

```
/home/ubuntu/ecomputer/
├── backend/                    # Medusa.js backend
│   ├── src/
│   │   ├── modules/           # Custom modules (voor toekomstige huurlogica)
│   │   ├── api/               # Custom API routes
│   │   └── subscribers/       # Event subscribers
│   ├── medusa-config.ts       # Medusa configuratie
│   ├── .env                   # Environment variabelen
│   └── package.json
│
├── storefront/                 # Next.js storefront
│   ├── app/                   # App Router pagina's
│   │   ├── laptops/           # Catalogus en product detail
│   │   ├── over-ons/          # Over ons pagina
│   │   ├── contact/           # Contact pagina
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── not-found.tsx      # 404 pagina
│   ├── components/            # UI componenten
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Container.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── ProductCard.tsx
│   │   └── SpecsTable.tsx
│   ├── lib/                   # Utilities
│   │   └── medusa-client.ts   # Medusa JS SDK client
│   ├── .env.local             # Environment variabelen
│   └── package.json
│
└── README.md                   # Project documentatie
```

## Hoe te starten

### Backend starten

```bash
cd /home/ubuntu/ecomputer/backend
pnpm dev
```

De backend is beschikbaar op http://localhost:9000

### Storefront starten

Open een nieuwe terminal:

```bash
cd /home/ubuntu/ecomputer/storefront
pnpm dev
```

De storefront is beschikbaar op http://localhost:3000

## Producten toevoegen

Producten kunnen worden toegevoegd via het Medusa admin dashboard:

1. Open http://localhost:9000/app
2. Login met admin@ecomputer.nl / supersecret123
3. Ga naar **Products** → **Create**
4. Vul de basis informatie in:
   - Title (bijv. "HP EliteBook 840 G5")
   - Description (uitgebreide productbeschrijving)
   - Handle (slug voor URL, bijv. "hp-elitebook-840-g5")
   - Collection (Budget, Mid-range, of High-end)
5. Voeg afbeeldingen toe
6. Voeg metadata toe voor specificaties:
   - processor: "Intel Core i5-8250U"
   - ram: "16GB DDR4"
   - storage: "512GB SSD"
   - screen_size: "14 inch"
   - screen_resolution: "1920x1080 Full HD"
   - graphics: "Intel UHD Graphics 620"
   - battery_life: "Tot 8 uur"
   - weight: "1.5 kg"
   - condition: "Grade A - Excellent"
7. Sla het product op

Het product verschijnt automatisch op de storefront.

## Wat is NIET gebouwd (Fase 2+)

De volgende features zijn bewust niet geïmplementeerd in deze fase:

- **Huurperiode logica** - Geen custom pricing per periode
- **Betaalintegratie** - Geen Mollie of andere payment provider
- **Winkelwagen** - Geen cart functionaliteit
- **Checkout flow** - Geen bestelproces
- **Klantaccounts** - Geen registratie/login voor klanten
- **E-mail notificaties** - Geen automatische emails
- **Blog** - Geen content management systeem
- **Voorraad tracking** - Geen beschikbaarheidslogica

Deze features kunnen in latere fases worden toegevoegd.

## Technische Details

### Environment Variabelen

**Backend (.env):**
```
DATABASE_URL=postgres://medusa_user:medusa_password@localhost:5432/ecomputer_medusa
STORE_CORS=http://localhost:8000,http://localhost:3000,https://3000-...,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://9000-...,https://docs.medusajs.com
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
```

**Storefront (.env.local):**
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_becd4b2b2789a1bd0fada899acb6be40d4328bfaf93e97d86bf486489264c305
```

### API Integratie

De storefront gebruikt de Medusa JS SDK om te communiceren met de backend. De client is geconfigureerd met:
- Base URL naar de Medusa backend
- Publishable API key voor authenticatie
- Global headers voor alle requests
- Debug mode in development

## Volgende Stappen

Om verder te gaan met het project:

1. **Producten toevoegen** - Voeg HP laptop producten toe via het admin dashboard
2. **Afbeeldingen verzamelen** - Zoek productafbeeldingen voor de laptops
3. **Content verfijnen** - Verbeter productbeschrijvingen en pagina content
4. **Design aanpassingen** - Pas kleuren, fonts, en layout aan naar wens
5. **Huurlogica plannen** - Ontwerp de custom pricing per huurperiode
6. **Betaalintegratie** - Integreer Mollie voor betalingen (Fase 2)

## Support

Voor vragen of problemen:
- Bekijk de README.md in de root directory
- Raadpleeg de Medusa.js documentatie: https://docs.medusajs.com/
- Raadpleeg de Next.js documentatie: https://nextjs.org/docs

---

**Status**: ✅ Fase 1 Compleet - Fundament klaar voor uitbreiding
