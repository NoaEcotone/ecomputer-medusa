# Rental Module voor Ecomputer

## Overzicht

De Rental Module is een custom Medusa.js v2 module die verhuurlogica toevoegt aan het Ecomputer platform. De module ondersteunt drie verhuurmodellen: Flex (maandelijks), Jaar (12 maanden), en Offerte (korte termijn).

## Verhuurmodellen

### 1. Flex (maandelijks)
- Minimaal 3 maanden
- Na 3 maanden: elke maand opzegbaar met 1 maand opzegtermijn
- Hogere maandprijs dan Jaar

### 2. Jaar (12 maanden)
- Precies 12 maanden
- Na 12 maanden: verlengen, stoppen, of apparaat overnemen
- Lagere maandprijs (korting omdat klant langer vastlegt)

### 3. Offerte (korte termijn)
- Voor 1 dag tot 4 weken
- Niet in webshop, alleen via aanvraagformulier
- Admin maakt handmatig offerte

### Borg
Bij elk contract betaalt de klant eenmalig een borgbedrag. Dit krijgen ze terug bij inlevering in goede staat. Bij schade kan de borg (deels) ingehouden worden.

## Database Schema

### RentalPricing
Opslag van verhuurprijzen per product.

| Veld | Type | Beschrijving |
|------|------|--------------|
| id | String | Unieke identifier |
| product_id | String | Link naar Medusa Product |
| flex_monthly_price | BigNumber | Maandprijs voor Flex |
| year_monthly_price | BigNumber | Maandprijs voor Jaar |
| deposit_amount | BigNumber | Borgbedrag |
| flex_available | Boolean | Of Flex beschikbaar is |
| year_available | Boolean | Of Jaar beschikbaar is |

### RentalContract
Opslag van verhuurcontracten.

| Veld | Type | Beschrijving |
|------|------|--------------|
| id | String | Unieke identifier |
| contract_number | String | Contractnummer (bijv. EC-2026-00001) |
| customer_id | String | Link naar Medusa Customer |
| type | Enum | flex / jaar / offerte |
| status | Enum | in_afwachting / actief / eindigt_binnenkort / beëindigd / geannuleerd |
| start_date | DateTime | Startdatum |
| end_date | DateTime | Einddatum (nullable) |
| earliest_end_date | DateTime | Vroegst mogelijke einddatum |
| monthly_amount | BigNumber | Maandbedrag |
| deposit_amount | BigNumber | Borgbedrag |
| deposit_paid | Boolean | Of borg betaald is |
| deposit_refunded | Boolean | Of borg terugbetaald is |
| notes | Text | Notities |

### RentalContractItem
Opslag van items in een contract.

| Veld | Type | Beschrijving |
|------|------|--------------|
| id | String | Unieke identifier |
| contract_id | String | Link naar RentalContract |
| product_id | String | Link naar Medusa Product |
| quantity | Number | Aantal |
| serial_number | String | Serienummer (optioneel) |
| condition_on_delivery | String | Conditie bij levering |
| condition_on_return | String | Conditie bij retour |

### RentalReturn
Opslag van retourinformatie.

| Veld | Type | Beschrijving |
|------|------|--------------|
| id | String | Unieke identifier |
| contract_id | String | Link naar RentalContract |
| return_date | DateTime | Retourdatum |
| condition | String | Conditie |
| damage_description | Text | Schadebeschrijving |
| deposit_withheld | BigNumber | Ingehouden borgbedrag |
| withhold_reason | Text | Reden voor inhouden borg |

### QuoteRequest
Opslag van offerte-aanvragen.

| Veld | Type | Beschrijving |
|------|------|--------------|
| id | String | Unieke identifier |
| company_name | String | Bedrijfsnaam |
| contact_person | String | Contactpersoon |
| email | String | E-mailadres |
| phone | String | Telefoonnummer (optioneel) |
| desired_period_start | DateTime | Gewenste startdatum |
| desired_period_end | DateTime | Gewenste einddatum |
| requested_items | JSON | Gewenste items |
| status | Enum | nieuw / in_behandeling / offerte_verstuurd / geaccepteerd / afgewezen |
| notes | Text | Notities |

## API Routes

### Admin API Routes

Alle admin routes vereisen authenticatie.

#### Rental Pricing

**GET** `/admin/rental-pricing`
- Query parameters: `product_id` (optioneel)
- Retourneert: Lijst van rental pricings

**POST** `/admin/rental-pricing`
- Body: RentalPricing object
- Retourneert: Aangemaakte rental pricing

**GET** `/admin/rental-pricing/:id`
- Retourneert: Specifieke rental pricing

**POST** `/admin/rental-pricing/:id`
- Body: Update velden
- Retourneert: Geüpdatete rental pricing

**DELETE** `/admin/rental-pricing/:id`
- Retourneert: Confirmation

#### Rental Contracts

**GET** `/admin/rental-contracts`
- Query parameters: `customer_id`, `status`, `type` (allemaal optioneel)
- Retourneert: Lijst van rental contracts

**POST** `/admin/rental-contracts`
- Body: RentalContract object + optioneel items array
- Retourneert: Aangemaakt rental contract (+ items)

**GET** `/admin/rental-contracts/:id`
- Retourneert: Specifiek rental contract + items

**POST** `/admin/rental-contracts/:id`
- Body: Update velden
- Retourneert: Geüpdatet rental contract

