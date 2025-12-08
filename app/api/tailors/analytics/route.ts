import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/app/lib/prisma";

/**
 * GET /api/tailors/analytics
 * Get analytics data for authenticated tailor
 */
export async function GET(req: NextRequest) {
  try {
    // Auth check with Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Get tailor profile
    const tailorProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: { tailor: true },
    });

    if (!tailorProfile?.tailor) {
      return NextResponse.json(
        { error: "Tailor profile not found" },
        { status: 404 }
      );
    }

    const tailorId = tailorProfile.tailor.id;

    // Get date range from query params (default: last 30 days)
    const url = new URL(req.url);
    const daysParam = url.searchParams.get("days");
    const days = daysParam ? parseInt(daysParam) : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all orders containing tailor's products
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            tailorId: tailorId,
          },
        },
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        items: {
          where: {
            tailorId: tailorId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const tailorItems = order.items.filter(
        (item) => item.tailorId === tailorId
      );
      const orderTailorTotal = tailorItems.reduce(
        (itemSum, item) => itemSum + item.subtotal,
        0
      );
      return sum + orderTailorTotal;
    }, 0);

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Order status breakdown
    const statusBreakdown = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Revenue by day (for chart)
    const revenueByDay = orders.reduce(
      (acc, order) => {
        const date = order.createdAt.toISOString().split("T")[0];
        const tailorItems = order.items.filter(
          (item) => item.tailorId === tailorId
        );
        const dayRevenue = tailorItems.reduce(
          (sum, item) => sum + item.subtotal,
          0
        );

        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += dayRevenue;
        return acc;
      },
      {} as Record<string, number>
    );

    // Convert to array and sort by date
    const revenueChartData = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top selling products
    const productSales = orders.reduce(
      (acc, order) => {
        order.items.forEach((item) => {
          if (!acc[item.productId]) {
            acc[item.productId] = {
              productId: item.productId,
              title: item.productTitle,
              quantity: 0,
              revenue: 0,
            };
          }
          acc[item.productId].quantity += item.quantity;
          acc[item.productId].revenue += item.subtotal;
        });
        return acc;
      },
      {} as Record<
        string,
        { productId: string; title: string; quantity: number; revenue: number }
      >
    );

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent orders (last 10)
    const recentOrders = orders.slice(0, 10).map((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: order.items.reduce((sum, item) => sum + item.subtotal, 0),
      createdAt: order.createdAt,
      itemCount: order.items.length,
    }));

    // Platform fee calculation (10%)
    const platformFeeTotal = totalRevenue * 0.1;
    const netRevenue = totalRevenue - platformFeeTotal;

    return NextResponse.json(
      {
        analytics: {
          period: {
            days,
            startDate: startDate.toISOString(),
            endDate: new Date().toISOString(),
          },
          overview: {
            totalOrders,
            totalRevenue,
            netRevenue,
            platformFeeTotal,
            avgOrderValue,
          },
          statusBreakdown,
          revenueChartData,
          topProducts,
          recentOrders,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
