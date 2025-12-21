# 📧 Email System - Quick Start Guide

**Für:** User Testing
**Zeit:** 5-10 Minuten

---

## 🚀 Schnellstart (nur 3 Schritte!)

### Schritt 1: Resend Account erstellen (2 Min)

1. Gehe zu [resend.com/signup](https://resend.com/signup)
2. Registriere dich mit deiner Email
3. Verifiziere deine Email-Adresse
4. **Fertig!** Der Account ist bereit.

---

### Schritt 2: API Key holen (1 Min)

1. Gehe zu [resend.com/api-keys](https://resend.com/api-keys)
2. Klicke auf **"Create API Key"**
3. Name: "TailorMarket Development"
4. **Kopiere den Key** (beginnt mit `re_...`)

---

### Schritt 3: Key in .env.local einfügen (1 Min)

Öffne `.env.local` und füge hinzu:

```bash
RESEND_API_KEY="re_DEIN_KEY_HIER"
```

Speichern!

---

## ✅ Test-Emails versenden

### Dev-Server starten

```bash
npm run dev
```

### Öffne im Browser

**Willkommens-Email (Customer):**
```
http://localhost:3000/api/test-email?type=welcome&email=DEINE@EMAIL.com
```

**Willkommens-Email (Tailor):**
```
http://localhost:3000/api/test-email?type=welcome-tailor&email=DEINE@EMAIL.com
```

**Bestellbestätigung:**
```
http://localhost:3000/api/test-email?type=order-confirmation&email=DEINE@EMAIL.com
```

**Schneider-Benachrichtigung:**
```
http://localhost:3000/api/test-email?type=order-notification&email=DEINE@EMAIL.com
```

**Status-Updates:**
```
http://localhost:3000/api/test-email?type=order-status&status=measuring&email=DEINE@EMAIL.com
http://localhost:3000/api/test-email?type=order-status&status=production&email=DEINE@EMAIL.com
http://localhost:3000/api/test-email?type=order-status&status=shipping&email=DEINE@EMAIL.com
http://localhost:3000/api/test-email?type=order-status&status=completed&email=DEINE@EMAIL.com
```

---

## 📬 Check deine Inbox!

Nach dem Aufrufen der URL solltest du:
1. **Im Browser** eine Success-Message sehen
2. **In deiner Inbox** die Email erhalten (innerhalb von 1-2 Sekunden!)

**Kommt nichts an?**
- Check Spam-Ordner
- Check Resend Dashboard → Logs
- Check Terminal für Error Messages

---

## 🎨 Feedback geben

**Checkliste beim Review:**
- [ ] Sieht das Design gut aus?
- [ ] Sind die Texte verständlich?
- [ ] Funktionieren alle Links?
- [ ] Mobile Ansicht OK? (Email auf Handy öffnen)
- [ ] Gibt es Tippfehler?

**Änderungen gewünscht?**
Sag mir einfach Bescheid! Templates sind in `emails/` und einfach anzupassen.

---

## 💡 Tipps

**Free Tier Limits:**
- 100 Emails/Tag
- 3000 Emails/Monat
- Völlig ausreichend für Development & Testing!

**Domain verifizieren (später):**
Aktuell werden Emails von `onboarding@resend.dev` versendet.
Für Production später deine eigene Domain verifizieren.

---

**Das war's! 🎉**

Wenn alles funktioniert, sind die Email-Templates fertig und bereit für Production!
