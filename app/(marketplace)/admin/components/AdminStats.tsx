import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, Package, DollarSign } from "lucide-react";

interface AdminStatsProps {
  stats: {
    users: {
      total: number;
      tailors: number;
      customers: number;
      newInPeriod: number;
    };
    orders: {
      total: number;
      inPeriod: number;
    };
    revenue: {
      total: number;
      platformFees: number;
    };
    products: {
      total: number;
      active: number;
    };
  };
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Users Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Benutzer</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.users.tailors} Schneider · {stats.users.customers} Kunden
          </p>
          <p className="text-xs text-green-600 mt-1">
            +{stats.users.newInPeriod} neu
          </p>
        </CardContent>
      </Card>

      {/* Orders Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bestellungen</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.orders.total}</div>
          <p className="text-xs text-muted-foreground">Gesamt</p>
          <p className="text-xs text-green-600 mt-1">
            +{stats.orders.inPeriod} in Periode
          </p>
        </CardContent>
      </Card>

      {/* Products Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produkte</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.products.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.products.active} aktiv
          </p>
        </CardContent>
      </Card>

      {/* Revenue Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            €{stats.revenue.total.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Gesamt</p>
          <p className="text-xs text-green-600 mt-1">
            €{stats.revenue.platformFees.toFixed(2)} Gebühren
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
