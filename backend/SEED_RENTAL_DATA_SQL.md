# Rental Module - SQL Seed File

## Overzicht

Dit SQL bestand voegt test data toe aan de rental module via directe database queries. Veel eenvoudiger en betrouwbaarder dan via Medusa scripts!

## Wat wordt toegevoegd?

### 1. Rental Pricing (7 items)
- Dell XPS 15 - Flex (€89.99/maand) en Jaar (€69.99/maand)
- MacBook Pro 14" - Flex (€129.99/maand) en Jaar (€99.99/maand)
- Dell 27" Monitor - Flex (€29.99/maand) en Jaar (€24.99/maand)
- Docking Station - Flex (€19.99/maand)

### 2. Rental Contracts (5 items)
- **RC-2026-001** - Actief Flex contract (Dell XPS 15)
- **RC-2026-002** - Actief Jaar contract (MacBook Pro + Docking)
- **RC-2026-003** - In Afwachting (Monitor, borg niet betaald)
- **RC-2025-089** - Beëindigd (succesvol afgerond)
- **RC-2026-004** - Eindigt Binnenkort (opzegtermijn loopt)

### 3. Contract Items (6 items)
Elk contract heeft 1-2 items met serienummers en conditie info.

### 4. Quote Requests (5 items)
- Tech Startup BV - Nieuw
- Event Company Amsterdam - In Behandeling
- Marketing Bureau Rotterdam - Offerte Verstuurd
- Consultancy Firm Utrecht - Geaccepteerd
- Design Studio Den Haag - Afgewezen

## Gebruik

### Optie 1: Via psql (Aanbevolen)

```bash
cd C:\ecomputer\ecomputer\backend
psql -U postgres -d ecomputer_medusa -f seed-rental-data.sql
```

Als je wachtwoord nodig hebt:
```bash
psql -U postgres -d ecomputer_medusa -W -f seed-rental-data.sql
```

### Optie 2: Via pgAdmin

1. Open pgAdmin
2. Verbind met je database `ecomputer_medusa`
3. Open Query Tool (Tools → Query Tool)
4. Open het bestand `seed-rental-data.sql`
5. Klik op Execute (F5)

### Optie 3: Via DBeaver / andere GUI

1. Verbind met database `ecomputer_medusa`
2. Open SQL Editor
3. Plak de inhoud van `seed-rental-data.sql`
4. Execute

## Verificatie

Na het uitvoeren van het SQL bestand:

### 1. Check in Database

```sql
-- Check rental pricings
SELECT COUNT(*) FROM rental_pricing;
-- Zou 7 moeten zijn

-- Check rental contracts
SELECT COUNT(*) FROM rental_contract;
-- Zou 5 moeten zijn

-- Check contract items
SELECT COUNT(*) FROM rental_contract_item;
-- Zou 6 moeten zijn

-- Check quote requests
SELECT COUNT(*) FROM quote_request;
-- Zou 5 moeten zijn
```

### 2. Check in Admin UI

1. Open `http://localhost:9000/app`
2. Ga naar Extensions → Verhuur → Zie 5 contracten! 📋
3. Ga naar Extensions → Verhuurprijzen → Zie 7 pricings! 💰
4. Ga naar Extensions → Offerte Aanvragen → Zie 5 requests! 📝

## Data Opschonen

Als je de test data wilt verwijderen:

```sql
BEGIN;

DELETE FROM rental_contract_item;
DELETE FROM rental_contract;
DELETE FROM rental_pricing;
DELETE FROM quote_request;

COMMIT;
```

Of via bestand:

```bash
psql -U postgres -d ecomputer_medusa -c "
DELETE FROM rental_contract_item;
DELETE FROM rental_contract;
DELETE FROM rental_pricing;
DELETE FROM quote_request;
"
```

## Troubleshooting

### Error: "psql: command not found"

**Oplossing:** PostgreSQL is niet geïnstalleerd of niet in PATH.

**Windows:**
- Download PostgreSQL van https://www.postgresql.org/download/windows/
- Of gebruik pgAdmin GUI in plaats van psql

**Mac:**
```bash
brew install postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql-client
```

### Error: "FATAL: database 'ecomputer_medusa' does not exist"

**Oplossing:** Database naam is verkeerd. Check de naam in je `.env` file:

```bash
cat .env | grep DATABASE_URL
```

Gebruik de juiste database naam in het psql command.

### Error: "permission denied"

**Oplossing:** Je hebt geen rechten op de database.

Gebruik de juiste user:
```bash
psql -U <username> -d ecomputer_medusa -f seed-rental-data.sql
```

### Error: "duplicate key value violates unique constraint"

**Oplossing:** De data bestaat al. Verwijder eerst de oude data:

```bash
psql -U postgres -d ecomputer_medusa -c "
DELETE FROM rental_contract_item;
DELETE FROM rental_contract;
DELETE FROM rental_pricing;
DELETE FROM quote_request;
"
```

Dan voer het seed script opnieuw uit.

## Voordelen van SQL Seed

✅ **Snel** - Direct database toegang, geen Medusa overhead  
✅ **Betrouwbaar** - Standaard SQL, geen dependency issues  
✅ **Debugbaar** - Zie precies wat er gebeurt  
✅ **Herbruikbaar** - Kan meerdere keren uitgevoerd worden  
✅ **Portable** - Werkt op elke PostgreSQL database  

## Productie

**⚠️ WAARSCHUWING:** Gebruik dit script NIET in productie!

Voor productie:
- Gebruik Medusa's officiële seeding mechanisme
- Maak proper data validatie
- Gebruik transactions
- Log alle changes
- Backup eerst de database

## Support

Voor vragen:
1. Check deze README
2. Check PostgreSQL documentatie
3. Check Medusa v2 documentatie
