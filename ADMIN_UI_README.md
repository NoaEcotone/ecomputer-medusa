# Rental Module - Admin UI Handleiding

## Overzicht

Deze handleiding beschrijft de Admin UI interface voor het rental management systeem. De interface is gebouwd met Medusa v2 Admin UI Routes en biedt volledige functionaliteit voor het beheren van verhuurcontracten, prijzen en offerte-aanvragen.

## Installatie & Setup

### Stap 1: Code Ophalen

```bash
cd C:/ecomputer/ecomputer/backend
git pull origin main
```

### Stap 2: Server Herstarten

Stop de huidige server met `Ctrl+C` en start opnieuw:

```bash
pnpm dev
```

### Stap 3: Admin Dashboard Openen

Open je browser en ga naar:
```
http://localhost:9000/app
```

Log in met je admin credentials.

## Sidebar Menu

Na het inloggen zie je in de sidebar een nieuw menu item:

**📋 Verhuur** (hoofdmenu)
- **💰 Verhuurprijzen** - Beheer prijzen per product
- **📝 Offerte Aanvragen** - Bekijk en verwerk aanvragen

## Pagina's & Functionaliteit

### 1. Verhuurcontracten Overzicht

**URL:** `/app/rentals`

Deze pagina toont alle actieve en historische verhuurcontracten in een overzichtelijke tabel.

**Kolommen:**
- **Contractnummer** - Uniek identificatienummer
- **Type** - Flex (maandelijks), Jaar (12 maanden), of Offerte
- **Status** - Actief, In Afwachting, Beëindigd, etc.
- **Startdatum** - Wanneer het contract ingaat
- **Einddatum** - Wanneer het contract afloopt
- **Maandbedrag** - Maandelijkse huurprijs
- **Borg** - Borgbedrag en betaalstatus
- **Acties** - Knoppen voor details bekijken

**Functionaliteit:**
- Klik op een rij om naar de detail pagina te gaan
- "Nieuw Contract" knop om een nieuw contract aan te maken (TODO)
- Automatische status badges met kleuren

### 2. Contract Detail Pagina

**URL:** `/app/rentals/{contract_id}`

Gedetailleerde weergave van een specifiek contract met alle informatie.

**Secties:**

**Basis Informatie:**
- Klant ID
- Contract type (Flex/Jaar/Offerte)
- Startdatum en einddatum
- Vroegst mogelijke einddatum (voor Flex contracten)

**Financiële Informatie:**
- Maandbedrag
- Borgbedrag
- Borg status (Betaald/Terugbetaald/Openstaand)

**Gehuurde Items:**
- Tabel met alle items in het contract
- Product ID, aantal, serienummer
- Conditie bij levering en bij retour

**Notities:**
- Vrije tekst notities over het contract

**Acties:**
- **Bewerken** - Contract aanpassen (TODO)
- **Retour Registreren** - Items inleveren en conditie beoordelen (TODO)
- **Terug naar Overzicht** - Terug naar contractenlijst

### 3. Verhuurprijzen Beheer

**URL:** `/app/rental-pricing`

Beheer de verhuurprijzen voor alle producten in de catalogus.

**Kolommen:**
- **Product ID** - Identificatie van het product
- **Flex (maandelijks)** - Prijs voor maandelijks contract + beschikbaarheid
- **Jaar (12 maanden)** - Prijs voor jaarcontract + beschikbaarheid
- **Borgbedrag** - Eenmalig borgbedrag
- **Beschikbaarheid** - Welke verhuurtypen actief zijn
- **Acties** - Bewerken en verwijderen

**Functionaliteit:**
- "Nieuwe Pricing" knop om prijzen toe te voegen (TODO)
- Bewerken knop per pricing (TODO)
- Verwijderen knop met bevestiging
- Informatiesectie met uitleg over verhuurmodellen

