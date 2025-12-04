/**
 * Migration Script: Copy basePrice → price
 *
 * This script copies all basePrice values to the price field
 * before we drop the basePrice column from the schema.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting price field migration...\n');

  // 1. Find all products with basePrice but no price (or price = 0)
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      basePrice: true,
    },
  });

  console.log(`Found ${products.length} products to check\n`);

  // 2. Update price field with basePrice value where needed
  let updatedCount = 0;

  for (const product of products) {
    // @ts-ignore - basePrice exists in current schema
    const basePrice = product.basePrice;
    const currentPrice = product.price;

    // If basePrice has a value and price is 0 or null, copy it
    if (basePrice && basePrice > 0 && (!currentPrice || currentPrice === 0)) {
      console.log(`Updating "${product.title}": basePrice ${basePrice} → price`);

      await prisma.product.update({
        where: { id: product.id },
        data: { price: basePrice },
      });

      updatedCount++;
    } else if (basePrice && currentPrice && basePrice !== currentPrice) {
      console.log(`⚠️  Conflict in "${product.title}": price=${currentPrice}, basePrice=${basePrice}`);
      console.log(`   → Keeping current price=${currentPrice}`);
    } else if (currentPrice && currentPrice > 0) {
      console.log(`✓ "${product.title}": price already set (${currentPrice})`);
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   Updated: ${updatedCount} products`);
  console.log(`   Total: ${products.length} products checked`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Migration failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
