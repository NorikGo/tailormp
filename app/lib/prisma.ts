// app/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Verhindert mehrfachen Prisma Client im Dev-Modus
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Default export für backward compatibility
export default prisma;