**Verhuurmodellen Uitleg:**
- **Flex:** Minimaal 3 maanden, daarna maandelijks opzegbaar met 1 maand opzegtermijn. Hogere maandprijs.
- **Jaar:** Vast 12 maanden contract. Lagere maandprijs door langere commitment.
- **Borgbedrag:** Eenmalig bij contractstart. Wordt terugbetaald bij inlevering in goede staat.

### 4. Offerte Aanvragen Overzicht

**URL:** `/app/quote-requests`

Overzicht van alle offerte-aanvragen voor korte termijn verhuur (1 dag tot 4 weken).

**Kolommen:**
- **Bedrijf** - Bedrijfsnaam van aanvrager
- **Contactpersoon** - Naam van contactpersoon
- **E-mail** - E-mailadres voor contact
- **Periode** - Gewenste start- en einddatum
- **Duur** - Automatisch berekende duur (dagen/weken)
- **Status** - Nieuw, In Behandeling, Verstuurd, Geaccepteerd, Afgewezen
- **Aangemaakt** - Datum van aanvraag
- **Acties** - Details bekijken

**Functionaliteit:**
- Status filter dropdown om te filteren op status
- Klik op rij om naar detail pagina te gaan
- Stats dashboard onderaan met aantallen per status

**Status Types:**
- **Nieuw** - Nog niet bekeken
- **In Behandeling** - Wordt verwerkt
- **Offerte Verstuurd** - Offerte is naar klant gestuurd
- **Geaccepteerd** - Klant heeft geaccepteerd
- **Afgewezen** - Klant heeft afgewezen of niet gereageerd

### 5. Offerte Aanvraag Detail

**URL:** `/app/quote-requests/{request_id}`

Gedetailleerde weergave van een offerte-aanvraag.

**Secties:**

**Bedrijfsgegevens:**
- Bedrijfsnaam
- Contactpersoon
- E-mail (klikbaar voor direct mailen)
- Telefoon (klikbaar voor direct bellen)

**Gewenste Periode:**
- Startdatum
- Einddatum
- Automatisch berekende duur

**Gewenste Items:**
- JSON weergave van aangevraagde items
- Bevat product IDs, aantallen, specificaties

**Notities:**
- Extra informatie van de klant

**Status Bijwerken:**
Knoppen om status te wijzigen:
- **In Behandeling** - Markeer als bezig
- **Offerte Verstuurd** - Markeer als verstuurd
- **Geaccepteerd** - Markeer als geaccepteerd
- **Afgewezen** - Markeer als afgewezen

## Kleuren & Badges

### Status Kleuren

De interface gebruikt kleurcodering voor snelle herkenning:

- **🟢 Groen** - Positieve status (Actief, Geaccepteerd, Betaald)
- **🟡 Geel** - Aandacht vereist (In Afwachting, In Behandeling)
- **🔴 Rood** - Negatieve status (Geannuleerd, Afgewezen)
- **⚪ Grijs** - Afgerond (Beëindigd)
- **🔵 Blauw** - Flex contract type
- **🟣 Paars** - Jaar contract type
- **🟠 Oranje** - Offerte type

## Datum & Valuta Formatting

Alle datums en bedragen worden automatisch geformatteerd volgens Nederlandse standaarden:

**Datums:**
- Korte weergave: `04-02-2026`
- Lange weergave: `4 februari 2026`

**Valuta:**
- Format: `€ 1.234,56`
- Altijd in Euro's (EUR)

## Workflow Voorbeelden

### Nieuw Contract Aanmaken

1. Ga naar `/app/rentals`
2. Klik op "Nieuw Contract"
3. Vul klantgegevens in
4. Selecteer producten
5. Kies contract type (Flex/Jaar)
6. Systeem berekent automatisch prijzen
7. Bevestig en maak contract aan

### Offerte Verwerken

1. Ga naar `/app/quote-requests`
2. Filter op "Nieuw" status
3. Klik op aanvraag om details te zien
4. Bekijk bedrijfsgegevens en gewenste items
5. Klik "In Behandeling" om status te wijzigen
6. Maak offerte (extern systeem of handmatig)
7. Klik "Offerte Verstuurd" na verzending
8. Wacht op reactie klant
9. Markeer als "Geaccepteerd" of "Afgewezen"

