# Stap 1: Module Registreren in medusa-config.ts

## 📝 Wat je gaat doen:

Je gaat de Product Attributes module toevoegen aan je Medusa configuratie, zodat Medusa weet dat deze module bestaat en moet worden geladen.

---

## 🔧 Instructies:

### 1. Open het configuratie bestand

Open het bestand: `C:\ecomputer\ecomputer\backend\medusa-config.ts` in je code editor (bijv. Visual Studio Code, Notepad++, of gewoon Kladblok).

### 2. Zoek naar de modules sectie

Het bestand ziet er ongeveer zo uit:

```typescript
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  // Hier komt de modules sectie
})
```

### 3. Voeg de modules sectie toe

**Als je nog GEEN `modules` sectie hebt**, voeg deze toe VOOR de sluitende `})`:

```typescript
export default defineConfig({
  projectConfig: {
    // ... bestaande configuratie
  },
  modules: [
    {
      resolve: "./src/modules/product-attributes",
    },
  ],
})
```

**Als je AL een `modules` sectie hebt**, voeg dan alleen de nieuwe module toe aan de array:

```typescript
modules: [
  {
    resolve: "./src/modules/product-attributes",
  },
  // ... eventuele andere modules
],
```

### 4. Sla het bestand op

Druk op **Ctrl + S** (of Cmd + S op Mac) om het bestand op te slaan.

---

## ✅ Verificatie

Het bestand zou er nu ongeveer zo uit moeten zien:

```typescript
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "./src/modules/product-attributes",
    },
  ],
})
```

---

## 🎯 Volgende Stap

Als je het bestand hebt opgeslagen, laat het me weten! Dan gaan we verder met **Stap 2: Database migratie genereren**.

**Type "klaar" of "gedaan" als je deze stap hebt voltooid!** ✅
