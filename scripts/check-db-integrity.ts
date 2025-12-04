import prisma from '../app/lib/prisma';

async function checkDatabaseIntegrity() {
  console.log('🔍 Checking Database Integrity...\n');

  // Count records in each table
  const counts = {
    users: await prisma.user.count(),
    tailors: await prisma.tailor.count(),
    products: await prisma.product.count(),
    productImages: await prisma.productImage.count(),
    orders: await prisma.order.count(),
    orderItems: await prisma.orderItem.count(),
    reviews: await prisma.review.count(),
    carts: await prisma.cart.count(),
    cartItems: await prisma.cartItem.count(),
    measurementSessions: await prisma.measurementSession.count(),
  };

  console.log('📊 Record Counts:');
  console.log(JSON.stringify(counts, null, 2));

  // Check for products with zero or negative price
  const productsWithInvalidPrice = await prisma.product.findMany({
    where: {
      price: { lte: 0 }
    },
    select: {
      id: true,
      title: true,
      price: true,
    }
  });

  if (productsWithInvalidPrice.length > 0) {
    console.log('\n⚠️  Products with invalid price (≤ 0):');
    console.log(productsWithInvalidPrice);
  } else {
    console.log('\n✅ All products have valid prices (> 0)');
  }

  // Check for orphaned cart items
  const cartItems = await prisma.cartItem.count();
  const cartsWithItems = await prisma.cart.count({
    where: {
      items: {
        some: {}
      }
    }
  });

  console.log(`\n🛒 Cart Stats:`);
  console.log(`   Total Cart Items: ${cartItems}`);
  console.log(`   Carts with Items: ${cartsWithItems}`);

  // Check for orders
  if (counts.orders > 0) {
    const orderStatuses = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });
    console.log('\n📦 Order Statuses:');
    orderStatuses.forEach(status => {
      console.log(`   ${status.status}: ${status._count}`);
    });
  }

  console.log('\n✅ Database Integrity Check Complete!');
}

checkDatabaseIntegrity()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
