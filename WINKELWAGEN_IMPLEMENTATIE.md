# Winkelwagen Functionaliteit - Implementatie Documentatie

## Overzicht

De winkelwagen functionaliteit is succesvol toegevoegd aan de eComputer webshop. Deze implementatie maakt gebruik van de Medusa.js Cart API en volgt React/Vite best practices met Context API voor state management.

## ✅ Wat is geïmplementeerd

### 1. **Cart API Functies** (`/storefront/client/src/lib/cart.ts`)
- `createCart()` - Nieuwe winkelwagen aanmaken
- `getCart()` - Bestaande winkelwagen ophalen
- `getOrCreateCart()` - Winkelwagen ophalen of aanmaken
- `addToCart(variantId, quantity)` - Product toevoegen
- `updateCartItem(lineItemId, quantity)` - Aantal bijwerken
- `removeFromCart(lineItemId)` - Product verwijderen
- `clearCart()` - Winkelwagen legen
- `getCartItemCount(cart)` - Totaal aantal items berekenen

**Belangrijke details:**
- Cart ID wordt opgeslagen in `localStorage` voor persistentie
- Automatische error handling en recovery
- Communicatie met Medusa backend via REST API

### 2. **CartContext** (`/storefront/client/src/contexts/CartContext.tsx`)
Global state management voor de winkelwagen met:
- Real-time cart state synchronisatie
- Loading states voor betere UX
- Toast notificaties bij acties (toevoegen, verwijderen, etc.)
- Drawer open/close state management
- Automatisch laden van cart bij app start

**Beschikbare hooks:**
```typescript
const { 
  cart,              // Huidige cart object
  isLoading,         // Loading state
  itemCount,         // Totaal aantal items
  isCartOpen,        // Drawer open/closed
  addToCart,         // Product toevoegen
  updateCartItem,    // Aantal wijzigen
  removeFromCart,    // Product verwijderen
  clearCart,         // Cart legen
  refreshCart,       // Cart vernieuwen
  openCart,          // Drawer openen
  closeCart,         // Drawer sluiten
  toggleCart         // Drawer toggle
} = useCart();
```

### 3. **CartDrawer Component** (`/storefront/client/src/components/CartDrawer.tsx`)
Een moderne slide-in winkelwagen met:
- **Responsive design** - Werkt op mobile, tablet en desktop
- **Product thumbnails** - Visuele weergave van producten
- **Quantity controls** - +/- knoppen voor aantal aanpassen
- **Real-time totalen** - Subtotaal, BTW, verzendkosten, totaal
- **Empty state** - Duidelijke boodschap als cart leeg is
- **Call-to-action** - Link naar contact pagina (geen checkout/betaling)
- **Smooth animations** - Backdrop en slide-in effect

**Features:**
- Backdrop overlay met click-to-close
- Item quantity aanpassen (+ en - knoppen)
- Item verwijderen met trash icon
- Prijs per item en subtotaal
- Totaaloverzicht met breakdown
- Info bericht over huurperiode/betaling (komt later)

### 4. **Header Update** (`/storefront/client/src/components/Header.tsx`)
- **Cart button** met winkelwagen icoon
- **Badge met item count** - Toont aantal producten in cart
- **Click handler** - Opent CartDrawer
- Responsive positionering

### 5. **ProductDetail Update** (`/storefront/client/src/pages/ProductDetail.tsx`)
- **"Toevoegen aan Winkelwagen" knop** - Prominente CTA
- **Loading state** - Spinner tijdens toevoegen
- **Disabled state** - Als geen variant beschikbaar
- **Success feedback** - Toast notificatie + auto-open drawer
- **Info bericht** - Melding over huurperiode/betaling

### 6. **App Integration** (`/storefront/client/src/App.tsx`)
- CartProvider wrapper om hele app
- CartDrawer component toegevoegd
- Global state beschikbaar in alle componenten

## 🎯 Hoe te testen

### Stap 1: Start de applicatie
```bash
cd storefront
pnpm install  # Als je nieuwe dependencies hebt
pnpm dev
```

### Stap 2: Test scenario's

#### ✅ Product toevoegen
1. Ga naar een productpagina (bijv. `/products/hp-elitebook-840-g8`)
2. Klik op **"Toevoegen aan Winkelwagen"**
3. Verwacht:
   - Toast notificatie: "Product toegevoegd aan winkelwagen"
   - CartDrawer opent automatisch
   - Badge in header toont aantal items
   - Product verschijnt in drawer met thumbnail, naam, prijs

#### ✅ Aantal aanpassen
1. Open de winkelwagen (klik op cart icon in header)
2. Gebruik **+ en - knoppen** bij een product
3. Verwacht:
   - Aantal wordt direct bijgewerkt
   - Subtotaal en totaal worden herberekend
   - Geen page refresh nodig

#### ✅ Product verwijderen
1. Open de winkelwagen
2. Klik op **"Verwijderen"** bij een product
3. Verwacht:
   - Toast notificatie: "Product verwijderd uit winkelwagen"
   - Product verdwijnt uit lijst
   - Badge wordt bijgewerkt
   - Als cart leeg is: empty state wordt getoond

#### ✅ Meerdere producten
1. Voeg 3-4 verschillende producten toe
2. Controleer:
   - Badge toont correct totaal aantal items
   - Alle producten staan in drawer
   - Totalen kloppen
   - Scroll werkt in drawer bij veel items

