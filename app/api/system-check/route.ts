// app/api/system-check/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Type für Check-Ergebnisse
type CheckResult = {
  status: string;
  message: string;
  details?: string | Record<string, unknown>;
};

type SystemCheckResults = {
  timestamp: string;
  checks: Record<string, CheckResult>;
};

export async function GET() {
  const results: SystemCheckResults = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // ────────────────────────────────────────────
  // 1. ENV VARIABLEN CHECK
  // ────────────────────────────────────────────
  try {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasDbUrl = !!process.env.DATABASE_URL;

    results.checks.env = {
      status:
        hasUrl && hasAnonKey && hasServiceKey && hasDbUrl
          ? "✅ PASS"
          : "❌ FAIL",
      message: "Environment Variables",
      details: {
        SUPABASE_URL: hasUrl ? "✅" : "❌",
        SUPABASE_ANON_KEY: hasAnonKey ? "✅" : "❌",
        SUPABASE_SERVICE_ROLE_KEY: hasServiceKey ? "✅" : "❌",
        DATABASE_URL: hasDbUrl ? "✅" : "❌",
      },
    };
  } catch (error) {
    results.checks.env = {
      status: "❌ ERROR",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // ────────────────────────────────────────────
  // 2. SUPABASE CONNECTION CHECK
  // ────────────────────────────────────────────
  try {
    const { data, error } = await supabase
      .from("User")
      .select("count", { count: "exact", head: true });

    results.checks.supabase = {
      status: error ? "❌ FAIL" : "✅ PASS",
      message: "Supabase Connection",
      details: error ? error.message : "Connected successfully",
    };
  } catch (error) {
    results.checks.supabase = {
      status: "❌ ERROR",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // ────────────────────────────────────────────
  // 3. PRISMA CONNECTION CHECK
  // ────────────────────────────────────────────
  try {
    const userCount = await prisma.user.count();

    results.checks.prisma = {
      status: "✅ PASS",
      message: "Prisma Connection",
      details: `Found ${userCount} user(s) in database`,
    };
  } catch (error) {
    results.checks.prisma = {
      status: "❌ ERROR",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // ────────────────────────────────────────────
  // 4. AUTH CHECK (via Supabase)
  // ────────────────────────────────────────────
  try {
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers();

    results.checks.auth = {
      status: error ? "❌ FAIL" : "✅ PASS",
      message: "Supabase Auth",
      details: error
        ? error.message
        : `Found ${users?.length || 0} registered user(s)`,
    };
  } catch (error) {
    results.checks.auth = {
      status: "⚠️ SKIP",
      message:
        "Auth check requires service role key (skipped in browser context)",
    };
  }

  // ────────────────────────────────────────────
  // 5. STORAGE CHECK
  // ────────────────────────────────────────────
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    const hasProductImages = buckets?.some((b) => b.name === "product-images");

    results.checks.storage = {
      status: error ? "❌ FAIL" : hasProductImages ? "✅ PASS" : "⚠️ WARNING",
      message: "Supabase Storage",
      details: error
        ? error.message
        : hasProductImages
        ? "product-images bucket exists"
        : "product-images bucket NOT found",
    };
  } catch (error) {
    results.checks.storage = {
      status: "❌ ERROR",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // ────────────────────────────────────────────
  // 6. RLS CHECK (prüfen ob RLS aktiv ist)
  // ────────────────────────────────────────────
  try {
    // Versuche ohne Auth auf User-Tabelle zuzugreifen (sollte NICHT funktionieren)
    const { data, error } = await supabase.from("User").select("*").limit(1);

    results.checks.rls = {
      status: error ? "✅ PASS" : "⚠️ WARNING",
      message: "Row Level Security",
      details: error
        ? "RLS is active (unauthenticated access blocked)"
        : "WARNING: RLS might not be properly configured (unauthenticated access allowed)",
    };
  } catch (error) {
    results.checks.rls = {
      status: "❌ ERROR",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // ────────────────────────────────────────────
  // ZUSAMMENFASSUNG
  // ────────────────────────────────────────────
  const totalChecks = Object.keys(results.checks).length;
  const passedChecks = Object.values(results.checks).filter((c) =>
    c.status.includes("✅")
  ).length;
  const failedChecks = Object.values(results.checks).filter((c) =>
    c.status.includes("❌")
  ).length;

  results.checks.summary = {
    status: failedChecks === 0 ? "✅ ALL PASS" : "❌ ISSUES FOUND",
    message: `${passedChecks}/${totalChecks} checks passed`,
    details: {
      passed: passedChecks,
      failed: failedChecks,
      warnings: Object.values(results.checks).filter((c) =>
        c.status.includes("⚠️")
      ).length,
    },
  };

  await prisma.$disconnect();

  return NextResponse.json(results, { status: 200 });
}
