# Rental Module - Test Data Seed Script

## Overzicht

Dit script voegt test data toe aan de rental module zodat je de Admin UI kunt testen met echte data.

## Wat wordt toegevoegd?

### 1. Rental Pricing (7 items)
- **Dell XPS 15** - Flex (€89.99/maand) en Jaar (€69.99/maand)
- **MacBook Pro 14"** - Flex (€129.99/maand) en Jaar (€99.99/maand)
- **Dell 27" Monitor** - Flex (€29.99/maand) en Jaar (€24.99/maand)
- **Docking Station** - Flex (€19.99/maand)

### 2. Rental Contracts (5 items)
- **RC-2026-001** - Actief Flex contract (Dell XPS 15)
- **RC-2026-002** - Actief Jaar contract (MacBook Pro + Docking)
- **RC-2026-003** - In Afwachting (Monitor, borg niet betaald)
- **RC-2025-089** - Beëindigd (succesvol afgerond)
- **RC-2026-004** - Eindigt Binnenkort (opzegtermijn loopt)

### 3. Contract Items (6 items)
Elk contract heeft 1-2 items met:
- Product ID
- Serienummer
- Conditie bij levering
- Conditie bij retour (voor beëindigde contracten)

### 4. Quote Requests (5 items)
- **Tech Startup BV** - Nieuw (5 laptops voor 2 weken)
- **Event Company Amsterdam** - In Behandeling (10 MacBooks voor conferentie)
- **Marketing Bureau Rotterdam** - Offerte Verstuurd (3 MacBooks voor 1 maand)
- **Consultancy Firm Utrecht** - Geaccepteerd (complete setup voor 1 maand)
- **Design Studio Den Haag** - Afgewezen (1 MacBook voor 1 week)

## Gebruik

### Optie 1: Via Medusa CLI (Aanbevolen)

```bash
cd backend
pnpm medusa exec ./src/scripts/seed-rental-data.ts
```

### Optie 2: Via Node.js

```bash
cd backend
node --loader ts-node/esm src/scripts/seed-rental-data.ts
```

## Verificatie

Na het uitvoeren van het script:

1. **Open Admin UI:** `http://localhost:9000/app`

2. **Check Verhuur pagina:**
   - Ga naar Extensions → Verhuur
   - Je zou 5 contracten moeten zien

3. **Check Verhuurprijzen pagina:**
   - Ga naar Extensions → Verhuurprijzen
   - Je zou 7 pricing entries moeten zien

4. **Check Offerte Aanvragen pagina:**
   - Ga naar Extensions → Offerte Aanvragen
   - Je zou 5 quote requests moeten zien
   - Test de status filter

## Data Opschonen

Als je de test data wilt verwijderen:

```sql
-- Verbind met database
psql -d ecomputer_medusa

-- Verwijder alle rental data
DELETE FROM rental_contract_item;
DELETE FROM rental_contract;
DELETE FROM rental_pricing;
DELETE FROM quote_request;
DELETE FROM rental_return;
```

Of via script:

```bash
cd backend
pnpm medusa exec ./src/scripts/clean-rental-data.ts
```

## Troubleshooting

### Error: "rentalModuleService is not defined"

**Oplossing:** Zorg dat de rental module correct geregistreerd is in `medusa-config.ts`:

```typescript
modules: [
  {
    resolve: "./src/modules/rental",
    options: {},
  },
]
```

### Error: "Cannot find module"

**Oplossing:** Zorg dat TypeScript dependencies geïnstalleerd zijn:

```bash
pnpm install ts-node typescript @types/node
```

### Script hangt

**Oplossing:** Check of de Medusa server draait. Het script heeft geen draaiende server nodig, maar de database moet wel bereikbaar zijn.

## Aanpassen

Je kunt het script aanpassen om andere test data toe te voegen:

1. Open `src/scripts/seed-rental-data.ts`
2. Pas de arrays aan (pricings, contracts, quoteRequests)
3. Voeg meer items toe of verwijder items
4. Draai het script opnieuw

**Let op:** Het script voegt data toe zonder duplicaat checking. Als je het meerdere keren draait, krijg je dubbele data.

## Productie

**⚠️ WAARSCHUWING:** Gebruik dit script NIET in productie! Dit is alleen voor development en testing.

Voor productie data:
- Maak een aparte seed script met realistische data
- Gebruik migraties voor initiële data
- Implementeer proper data validatie
