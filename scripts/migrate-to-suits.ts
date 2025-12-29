import { prisma } from '../app/lib/prisma';

/**
 * R7.1 Product Data Migration Script
 *
 * Bereinigt alte Produkt-Daten und migriert zu Anzug-fokussierter Struktur
 *
 * Strategie:
 * - Produkte mit category="Anzug" → konvertieren zu suit
 * - Andere Kategorien → löschen
 * - Neue suit-spezifische Felder füllen
 */

async function migrateToSuits() {
  console.log('🔄 Starting Product Data Migration to Suits...\n');

  try {
    // 1. ANALYSIEREN: Aktuelle Orders prüfen
    console.log('📊 Step 1: Analyzing existing data...');
    const ordersCount = await prisma.order.count();

    if (ordersCount > 0) {
      console.log(`⚠️  WARNING: Found ${ordersCount} existing orders.`);
      console.log('   Orders will be preserved, but product references may break.');
      console.log('   Consider archiving orders before migration.\n');

      const proceed = process.env.FORCE_MIGRATION === 'true';
      if (!proceed) {
        console.log('❌ Migration aborted. Set FORCE_MIGRATION=true to proceed anyway.\n');
        return;
      }
    } else {
      console.log('✅ No existing orders found. Safe to proceed.\n');
    }

    // 2. KATEGORISIEREN: Produkte analysieren
    console.log('📊 Step 2: Categorizing products...');

    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        suitModel: true
      }
    });

    console.log(`   Total products: ${allProducts.length}`);

    // Deutsch "Anzug" oder Englisch "suit"
    const suitProducts = allProducts.filter(p =>
      p.category?.toLowerCase() === 'anzug' ||
      p.category?.toLowerCase() === 'suit'
    );
    const otherProducts = allProducts.filter(p =>
      p.category?.toLowerCase() !== 'anzug' &&
      p.category?.toLowerCase() !== 'suit'
    );

    console.log(`   Suit products (will migrate): ${suitProducts.length}`);
    suitProducts.forEach(p => {
      console.log(`     - ${p.title} (${p.category})`);
    });

    console.log(`   Other products (will delete): ${otherProducts.length}`);
    otherProducts.forEach(p => {
      console.log(`     - ${p.title} (${p.category})`);
    });

    if (suitProducts.length === 0 && otherProducts.length === 0) {
      console.log('\n✅ No products to migrate. Database is clean.\n');
      return;
    }

    console.log('');

    // 3. LÖSCHEN: Nicht-Anzug Produkte
    if (otherProducts.length > 0) {
      console.log('🗑️  Step 3: Deleting non-suit products...');

      for (const product of otherProducts) {
        await prisma.product.delete({
          where: { id: product.id }
        });
        console.log(`   ✅ Deleted: ${product.title}`);
      }

      console.log(`   ✅ Deleted ${otherProducts.length} non-suit products\n`);
    } else {
      console.log('✅ Step 3: No non-suit products to delete\n');
    }

    // 4. MIGRIEREN: Suit Products auf neues Schema updaten
    if (suitProducts.length > 0) {
      console.log('🔄 Step 4: Migrating suit products to new schema...');

      for (const product of suitProducts) {
        // Nur updaten wenn suitModel noch nicht gesetzt ist
        if (!product.suitModel) {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              category: 'suit',           // Standardisiere auf Englisch
              suitModel: 'classic',       // Default: Classic Suit
              fitType: 'regular',         // Default: Regular Fit
              lapelStyle: 'notch',        // Default: Notch Lapel
              ventStyle: 'single',        // Default: Single Vent
              buttonCount: 2,             // Default: 2 Buttons
              pocketStyle: 'flap',        // Default: Flap Pockets
              // fabricId bleibt null - muss später manuell zugewiesen werden
            }
          });
          console.log(`   ✅ Migrated: ${product.title} → Classic Suit (Regular Fit)`);
        } else {
          console.log(`   ⏭️  Skipped: ${product.title} (already has suitModel)`);
        }
      }

      console.log(`   ✅ Migrated ${suitProducts.length} suit products\n`);
    } else {
      console.log('✅ Step 4: No suit products to migrate\n');
    }

    // 5. VERIFIZIEREN: Finale Statistiken
    console.log('📊 Step 5: Verification...');

    const finalTotal = await prisma.product.count();
    const finalSuits = await prisma.product.count({
      where: { category: 'suit' }
    });
    const withSuitModel = await prisma.product.count({
      where: { suitModel: { not: null } }
    });

    console.log(`   Total products remaining: ${finalTotal}`);
    console.log(`   Products with category="suit": ${finalSuits}`);
    console.log(`   Products with suitModel filled: ${withSuitModel}`);

    if (finalTotal === finalSuits && finalSuits === withSuitModel) {
      console.log('   ✅ All products successfully migrated!\n');
    } else {
      console.log('   ⚠️  Some inconsistencies detected. Review manually.\n');
    }

    // 6. HINWEISE
    console.log('📝 Next Steps:');
    console.log('   1. Review migrated products in database');
    console.log('   2. Assign fabricId to products (if using Fabric Library)');
    console.log('   3. Run seed script to populate Fabrics (R7.2)');
    console.log('   4. Test product display on frontend\n');

    console.log('✅ Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Führe Migration aus
migrateToSuits().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