#### ✅ Persistentie
1. Voeg producten toe aan cart
2. Refresh de pagina (F5)
3. Verwacht:
   - Cart blijft behouden (via localStorage)
   - Badge toont nog steeds aantal items
   - Open drawer: alle producten zijn er nog

#### ✅ Empty state
1. Verwijder alle producten uit cart
2. Verwacht:
   - Empty state met icoon en boodschap
   - "Bekijk Laptops" knop
   - Geen totalen sectie

#### ✅ Responsive design
1. Test op verschillende schermformaten:
   - Desktop (1920px+)
   - Tablet (768px - 1024px)
   - Mobile (320px - 767px)
2. Controleer:
   - Drawer width past zich aan
   - Buttons blijven klikbaar
   - Tekst blijft leesbaar

## 🔧 Technische Details

### Medusa Cart API Endpoints
De implementatie gebruikt de volgende Medusa endpoints:

```
POST   /store/carts                          # Cart aanmaken
GET    /store/carts/:id                      # Cart ophalen
POST   /store/carts/:id/line-items           # Item toevoegen
POST   /store/carts/:id/line-items/:item_id  # Item updaten
DELETE /store/carts/:id/line-items/:item_id  # Item verwijderen
```

### Data Flow
```
User Action (ProductDetail)
    ↓
useCart hook (CartContext)
    ↓
cart.ts API function
    ↓
Medusa Backend API
    ↓
Update cart state
    ↓
Re-render components (Header badge, CartDrawer)
```

### LocalStorage
- **Key:** `cart_id`
- **Value:** Medusa cart ID (bijv. `cart_01JKHQVXQX...`)
- **Lifecycle:** Blijft bestaan tot cart wordt geleegd of expired

## 📝 Belangrijke Notities

### ✅ Wat werkt ZONDER betaalintegratie
- Producten toevoegen aan cart
- Aantal aanpassen
- Producten verwijderen
- Cart persistentie
- Totalen berekenen
- Volledige UI/UX flow

### ⏳ Wat LATER komt (zoals gevraagd)
- **Checkout flow** - Nog niet geïmplementeerd
- **Betaalintegratie** - Nog niet geïmplementeerd
- **Huurperiode selectie** - Nog niet geïmplementeerd
- **Order plaatsing** - Nog niet geïmplementeerd

### 💡 Placeholder messaging
Op verschillende plekken staat nu:
> "Huurperiode en betaalopties worden binnenkort toegevoegd. Neem contact op voor meer informatie."

Dit kan later vervangen worden door de echte checkout flow.

## 🚀 Volgende Stappen (optioneel)

Als je de winkelwagen verder wilt uitbreiden:

1. **Checkout pagina** - Aparte pagina met overzicht en formulier
2. **Betaalintegratie** - Mollie of andere payment provider
3. **Huurperiode selector** - Dropdown/radio buttons voor 1/3/6/12 maanden
4. **Prijs calculator** - Dynamische prijsberekening op basis van huurperiode
5. **Email notificaties** - Bevestiging bij order plaatsing
6. **Order geschiedenis** - In klantaccount

## 🐛 Troubleshooting

### Cart wordt niet geladen
- Check of Medusa backend draait (`http://localhost:9000`)
- Check browser console voor API errors
- Controleer `VITE_MEDUSA_BACKEND_URL` in `.env`

### Items verdwijnen na refresh
- Check of localStorage werkt (niet in incognito mode)
- Check of cart ID nog geldig is in Medusa
- Medusa carts kunnen expiren na X dagen

### Badge toont verkeerd aantal
- Check of `getCartItemCount` correct telt
- Refresh cart state met `refreshCart()`
- Check of Medusa response correct is

### Styling issues
- Zorg dat Tailwind CSS correct geconfigureerd is
- Check of alle UI components geïmporteerd zijn
- Verify z-index van drawer (moet boven andere content)

## 📦 Nieuwe Bestanden

```
storefront/client/src/
├── lib/
│   └── cart.ts                    # Cart API functies
├── contexts/
│   └── CartContext.tsx            # Global cart state
└── components/
    └── CartDrawer.tsx             # Cart UI component
```

## ✏️ Gewijzigde Bestanden

```
storefront/client/src/
├── App.tsx                        # CartProvider + CartDrawer toegevoegd
├── components/
│   └── Header.tsx                 # Cart button + badge
└── pages/
    └── ProductDetail.tsx          # Add to Cart knop
```

## 🎨 Design Choices

- **Slide-in drawer** - Moderne UX, geen page navigation nodig
- **Auto-open na toevoegen** - Direct feedback aan gebruiker
- **Toast notificaties** - Subtiele bevestiging van acties
- **Blue accent color** - Consistent met Ecomputer branding
- **Quantity controls** - Intuïtieve +/- buttons
- **Empty state** - Duidelijke call-to-action

## ✅ Best Practices Toegepast

- ✅ **Context API** voor global state (geen prop drilling)
- ✅ **TypeScript** voor type safety
- ✅ **Error handling** met try-catch en fallbacks
- ✅ **Loading states** voor betere UX
- ✅ **Responsive design** met Tailwind CSS
- ✅ **Accessibility** met aria-labels
- ✅ **Code splitting** - Aparte bestanden per concern
- ✅ **Reusable components** - CartDrawer kan hergebruikt worden
- ✅ **Clean code** - Duidelijke functienamen en comments

---

**Implementatie voltooid op:** 3 februari 2026  
**Getest op:** Vite + React 19 + Medusa.js 2.x  
**Status:** ✅ Klaar voor testen