### Retour Verwerken

1. Ga naar `/app/rentals`
2. Zoek actief contract
3. Klik op contract om details te zien
4. Klik "Retour Registreren"
5. Vul conditie in per item
6. Bepaal of borg terugbetaald wordt
7. Bevestig retour
8. Contract status wordt automatisch bijgewerkt

## Technische Details

### Gebruikte Technologieën

- **React** - UI framework
- **TypeScript** - Type safety
- **Medusa UI** - Component library
- **Tailwind CSS** - Styling
- **React Router** - Routing

### API Endpoints

De UI maakt gebruik van de volgende API endpoints:

**Contracts:**
- `GET /admin/rental-contracts` - Lijst ophalen
- `GET /admin/rental-contracts/{id}` - Detail ophalen
- `POST /admin/rental-contracts` - Nieuw contract
- `PUT /admin/rental-contracts/{id}` - Contract bijwerken
- `DELETE /admin/rental-contracts/{id}` - Contract verwijderen

**Pricing:**
- `GET /admin/rental-pricing` - Lijst ophalen
- `POST /admin/rental-pricing` - Nieuwe pricing
- `PUT /admin/rental-pricing/{id}` - Pricing bijwerken
- `DELETE /admin/rental-pricing/{id}` - Pricing verwijderen

**Quote Requests:**
- `GET /admin/quote-requests` - Lijst ophalen (met filter)
- `GET /admin/quote-requests/{id}` - Detail ophalen
- `POST /admin/quote-requests/{id}` - Status bijwerken

## Troubleshooting

### Menu items niet zichtbaar

**Probleem:** Verhuur menu verschijnt niet in sidebar

**Oplossing:**
1. Check of server draait: `pnpm dev`
2. Check browser console voor errors (F12)
3. Hard refresh: `Ctrl+Shift+R` (Windows) of `Cmd+Shift+R` (Mac)
4. Check of bestanden correct zijn gepulled: `git status`

### Data laadt niet

**Probleem:** Tabellen blijven leeg of tonen "Laden..."

**Oplossing:**
1. Check of backend API draait op `http://localhost:9000`
2. Open browser console (F12) en check Network tab
3. Kijk of API endpoints 200 status returnen
4. Check of je ingelogd bent (JWT token geldig)

### Styling ziet er verkeerd uit

**Probleem:** Pagina's zien er niet goed uit

**Oplossing:**
1. Check of Medusa UI correct geïnstalleerd is: `pnpm install`
2. Clear browser cache
3. Check of Tailwind CSS correct werkt
4. Herstart dev server

## Volgende Stappen

De volgende functionaliteiten zijn nog niet geïmplementeerd maar zijn voorbereid:

1. **Nieuw Contract Formulier** - Wizard voor contract aanmaken
2. **Contract Bewerken** - Edit functionaliteit
3. **Retour Registratie** - Volledige retour flow
4. **Pricing Formulier** - Modal voor pricing toevoegen/bewerken
5. **Zoek & Filter** - Uitgebreide zoekfunctionaliteit
6. **Paginatie** - Voor grote datasets
7. **Export Functionaliteit** - PDF/Excel export
8. **Notificaties** - Email alerts bij status wijzigingen

## Support

Voor vragen of problemen:
1. Check deze README eerst
2. Bekijk de code comments in de bestanden
3. Check Medusa v2 documentatie: https://docs.medusajs.com
4. Open een issue op GitHub

## Changelog

**v1.0.0** (04-02-2026)
- Initial release
- 5 admin UI routes
- Verhuurcontracten overzicht en detail
- Verhuurprijzen beheer
- Offerte aanvragen overzicht en detail
- Nederlandse lokalisatie
- Medusa UI componenten
- API integratie
