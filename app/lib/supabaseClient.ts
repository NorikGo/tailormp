// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(`
    Supabase ENV variables missing!
    URL: ${url ? "OK" : "MISSING"}
    ANON_KEY: ${anonKey ? "OK" : "MISSING"}
  `);
}

export const supabase = createClient(url, anonKey);

// HINWEIS: supabaseAdmin (mit SERVICE_ROLE_KEY) nur server-seitig verwenden!
// Wenn du ihn brauchst, erstelle eine separate Datei für server-only code
