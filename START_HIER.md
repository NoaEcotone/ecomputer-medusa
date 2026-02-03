# 🚀 Ecomputer - Hoe te starten (voor beginners)

## Wat is er nu aan het draaien?

Goed nieuws! Ik heb beide servers voor je gestart:

### ✅ Backend (Medusa Admin)
- **Status**: DRAAIT ✅
- **Lokale URL**: http://localhost:9000
- **Publieke URL**: https://9000-i87og3gygni42er7yshoo-2a6217e4.us2.manus.computer
- **Admin Dashboard**: Voeg `/app` toe aan de URL
- **Login**: admin@ecomputer.nl / supersecret123

### ✅ Frontend (Storefront)
- **Status**: DRAAIT ✅
- **Lokale URL**: http://localhost:3001 (let op: poort 3001, niet 3000!)
- **Publieke URL**: https://3001-i87og3gygni42er7yshoo-2a6217e4.us2.manus.computer

## 🌐 Welke links moet ik gebruiken?

### Als je werkt in deze Manus sandbox:
Gebruik de **publieke URLs** (die beginnen met https://):
- **Admin Dashboard**: https://9000-i87og3gygni42er7yshoo-2a6217e4.us2.manus.computer/app
- **Storefront**: https://3001-i87og3gygni42er7yshoo-2a6217e4.us2.manus.computer

### Als je later op je eigen computer werkt:
Gebruik de **lokale URLs**:
- **Admin Dashboard**: http://localhost:9000/app
- **Storefront**: http://localhost:3001

## 📝 Wat betekent dit allemaal?

### Backend = Admin Dashboard
Dit is waar **jij** (als beheerder) producten toevoegt, bestellingen bekijkt, etc.
- Denk aan het als de "achterkant" van je winkel
- Klanten zien dit nooit
- Alleen jij logt hier in

### Frontend = Storefront
Dit is wat **klanten** zien als ze naar je website gaan.
- De "voorkant" van je winkel
- Hier kunnen klanten laptops bekijken
- Later: hier kunnen ze ook bestellen

## 🔄 Hoe start ik de servers opnieuw?

Als de servers stoppen (bijvoorbeeld na een herstart), volg deze stappen:

### Stap 1: Open een terminal
In Manus: klik op het terminal icoon

### Stap 2: Start de database
```bash
sudo service postgresql start
```

### Stap 3: Start de backend
```bash
cd /home/ubuntu/ecomputer/backend
pnpm dev
```

Je ziet: **"Server is ready on port: 9000"** ✅

### Stap 4: Open een NIEUWE terminal
Laat de vorige terminal open! Open een nieuwe terminal.

### Stap 5: Start de frontend
```bash
cd /home/ubuntu/ecomputer/storefront
pnpm dev
```

Je ziet: **"Ready in ...ms"** ✅

## ❓ Veelgestelde vragen

### "This site can't be reached" - wat nu?
- Controleer of de servers draaien (zie hierboven)
- Gebruik de **publieke URLs** in plaats van localhost
- Wacht 10-15 seconden na het starten

### Waarom poort 3001 en niet 3000?
- Poort 3000 was al in gebruik
- Next.js koos automatisch poort 3001
- Dit is normaal en geen probleem!

### Hoe stop ik de servers?
In de terminal waar de server draait:
- Druk op `Ctrl + C`
- Of sluit de terminal

### Hoe voeg ik producten toe?
1. Ga naar het Admin Dashboard
2. Login met admin@ecomputer.nl / supersecret123
3. Klik op **Products** in het menu
4. Klik op **Create**
5. Vul de gegevens in
6. Klik op **Save**

## 🎯 Volgende stappen

Nu alles draait, kun je:

1. **Admin Dashboard verkennen**
   - Ga naar: https://9000-i87og3gygni42er7yshoo-2a6217e4.us2.manus.computer/app
   - Login en kijk rond
   - Bekijk de Collections (Budget, Mid-range, High-end)

2. **Storefront bekijken**
   - Ga naar: https://3001-i87og3gygni42er7yshoo-2a6217e4.us2.manus.computer
   - Bekijk de homepage
   - Klik op "Bekijk alle laptops"

3. **Je eerste product toevoegen**
   - Volg de stappen hierboven
   - Gebruik een HP laptop als voorbeeld
   - Voeg metadata toe voor specs

## 💡 Tips

- **Houd beide terminals open** - één voor backend, één voor frontend
- **Gebruik de publieke URLs** - localhost werkt niet in Manus
- **Wacht even na het starten** - servers hebben 10-15 seconden nodig
- **Refresh de pagina** - als iets niet laadt, probeer F5

## 🆘 Hulp nodig?

Als iets niet werkt:
1. Controleer of beide servers draaien (zie stappen hierboven)
2. Kijk in de terminal voor error messages
3. Vraag om hulp en deel de error message

---

**Status**: ✅ Alles draait! Je bent klaar om te beginnen!
