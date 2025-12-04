/**
 * Environment Variables Configuration
 * Zentrale Verwaltung aller Umgebungsvariablen mit Validierung
 *
 * Vorteile:
 * - Type-safe Zugriff auf Env-Vars
 * - Frühe Validierung beim App-Start
 * - Single Source of Truth
 * - Bessere Testbarkeit
 */

/**
 * Validiert und gibt eine erforderliche Umgebungsvariable zurück
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Gibt eine optionale Umgebungsvariable zurück (mit Default-Wert)
 */
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Supabase Configuration
 */
export const supabase = {
  url: getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  anonKey: getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  serviceRoleKey: getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
} as const;

/**
 * Database Configuration
 */
export const database = {
  url: getRequiredEnv("DATABASE_URL"),
} as const;

/**
 * Stripe Configuration
 */
export const stripe = {
  secretKey: getRequiredEnv("STRIPE_SECRET_KEY"),
  publishableKey: getRequiredEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  webhookSecret: getRequiredEnv("STRIPE_WEBHOOK_SECRET"),
} as const;

/**
 * Platform Configuration
 */
export const platform = {
  commissionPercentage: parseInt(
    getOptionalEnv("PLATFORM_COMMISSION_PERCENTAGE", "10"),
    10
  ),
  name: "TailorMarket",
  url: getOptionalEnv("NEXT_PUBLIC_URL", "http://localhost:3000"),
} as const;

/**
 * Measurement Provider Configuration
 */
export const measurement = {
  provider: getOptionalEnv("MEASUREMENT_PROVIDER", "mock") as "mock" | "manual" | "3dlook",
} as const;

/**
 * Email Configuration (optional für MVP)
 */
export const email = {
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL || "noreply@tailormarket.com",
} as const;

/**
 * Monitoring Configuration (optional)
 */
export const monitoring = {
  sentryDsn: process.env.SENTRY_DSN,
} as const;

/**
 * Environment Info
 */
export const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  nodeEnv: process.env.NODE_ENV || "development",
} as const;

/**
 * Export all as default für einfachen Import
 */
export default {
  supabase,
  database,
  stripe,
  platform,
  measurement,
  email,
  monitoring,
  env,
} as const;
