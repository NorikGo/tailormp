# 🧪 TailorMarket - Beta Test Anleitung

**Version:** Development Preview
**Für:** Beta Tester / Bekannte
**Dauer:** 15-30 Minuten

---

## 👋 Hallo Beta Tester!

Danke dass du dir Zeit nimmst, TailorMarket zu testen! Das ist eine **frühe Development-Version** - Bugs sind normal und erwünscht! 😊

**Wichtig:**
- ⚠️ Das ist **TEST-Modus** (keine echten Zahlungen)
- 🐛 Bugs sind **GEWÜNSCHT** - bitte melden!
- 💳 Stripe Zahlungen: Nutze Test-Karte (siehe unten)

---

## 🔗 Zugang

**Live-App:** https://tailormp.vercel.app

**Browser:** Chrome, Edge, Safari oder Firefox (neueste Version)
**Geräte:** Desktop + Mobile (gerne beides testen!)

---

## ✅ Was du testen sollst

### 1️⃣ Account erstellen (2 Min)

1. Gehe zu: https://tailormp.vercel.app/register
2. **Registriere dich:**
   - Name: [Dein Name]
   - Email: [Deine Email]
   - Passwort: [mind. 8 Zeichen]
   - Role: **CUSTOMER** (für Kunden) oder **TAILOR** (für Schneider)
3. Klicke "Registrieren"

**✅ Erfolgreich wenn:**
- Du wirst zu Homepage weitergeleitet
- Oben rechts siehst du deinen Namen (eingeloggt)

**🐛 Falls Error:**
- Screenshot machen + mir schicken!

---

### 2️⃣ Herumklicken (5 Min)

**Teste die Navigation:**
- [ ] Klicke auf "Produkte" → Siehst du Produkte?
- [ ] Klicke auf "Schneider" → Siehst du Schneider-Profile?
- [ ] Klicke auf ein Produkt → Öffnet sich Detail-Seite?
- [ ] Klicke auf einen Schneider → Öffnet sich Profil?

**🐛 Was könnte schiefgehen:**
- Seite lädt nicht
- Error Messages
- Komisches Layout
- Bilder laden nicht

→ **Alles melden!** Screenshots sind Gold wert! 📸

---

### 3️⃣ Produkt in Warenkorb (2 Min)

1. Gehe zu "Produkte"
2. Wähle ein Produkt
3. Klicke "In den Warenkorb"
4. Gehe zu Warenkorb (Cart Icon oben rechts)
5. Siehst du das Produkt im Warenkorb?

**✅ Erfolgreich wenn:**
- Produkt erscheint im Warenkorb
- Du kannst Anzahl ändern (+/-)

---

### 4️⃣ Test-Checkout (5 Min) - Optional

**⚠️ WICHTIG: Das ist TEST-Modus! Keine echten Zahlungen!**

1. Im Warenkorb: Klicke "Zur Kasse"
2. Du wirst zu **Stripe Checkout** weitergeleitet
3. **Nutze diese Test-Kreditkarte:**
   ```
   Kartennummer: 4242 4242 4242 4242
   MM/YY: 12/34
   CVC: 123
   PLZ: 12345
   ```
4. Klicke "Pay"

**✅ Erfolgreich wenn:**
- Du wirst zu "Bestellung erfolgreich" Seite weitergeleitet
- Du siehst die Bestellung unter "Meine Bestellungen"

**🐛 Falls Probleme:**
- Screenshot vom Error
- Wird zur Checkout-Seite weitergeleitet?
- Funktioniert Stripe?

---

### 5️⃣ Mobile Test (5 Min) - Falls du Handy hast

**Öffne auf deinem Smartphone:**
https://tailormp.vercel.app

**Teste:**
- [ ] Mobile Menu (☰ Icon) öffnet sich?
- [ ] Alle Seiten sehen OK aus?
- [ ] Buttons sind groß genug?
- [ ] Texte lesbar?
- [ ] Scrolling funktioniert?

**🐛 Was könnte schiefgehen:**
- Text zu klein
- Buttons zu klein zum Tippen
- Layout kaputt
- Horizontales Scrollen (sollte nicht sein!)

---

## 🐛 Bug Report - Was ich brauche

**Wenn du einen Bug findest, schick mir bitte:**

1. **Was hast du gemacht?**
   - "Ich habe auf Produkt XYZ geklickt"

2. **Was ist passiert?**
   - "Seite zeigt Error 500"

3. **Was hättest du erwartet?**
   - "Produkt-Detail Seite sollte laden"

4. **Screenshots** (wenn möglich)
   - Error Messages
   - Kaputtes Layout
   - Console Errors (F12 → Console Tab)

5. **Gerät/Browser:**
   - "iPhone 13, Safari" oder "Windows, Chrome"

---

## 💡 Feedback willkommen!

**Neben Bugs interessiert mich auch:**

- ✨ Was gefällt dir?
- 🤔 Was ist unklar/verwirrend?
- 💭 Was würdest du anders machen?
- 🎨 Wie findest du das Design?
- ⚡ Ist die App schnell genug?

---

## 📝 Beispiel Bug Report

**GUT:**
```
Bug: Produkte laden nicht
- Ich ging auf "Produkte" Seite
- Seite zeigt "Fehler beim Laden"
- Browser: Chrome, Windows 11
- Screenshot: [angehängt]
```

**WENIGER GUT:**
```
"Geht nicht"
```

😄 Je detaillierter, desto besser kann ich es fixen!

---

## ❓ Häufige Fragen

**Q: Ist das eine echte Kreditkarte?**
A: Nein! 4242 4242 4242 4242 ist eine Stripe **Test-Karte**. Es wird kein echtes Geld abgebucht.

**Q: Meine Daten sind sicher?**
A: Ja! Passwörter sind verschlüsselt. Aber nutze trotzdem ein Test-Passwort (nicht dein echtes).

**Q: Wie lange läuft der Test?**
A: So lange du magst! Die App bleibt online.

**Q: Kann ich mehrere Accounts erstellen?**
A: Ja! Gerne auch als TAILOR registrieren und testen.

---

## 🙏 Danke!

Dein Feedback hilft extrem, TailorMarket besser zu machen!

**Bei Fragen:**
- Schreib mir einfach!

**Happy Testing! 🚀**

---

**Version:** 1.0 (2025-12-21)
**Environment:** Development/Test
**Status:** Beta Testing Phase
