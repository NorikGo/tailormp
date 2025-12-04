/**
 * Order Status Constants
 * Zentrale Definition für alle Order-Status-Werte, Labels und Colors
 * Verhindert Code-Duplikation über mehrere Komponenten hinweg
 */

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Ausstehend",
  paid: "Bezahlt",
  processing: "In Bearbeitung",
  shipped: "Versandt",
  delivered: "Zugestellt",
  cancelled: "Storniert",
} as const;

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
} as const;

/**
 * Hilfsfunktion zum Abrufen des Status-Labels
 */
export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status as OrderStatus] || status;
}

/**
 * Hilfsfunktion zum Abrufen der Status-Farbe
 */
export function getOrderStatusColor(status: string): string {
  return ORDER_STATUS_COLORS[status as OrderStatus] || "bg-gray-100 text-gray-800";
}
