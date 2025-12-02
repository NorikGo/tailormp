import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/app/lib/prisma";

/**
 * GET /api/admin/stats
 * Get platform-wide statistics (Admin only)
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

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get date range from query params (default: last 30 days)
    const url = new URL(req.url);
    const daysParam = url.searchParams.get("days");
    const days = daysParam ? parseInt(daysParam) : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all users statistics
    const totalUsers = await prisma.user.count();
    const totalTailors = await prisma.user.count({
      where: { role: "tailor" },
    });
    const totalCustomers = await prisma.user.count({
      where: { role: "customer" },
    });
    const newUsersInPeriod = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get orders statistics
    const totalOrders = await prisma.order.count();
    const ordersInPeriod = await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        totalAmount: true,
        platformFee: true,
        status: true,
        createdAt: true,
      },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalPlatformFees = orders.reduce(
      (sum, order) => sum + order.platformFee,
      0
    );

    // Order status breakdown
    const statusBreakdown = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Revenue by day
    const revenueByDay = orders.reduce(
      (acc, order) => {
        const date = order.createdAt.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = {
            revenue: 0,
            platformFees: 0,
            orders: 0,
          };
        }
        acc[date].revenue += order.totalAmount;
        acc[date].platformFees += order.platformFee;
        acc[date].orders += 1;
        return acc;
      },
      {} as Record<
        string,
        { revenue: number; platformFees: number; orders: number }
      >
    );

    const revenueChartData = Object.entries(revenueByDay)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Get products statistics
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({
      where: { isActive: true },
    });

    // Get top tailors by revenue
    const topTailors = await prisma.tailor.findMany({
      take: 5,
      orderBy: {
        totalOrders: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        items: {
          select: {
            productTitle: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        stats: {
          period: {
            days,
            startDate: startDate.toISOString(),
            endDate: new Date().toISOString(),
          },
          users: {
            total: totalUsers,
            tailors: totalTailors,
            customers: totalCustomers,
            newInPeriod: newUsersInPeriod,
          },
          orders: {
            total: totalOrders,
            inPeriod: ordersInPeriod,
            statusBreakdown,
          },
          revenue: {
            total: totalRevenue,
            platformFees: totalPlatformFees,
            chartData: revenueChartData,
          },
          products: {
            total: totalProducts,
            active: activeProducts,
          },
          topTailors,
          recentUsers,
          recentOrders,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
