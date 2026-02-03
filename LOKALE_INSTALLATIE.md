# 🏠 Ecomputer - Lokale Installatie op je Eigen Computer

Deze guide helpt je om het Ecomputer project op je eigen Windows, Mac of Linux computer te installeren en te draaien.

## 📋 Wat heb je nodig?

### 1. Node.js (versie 18 of hoger)
**Download**: https://nodejs.org/

- Kies de **LTS versie** (Long Term Support)
- Windows: Download de `.msi` installer
- Mac: Download de `.pkg` installer
- Linux: Gebruik je package manager

**Test of het werkt:**
```bash
node --version
# Moet iets tonen zoals: v20.x.x of v22.x.x
```

### 2. pnpm (Package Manager)
**Installeer na Node.js installatie:**
```bash
npm install -g pnpm
```

**Test of het werkt:**
```bash
pnpm --version
# Moet iets tonen zoals: 9.x.x
```

### 3. PostgreSQL Database
**Download**: https://www.postgresql.org/download/

- **Windows**: Download de installer van EnterpriseDB
- **Mac**: Gebruik Postgres.app (https://postgresapp.com/) of Homebrew
- **Linux**: `sudo apt install postgresql postgresql-contrib`

**Tijdens installatie:**
- Onthoud het **wachtwoord** dat je instelt voor de `postgres` gebruiker
- Standaard poort: `5432` (laat dit zo)

### 4. Git (optioneel, maar handig)
**Download**: https://git-scm.com/downloads

## 📥 Stap 1: Download het project

### Optie A: Download als ZIP (makkelijkst)
1. Ik ga het project voor je inpakken
2. Download het ZIP bestand
3. Pak het uit in een map naar keuze (bijv. `C:\Projects\ecomputer` of `~/Projects/ecomputer`)

### Optie B: Via Git (als je Git hebt)
```bash
# Later: als het project op GitHub staat
git clone <repository-url>
cd ecomputer
```

## 🗄️ Stap 2: Database opzetten

### Windows:

1. **Open pgAdmin 4** (komt mee met PostgreSQL)
2. **Login** met het wachtwoord dat je bij installatie hebt ingesteld
3. **Rechtermuisklik op "Databases"** → Create → Database
4. **Database naam**: `ecomputer_medusa`
5. **Klik Save**

**OF via Command Line:**
```bash
# Open Command Prompt of PowerShell
psql -U postgres
# Voer je wachtwoord in

# In psql:
CREATE DATABASE ecomputer_medusa;
CREATE USER medusa_user WITH PASSWORD 'medusa_password';
GRANT ALL PRIVILEGES ON DATABASE ecomputer_medusa TO medusa_user;
\q
```

### Mac/Linux:

```bash
# Open Terminal
sudo -u postgres psql

# In psql:
CREATE DATABASE ecomputer_medusa;
CREATE USER medusa_user WITH PASSWORD 'medusa_password';
GRANT ALL PRIVILEGES ON DATABASE ecomputer_medusa TO medusa_user;
\q
```

## ⚙️ Stap 3: Backend configureren

### 3.1 Ga naar de backend folder
```bash
cd ecomputer/backend
```

### 3.2 Check de .env file
Open `backend/.env` in een teksteditor (Notepad, VS Code, etc.)

**Controleer deze regel:**
```
DATABASE_URL=postgres://medusa_user:medusa_password@localhost:5432/ecomputer_medusa
```

**Als je een ander wachtwoord hebt gebruikt bij PostgreSQL:**
```
DATABASE_URL=postgres://postgres:JOUW_WACHTWOORD@localhost:5432/ecomputer_medusa
```

### 3.3 Installeer dependencies
```bash
pnpm install
```

Dit kan 2-5 minuten duren. Je ziet een hoop tekst voorbijkomen - dat is normaal!

### 3.4 Run database migraties
```bash
pnpm medusa db:migrate
```

Je zou moeten zien: **"Migrations completed successfully"**

### 3.5 Start de backend
```bash
pnpm dev
```

**Je ziet:**
```
✔ Server is ready on port: 9000
info:    Admin URL → http://localhost:9000/app
```

✅ **Laat dit terminal venster open!**

## 🎨 Stap 4: Frontend configureren

### 4.1 Open een NIEUW terminal venster
**Belangrijk**: Laat de backend terminal open!

- **Windows**: Open een nieuwe Command Prompt of PowerShell
- **Mac/Linux**: Open een nieuwe Terminal tab (Cmd+T of Ctrl+Shift+T)

### 4.2 Ga naar de storefront folder
```bash
cd ecomputer/storefront
```

### 4.3 Check de .env.local file
Open `storefront/.env.local` in een teksteditor

**Moet er zo uitzien:**
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_becd4b2b2789a1bd0fada899acb6be40d4328bfaf93e97d86bf486489264c305
```

### 4.4 Installeer dependencies
```bash
pnpm install
```

### 4.5 Start de frontend
```bash
pnpm dev
```

**Je ziet:**
```
✓ Ready in ...ms
- Local:    http://localhost:3000
```

✅ **Laat ook dit terminal venster open!**

## 🎉 Stap 5: Open in je browser

Nu heb je 2 terminal vensters open:
- **Terminal 1**: Backend (poort 9000)
- **Terminal 2**: Frontend (poort 3000)

### Open deze URLs in je browser:

**Admin Dashboard:**
🔗 http://localhost:9000/app

**Login gegevens:**
- Email: `admin@ecomputer.nl`
- Wachtwoord: `supersecret123`

**Storefront (klant website):**
🔗 http://localhost:3000

## ✅ Checklist: Is alles gelukt?

- [ ] Node.js geïnstalleerd (check: `node --version`)
- [ ] pnpm geïnstalleerd (check: `pnpm --version`)
- [ ] PostgreSQL geïnstalleerd en draait
- [ ] Database `ecomputer_medusa` aangemaakt
- [ ] Backend dependencies geïnstalleerd (`pnpm install` in backend folder)
- [ ] Database migraties gedraaid (`pnpm medusa db:migrate`)
- [ ] Backend draait (zie "Server is ready on port: 9000")
- [ ] Frontend dependencies geïnstalleerd (`pnpm install` in storefront folder)
- [ ] Frontend draait (zie "Ready in ...ms")
- [ ] Admin dashboard opent in browser (http://localhost:9000/app)
- [ ] Kan inloggen met admin@ecomputer.nl / supersecret123
- [ ] Storefront opent in browser (http://localhost:3000)

## 🛠️ Veelvoorkomende problemen

### "Port 9000 is already in use"
**Oplossing**: Er draait al iets op poort 9000.
```bash
# Windows (in Command Prompt als Administrator):
netstat -ano | findstr :9000
taskkill /PID <PID_NUMMER> /F

# Mac/Linux:
lsof -ti:9000 | xargs kill -9
```

### "Port 3000 is already in use"
**Oplossing**: Next.js kiest automatisch poort 3001. Gebruik dan http://localhost:3001

### "Database connection failed"
**Oplossing**: 
1. Check of PostgreSQL draait
2. Check DATABASE_URL in `.env`
3. Test database connectie:
```bash
psql -U medusa_user -d ecomputer_medusa
# Voer wachtwoord in: medusa_password
```

### "pnpm: command not found"
**Oplossing**: pnpm is niet geïnstalleerd of niet in PATH.
```bash
npm install -g pnpm
```

### "node: command not found"
**Oplossing**: Node.js is niet geïnstalleerd of niet in PATH.
- Herstart je terminal na Node.js installatie
- Of herstart je computer

## 🔄 Servers stoppen en starten

### Servers stoppen:
In elk terminal venster: **Ctrl + C**

### Servers opnieuw starten:

**Backend:**
```bash
cd ecomputer/backend
pnpm dev
```

**Frontend:**
```bash
cd ecomputer/storefront
pnpm dev
```

## 📚 Volgende stappen

Nu alles draait:

1. **Login in het Admin Dashboard** (http://localhost:9000/app)
2. **Ga naar Products** → Create
3. **Voeg je eerste laptop toe**
4. **Bekijk het resultaat** op de storefront (http://localhost:3000)

## 💡 Tips

- **Gebruik 2 terminal vensters**: 1 voor backend, 1 voor frontend
- **Laat ze open**: Zodra je een terminal sluit, stopt die server
- **Browser refresh**: Druk F5 als je wijzigingen niet ziet
- **Check de terminal**: Errors verschijnen hier
- **Hot reload**: Code wijzigingen worden automatisch herladen

## 🆘 Hulp nodig?

Als je ergens vastloopt:
1. Check de error message in de terminal
2. Controleer de checklist hierboven
3. Kijk bij "Veelvoorkomende problemen"
4. Vraag om hulp en deel de error message

---

**Succes met de installatie! 🚀**
