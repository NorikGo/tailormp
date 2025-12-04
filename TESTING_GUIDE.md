# Testing Guide - Rollen-System

## 🎯 So testest du die Rollen-Unterschiede

### Vorbereitung
Du brauchst **2 Browser** oder **1 Browser + 1 Inkognito-Fenster**

---

## Test 1: Customer registrieren

1. **Browser 1:** Öffne http://localhost:3000/register
2. Gib Email ein: `customer@beispiel.de`
3. Gib Passwort ein: `test1234`
4. ✅ Wähle **"Kunde"** (Ich suche einen Schneider)
5. Klicke "Registrieren"
6. ⚠️ **Wichtig:** Supabase sendet eine Bestätigungs-Email
   - Check deine Email
   - Klicke auf den Bestätigungslink
   - ODER: Überspringe Email-Verifizierung in Supabase Dashboard

### Was du als Customer siehst:

**Navigation (oben):**
```
Home | Schneider | Produkte | Über uns | 🛒
```

**Dropdown-Menü (rechts oben):**
```
Mein Konto
├─ Dashboard          → /dashboard
├─ Profil             → /profile
├─ Meine Bestellungen → /orders
└─ Abmelden
```

**Dashboard (`/dashboard`):**
- ✅ Statistiken: Bestellungen, Ausgaben, Offene, Abgeschlossene
- ✅ "Noch keine Bestellungen" (wenn neu)
- ✅ Link zu "Produkte entdecken"

---

## Test 2: Tailor registrieren

1. **Browser 2 (Inkognito):** Öffne http://localhost:3000/register
2. Gib Email ein: `tailor@beispiel.de`
3. Gib Passwort ein: `test1234`
4. ✅ Wähle **"Schneider"** (Ich biete meine Dienste an)
5. Klicke "Registrieren"
6. Bestätige Email (wie oben)

### Was du als Tailor siehst:

**Navigation (oben):**
```
Dashboard | Produkte | Bestellungen | Einnahmen
```
❌ **KEIN** Warenkorb-Icon!

**Dropdown-Menü (rechts oben):**
```
Schneider-Konto
├─ Dashboard      → /tailor/dashboard
├─ Profil         → /tailor/profile/edit
├─ Meine Produkte → /tailor/products
├─ Bestellungen   → /tailor/orders
└─ Abmelden
```

**Dashboard (`/tailor/dashboard`):**
- ✅ Statistiken: Einnahmen, Bestellungen, Offen, Abgeschlossen, Produkte, Bewertung
- ✅ Quick Actions: "Neues Produkt erstellen", "Produkte verwalten", "Profil bearbeiten"
- ✅ "Noch keine Bestellungen" (wenn neu)

---

## Test 3: Route Protection testen

### Als Customer:
- ✅ `/dashboard` → Funktioniert
- ❌ `/tailor/dashboard` → Sollte nicht funktionieren (wird in Zukunft geblockt)
- ✅ `/cart` → Funktioniert
- ✅ `/orders` → Funktioniert

### Als Tailor:
- ✅ `/tailor/dashboard` → Funktioniert
- ✅ `/tailor/products` → Funktioniert
- ✅ `/tailor/orders` → Funktioniert
- ❌ `/cart` → Sollte nicht funktionieren (keine Warenkorb-Funktion für Tailors)

---

## Visuelle Unterschiede - Übersicht

| Feature | Customer | Tailor |
|---------|----------|--------|
| **Warenkorb-Icon** | ✅ Ja | ❌ Nein |
| **Navigation** | Home, Schneider, Produkte | Dashboard, Produkte, Bestellungen, Einnahmen |
| **Dashboard** | Bestellübersicht als Kunde | Einnahmen, Verkaufs-Statistiken |
| **Dropdown-Titel** | "Mein Konto" | "Schneider-Konto" |
| **Profil-Link** | `/profile` | `/tailor/profile/edit` |
| **Kann Produkte kaufen** | ✅ Ja | ❌ Nein |
| **Kann Produkte verkaufen** | ❌ Nein | ✅ Ja |

---

## Häufige Probleme

### "Ich sehe keinen Unterschied"
- ✅ Bist du eingeloggt?
- ✅ Hast du die richtige Rolle gewählt bei der Registrierung?
- ✅ Hast du die Email bestätigt?

### "Navigation zeigt falsche Links"
- Hard-Refresh: `Ctrl + Shift + R` (Windows) oder `Cmd + Shift + R` (Mac)
- Browser-Cache leeren

### "Seite lädt nicht"
- Check Terminal: Läuft `npm run dev`?
- Check URL: http://localhost:3000

---

## Email-Verifizierung überspringen (Development)

Falls du keine Email-Verifizierung machen willst:

1. Gehe zu Supabase Dashboard: https://supabase.com/dashboard
2. Wähle dein Projekt
3. Gehe zu **Authentication** → **Users**
4. Finde den neu registrierten User
5. Klicke auf die 3 Punkte → **Confirm Email**

---

## Schnelltest (ohne Email-Verifizierung)

1. Registriere als Customer
2. Gehe zu Supabase → Bestätige Email manuell
3. Login auf localhost:3000/login
4. Gehe zu `/dashboard` → Siehst du Customer Dashboard?
5. Logout
6. Registriere als Tailor (Inkognito)
7. Bestätige Email
8. Login
9. Gehe zu `/tailor/dashboard` → Siehst du Tailor Dashboard?

✅ Wenn beide Dashboards unterschiedlich aussehen → **ERFOLG!**

---

## Was fehlt noch?

- [ ] **Tailor Onboarding:** Nach Registrierung als Tailor sollte ein Onboarding-Flow kommen (Profil ausfüllen, Stripe Connect)
- [ ] **Tailor Profil anlegen:** Aktuell haben neue Tailors kein Profil → Muss manuell erstellt werden
- [ ] **Seed Script:** Funktioniert nicht mit Supabase Auth → Nur für lokales Testing

---

**Viel Erfolg beim Testen!** 🚀