**DELETE** `/admin/rental-contracts/:id`
- Retourneert: Confirmation (verwijdert ook items)

#### Rental Returns

**GET** `/admin/rental-returns`
- Query parameters: `contract_id` (optioneel)
- Retourneert: Lijst van rental returns

**POST** `/admin/rental-returns`
- Body: RentalReturn object
- Retourneert: Aangemaakte rental return

#### Quote Requests

**GET** `/admin/quote-requests`
- Query parameters: `status` (optioneel)
- Retourneert: Lijst van quote requests

**POST** `/admin/quote-requests`
- Body: QuoteRequest object
- Retourneert: Aangemaakte quote request

**GET** `/admin/quote-requests/:id`
- Retourneert: Specifieke quote request

**POST** `/admin/quote-requests/:id`
- Body: Update velden
- Retourneert: Geüpdatete quote request

**DELETE** `/admin/quote-requests/:id`
- Retourneert: Confirmation

## Installatie & Setup

### 1. Clone Repository
```bash
git clone https://github.com/NoaEcotone/ecomputer-medusa.git
cd ecomputer-medusa/backend
```

### 2. Installeer Dependencies
```bash
pnpm install
```

### 3. Database Setup
Zorg dat PostgreSQL draait en configureer `.env`:
```
DATABASE_URL=postgres://user:password@localhost:5432/ecomputer_medusa
```

### 4. Run Migrations
```bash
pnpm medusa db:migrate
```

### 5. Start Development Server
```bash
pnpm dev
```

De server draait nu op `http://localhost:9000`

## Gebruik in Code

### Service Injecteren

In API routes of workflows:

```typescript
const rentalModuleService = req.scope.resolve("rental")
```

### Rental Pricing Aanmaken

```typescript
const pricing = await rentalModuleService.createRentalPricings({
  product_id: "prod_123",
  flex_monthly_price: 99.99,
  year_monthly_price: 79.99,
  deposit_amount: 500.00,
  flex_available: true,
  year_available: true
})
```

### Rental Contract Aanmaken

```typescript
const contract = await rentalModuleService.createRentalContracts({
  contract_number: "EC-2026-00001",
  customer_id: "cust_123",
  type: "flex",
  status: "in_afwachting",
  start_date: new Date("2026-02-04"),
  earliest_end_date: new Date("2026-05-04"),
  monthly_amount: 99.99,
  deposit_amount: 500.00,
  deposit_paid: false,
  deposit_refunded: false,
  notes: "Test contract"
})
```

### Contract Items Toevoegen

```typescript
const item = await rentalModuleService.createRentalContractItems({
  contract_id: contract.id,
  product_id: "prod_123",
  quantity: 1,
  serial_number: "SN123456",
  condition_on_delivery: "Grade A"
})
```

### Rental Return Registreren

```typescript
const rentalReturn = await rentalModuleService.createRentalReturns({
  contract_id: contract.id,
  return_date: new Date(),
  condition: "Grade B",
  damage_description: "Minor scratches on lid",
  deposit_withheld: 50.00,
  withhold_reason: "Minor cosmetic damage"
})
```

### Quote Request Aanmaken

```typescript
const quoteRequest = await rentalModuleService.createQuoteRequests({
  company_name: "Tech Corp",
  contact_person: "John Doe",
  email: "john@techcorp.com",
  phone: "+31612345678",
  desired_period_start: new Date("2026-03-01"),
  desired_period_end: new Date("2026-03-15"),
  requested_items: [
    { product_id: "prod_123", quantity: 5 },
    { product_id: "prod_456", quantity: 3 }
  ],
  status: "nieuw",
  notes: "Need laptops for conference"
})
```

## Module Structuur

```
backend/src/modules/rental/
├── index.ts                          # Module definition
├── service.ts                        # Module service
├── models/
│   ├── rental-pricing.ts            # Rental pricing model
│   ├── rental-contract.ts           # Rental contract model
│   ├── rental-contract-item.ts      # Contract items model
│   ├── rental-return.ts             # Returns model
│   └── quote-request.ts             # Quote requests model
└── migrations/
    └── Migration20260204080915.ts   # Auto-generated migration

backend/src/api/admin/
├── rental-pricing/
│   ├── route.ts                     # List & create pricing
│   └── [id]/route.ts                # Get, update, delete pricing
├── rental-contracts/
│   ├── route.ts                     # List & create contracts
│   └── [id]/route.ts                # Get, update, delete contracts
├── rental-returns/
│   └── route.ts                     # List & create returns
└── quote-requests/
    ├── route.ts                     # List & create quote requests
    └── [id]/route.ts                # Get, update, delete quote requests
```

## Volgende Stappen

De rental module is nu volledig functioneel voor data opslag en basis CRUD operaties. De volgende stappen zijn:

1. **Workflows implementeren** - Complexe business logic voor contractbeheer
2. **Admin Dashboard Widgets** - UI voor rental management in Medusa Admin
3. **Storefront Integratie** - Toon verhuurprijzen en opties in de webshop
4. **Betaalintegratie** - Koppel met Mollie voor betalingen
5. **E-mail Notificaties** - Stuur automatische e-mails bij contractwijzigingen
6. **Automatische Status Updates** - Scheduled jobs voor contract status management

## Testing

Zie `RENTAL_MODULE_TEST_RESULTS.md` voor gedetailleerde test resultaten.

## Support

Voor vragen of problemen, neem contact op via het Ecomputer team.
