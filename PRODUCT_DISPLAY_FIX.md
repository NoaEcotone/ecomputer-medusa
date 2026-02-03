# Product Display Fix - Ecomputer Storefront

## Probleem
Producten werden niet weergegeven op de "laptops" pagina, ondanks dat er "50 producten beschikbaar" werd getoond.

## Oorzaak
De storefront probeerde product attributes op te halen uit `metadata`, maar de attributes werden opgeslagen in een aparte `product_attributes` tabel via een custom Medusa module. De standaard `/store/products` endpoint stuurt deze custom attributes niet mee.

## Oplossing
Een custom store API endpoint gemaakt die producten met hun attributes combineert en teruggeeft.

## Wijzigingen

### Backend
**Nieuw bestand:** `backend/src/api/store/products-with-attributes/route.ts`

Dit endpoint:
- Haalt alle gepubliceerde producten op via Medusa Query
- Haalt alle product attributes op uit de `product_attributes` tabel
- Combineert beide datasets op basis van `product_id`
- Retourneert producten met hun attributes in één response

**API Endpoint:** `GET /store/products-with-attributes`

**Response format:**
```json
{
  "products": [
    {
      "id": "prod_...",
      "title": "HP EliteBook 840 G8",
      "handle": "hp-elitebook-840-g8",
      "thumbnail": "...",
      "variants": [...],
      "metadata": {...},
      "attributes": {
        "processor_type": "Intel Core i5-1135G7",
        "processor_family": "intel-core-i5",
        "ram_size": 16,
        "storage_capacity": 512,
        "storage_type": "NVMe",
        "screen_size": 14,
        "screen_resolution": "1920x1080",
        "graphics_type": "Geïntegreerd",
        "graphics_card": "Intel Iris Xe Graphics",
        "condition": "Renewed",
        "operating_system": "Windows 11 Pro"
      }
    }
  ],
  "count": 50
}
```

### Frontend
**Gewijzigd bestand:** `storefront/client/src/lib/medusa.ts`

De `getProductsWithAttributes()` functie is aangepast om:
- De nieuwe custom endpoint `/store/products-with-attributes` aan te roepen
- Producten met attributes in één API call op te halen
- Geen aparte mapping meer nodig van metadata naar attributes

## Deployment Instructies

### 1. Backend herstarten
```bash
cd backend
pnpm run dev
```

De nieuwe API route wordt automatisch geladen door Medusa.

### 2. Storefront herstarten
```bash
cd storefront
pnpm run dev
```

### 3. Verificatie
Ga naar `http://localhost:5173/laptops` en controleer of:
- ✅ Producten worden weergegeven in het grid
- ✅ Product specs (processor, RAM, storage, etc.) worden getoond op de productkaarten
- ✅ Het aantal producten klopt (bijv. "50 producten beschikbaar")
- ✅ Filters werken correct (als attributes aanwezig zijn)

## Volgende Stappen

### Product Specs Toevoegen
Als je ziet dat producten wél verschijnen maar **zonder specs**, betekent dit dat de attributes niet correct zijn geïmporteerd in de database. In dat geval moet je:

1. **Controleer of de import script is uitgevoerd:**
   ```bash
   cd backend
   node import-products-fixed.js
   ```

2. **Controleer de database:**
   ```sql
   SELECT * FROM product_attributes LIMIT 5;
   ```

3. **Controleer of de module correct is geregistreerd:**
   - Zie `backend/src/modules/product-attributes/index.ts`
   - Controleer `backend/medusa-config.ts` voor module registratie

### Filter Functionaliteit
De filter functionaliteit is al geïmplementeerd in de frontend (`ProductFilters.tsx`), maar werkt alleen als:
- Products attributes hebben
- De attributes de juiste data types hebben (numbers voor RAM/storage, strings voor processor types, etc.)

## Technische Details

### Medusa Query API
De nieuwe endpoint gebruikt de Medusa Query API om data op te halen:
```typescript
const { data: products } = await query.graph({
  entity: "product",
  fields: ["id", "title", "variants.*", "variants.prices.*"],
  filters: { status: ["published"] },
});
```

### Best Practices
- ✅ Custom endpoints in `/api/store/` voor publieke data
- ✅ Gebruik van Medusa Query voor efficiënte data fetching
- ✅ Proper error handling en logging
- ✅ Type-safe interfaces in de frontend
- ✅ Separation of concerns (attributes vs metadata)

## Troubleshooting

### Producten verschijnen nog steeds niet
1. Check browser console voor errors
2. Check backend logs voor API errors
3. Verify dat de backend draait op `http://localhost:9000`
4. Check `.env` files voor correcte `VITE_MEDUSA_BACKEND_URL`

### Attributes zijn null/undefined
1. Run het import script opnieuw
2. Check of de `product_attributes` module correct is geregistreerd
3. Verify database migrations zijn uitgevoerd

### CORS errors
Als je CORS errors ziet, check `backend/medusa-config.ts`:
```typescript
projectConfig: {
  http: {
    storeCors: "http://localhost:5173",
  }
}
```

## Contact
Voor vragen of problemen, zie de project documentatie of neem contact op met het development team.
