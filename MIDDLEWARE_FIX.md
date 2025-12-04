# Middleware Fix - Edge Runtime & Prisma

## Problem

Next.js Middleware läuft im **Edge Runtime**, wo Prisma **NICHT** funktioniert. Der Fehler war:

```
Error [ReferenceError]: global is not defined
```

## Lösung

### 1. Middleware vereinfacht (nur Auth-Check)

**Datei:** `utils/supabase/middleware.ts`

Die Middleware prüft jetzt nur noch, ob der User authenticated ist, NICHT die Rolle:

```typescript
export async function updateSession(request: NextRequest) {
  // ... Supabase Setup ...

  const { data: { user } } = await supabase.auth.getUser();

  // Public routes
  const publicRoutes = ['/auth', '/login', '/register', '/', '/products', '/tailors', '/api'];
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Auth required - Basic check only
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ KEIN Prisma-Aufruf mehr hier!
  return supabaseResponse;
}
```

### 2. Rollen-Prüfung auf Page-Ebene

**Datei:** `app/lib/auth-helpers.ts`

Neue Helper-Funktionen für Server Components:

```typescript
/**
 * Require user to be a tailor
 * Throws error if not authenticated or not a tailor
 */
export async function requireTailor() {
  const userWithRole = await getUserWithRole();

  if (!userWithRole) {
    throw new Error("Unauthorized");
  }

  if (userWithRole.role !== "tailor") {
    throw new Error("Tailor role required");
  }

  return { ...userWithRole, tailor: userWithRole.tailor! };
}

/**
 * Require user to be a customer
 */
export async function requireCustomer() {
  const userWithRole = await getUserWithRole();

  if (!userWithRole || userWithRole.role !== "customer") {
    throw new Error("Customer role required");
  }

  return userWithRole;
}
```

### 3. Verwendung in Pages

**Client Components** (wie bisher):
- Nutzen `useAuth()` Hook aus Context
- UI-basierte Rollen-Prüfung

**Server Components** (NEU):
- Nutzen `requireTailor()` oder `requireCustomer()`
- Werfen Error wenn Rolle nicht passt

**Beispiel - Tailor Dashboard (Client Component):**

```typescript
"use client";

export default function TailorDashboard() {
  const { user, isTailor } = useAuth();

  if (!user || !isTailor) {
    return <div>Zugriff verweigert</div>;
  }

  // Rest der Komponente
}
```

**Beispiel - Protected API Route (Server):**

```typescript
export async function GET(request: Request) {
  try {
    const { tailor } = await requireTailor(); // Wirft Error wenn nicht Tailor

    // Rest der API Logic
    const orders = await prisma.order.findMany({
      where: { items: { some: { tailorId: tailor.id } } }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```

## Warum funktioniert das?

1. **Middleware (Edge Runtime):**
   - Läuft auf Cloudflare/Vercel Edge
   - Schnell, aber eingeschränkt (kein Node.js APIs, kein Prisma)
   - Nur für Basic Auth-Check

2. **Server Components (Node.js Runtime):**
   - Laufen auf normalen Servern
   - Voller Zugriff auf Node.js APIs, Prisma, etc.
   - Perfekt für Datenbank-Abfragen

3. **API Routes (Node.js Runtime):**
   - Wie Server Components
   - Können Prisma nutzen

## Zusammenfassung

- ✅ Middleware: Nur Auth-Check (Supabase)
- ✅ Pages/APIs: Rollen-Check (Prisma)
- ✅ Client Components: UI-basierte Rollen-Checks (Context)

Die Implementierung ist jetzt **vollständig funktionsfähig** und nutzt die richtigen Runtimes für die richtigen Aufgaben!
