"use client";

import { SuitConfigProvider } from "@/app/contexts/SuitConfigContext";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuitConfigProvider>{children}</SuitConfigProvider>;
}
