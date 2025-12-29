import prisma from "../app/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * R7.2 Seed Realistic Data für Suit-fokussierte Plattform
 *
 * Erstellt:
 * - 10-15 realistische Fabrics
 * - 3-5 Demo Tailors aus Vietnam
 * - 1 Admin User
 * - KEINE Demo Products (werden über Config-Flow erstellt)
 */

async function seedSuits() {
  console.log('🌱 Starting Suit-focused Database Seed...\n');

  try {
    // ======================
    // 1. ADMIN USER
    // ======================
    console.log('👤 Step 1: Creating Admin User...');

    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@tailormarket.com' },
      update: {},
      create: {
        email: 'admin@tailormarket.com',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'TailorMarket',
      }
    });

    console.log(`   ✅ Admin User: ${adminUser.email}`);
    console.log('');

    // ======================
    // 2. FABRICS LIBRARY
    // ======================
    console.log('🧵 Step 2: Creating Fabric Library...');

    const fabrics = [
      // SOLID COLORS (5)
      {
        name: 'Navy Blue Wool 120s',
        description: 'Klassische marineblaue Wolle, perfekt für Business-Anzüge. Ganzjährig tragbar.',
        material: '100% Wolle',
        weight: '260g/m²',
        pattern: 'Solid',
        color: 'Navy Blue',
        season: 'All Season',
        priceCategory: 'standard',
        priceAdd: 0,
        isActive: true,
        position: 1
      },
      {
        name: 'Charcoal Gray Wool 130s',
        description: 'Elegantes Anthrazitgrau mit feiner Struktur. Ideal für formelle Anlässe.',
        material: '100% Wolle',
        weight: '240g/m²',
        pattern: 'Solid',
        color: 'Charcoal Gray',
        season: 'All Season',
        priceCategory: 'premium',
        priceAdd: 50,
        isActive: true,
        position: 2
      },
      {
        name: 'Black Wool Super 150s',
        description: 'Premium schwarze Wolle mit seidigem Griff. Luxuriös und zeitlos.',
        material: '100% Wolle Super 150s',
        weight: '220g/m²',
        pattern: 'Solid',
        color: 'Black',
        season: 'All Season',
        priceCategory: 'luxury',
        priceAdd: 150,
        isActive: true,
        position: 3
      },
      {
        name: 'Light Gray Wool 110s',
        description: 'Helles Grau, perfekt für Sommer und helle Outfits. Leicht und atmungsaktiv.',
        material: '100% Wolle',
        weight: '280g/m²',
        pattern: 'Solid',
        color: 'Light Gray',
        season: 'Summer',
        priceCategory: 'standard',
        priceAdd: 0,
        isActive: true,
        position: 4
      },
      {
        name: 'Dark Gray Flannel',
        description: 'Warmes Flanell in Dunkelgrau. Ideal für Herbst und Winter.',
        material: '100% Wolle',
        weight: '320g/m²',
        pattern: 'Solid',
        color: 'Dark Gray',
        season: 'Winter',
        priceCategory: 'standard',
        priceAdd: 30,
        isActive: true,
        position: 5
      },

      // PINSTRIPE (3)
      {
        name: 'Navy Pinstripe Wool 120s',
        description: 'Klassischer Nadelstreifen in Navy. Zeitlos elegant für Business.',
        material: '100% Wolle',
        weight: '260g/m²',
        pattern: 'Pinstripe',
        color: 'Navy Blue',
        season: 'All Season',
        priceCategory: 'premium',
        priceAdd: 80,
        isActive: true,
        position: 6
      },
      {
        name: 'Charcoal Pinstripe Wool 130s',
        description: 'Anthrazit mit feinen weißen Nadelstreifen. Business-Premium.',
        material: '100% Wolle',
        weight: '240g/m²',
        pattern: 'Pinstripe',
        color: 'Charcoal Gray',
        season: 'All Season',
        priceCategory: 'premium',
        priceAdd: 80,
        isActive: true,
        position: 7
      },
      {
        name: 'Black Pinstripe Super 150s',
        description: 'Schwarzer Anzugstoff mit silbernen Nadelstreifen. Executive-Style.',
        material: '100% Wolle Super 150s',
        weight: '220g/m²',
        pattern: 'Pinstripe',
        color: 'Black',
        season: 'All Season',
        priceCategory: 'luxury',
        priceAdd: 180,
        isActive: true,
        position: 8
      },

      // CHECK (2)
      {
        name: 'Blue Check Wool 120s',
        description: 'Modernes Karomuster in Blautönen. Perfekt für moderne Businesslooks.',
        material: '100% Wolle',
        weight: '260g/m²',
        pattern: 'Check',
        color: 'Blue',
        season: 'All Season',
        priceCategory: 'premium',
        priceAdd: 70,
        isActive: true,
        position: 9
      },
      {
        name: 'Brown Check Wool 110s',
        description: 'Warmes Karomuster in Brauntönen. Vintage-Charme.',
        material: '100% Wolle',
        weight: '280g/m²',
        pattern: 'Check',
        color: 'Brown',
        season: 'Winter',
        priceCategory: 'standard',
        priceAdd: 40,
        isActive: true,
        position: 10
      },

      // HERRINGBONE (2)
      {
        name: 'Gray Herringbone Wool 120s',
        description: 'Klassisches Fischgrätmuster in Grau. Textur und Eleganz.',
        material: '100% Wolle',
        weight: '270g/m²',
        pattern: 'Herringbone',
        color: 'Gray',
        season: 'All Season',
        priceCategory: 'premium',
        priceAdd: 90,
        isActive: true,
        position: 11
      },
      {
        name: 'Navy Herringbone Wool 130s',
        description: 'Navy mit Fischgrätmuster. Subtile Struktur, formell und stilvoll.',
        material: '100% Wolle',
        weight: '250g/m²',
        pattern: 'Herringbone',
        color: 'Navy Blue',
        season: 'All Season',
        priceCategory: 'premium',
        priceAdd: 90,
        isActive: true,
        position: 12
      },

      // LUXURY BLENDS (3)
      {
        name: 'Navy Wool-Cashmere Blend',
        description: 'Exklusive Mischung aus Wolle und Kaschmir. Unglaublich weich und warm.',
        material: '90% Wolle, 10% Kaschmir',
        weight: '280g/m²',
        pattern: 'Solid',
        color: 'Navy Blue',
        season: 'Winter',
        priceCategory: 'luxury',
        priceAdd: 200,
        isActive: true,
        position: 13
      },
      {
        name: 'Charcoal Wool-Silk Blend',
        description: 'Wolle mit Seidenanteil für edlen Glanz. Luxuriös und leicht.',
        material: '95% Wolle, 5% Seide',
        weight: '240g/m²',
        pattern: 'Solid',
        color: 'Charcoal Gray',
        season: 'All Season',
        priceCategory: 'luxury',
        priceAdd: 180,
        isActive: true,
        position: 14
      },
      {
        name: 'Light Blue Linen-Wool Mix',
        description: 'Sommerleichte Mischung aus Leinen und Wolle. Atmungsaktiv und knitterarm.',
        material: '60% Wolle, 40% Leinen',
        weight: '220g/m²',
        pattern: 'Solid',
        color: 'Light Blue',
        season: 'Summer',
        priceCategory: 'premium',
        priceAdd: 100,
        isActive: true,
        position: 15
      }
    ];

    // Lösche alte Fabrics falls vorhanden (für Clean Seed)
    await prisma.fabric.deleteMany({});
    console.log('   🗑️  Cleared old fabrics');

    const createdFabrics = await Promise.all(
      fabrics.map(fabric =>
        prisma.fabric.create({
          data: fabric
        })
      )
    );

    console.log(`   ✅ Created ${createdFabrics.length} fabrics`);
    console.log('');

    // ======================
    // 3. VIETNAM TAILORS
    // ======================
    console.log('👔 Step 3: Creating Vietnamese Tailors...');

    const tailorUsers = [
      {
        email: 'nguyen.anh@tailormarket.com',
        firstName: 'Nguyen Van',
        lastName: 'Anh',
        tailorData: {
          name: 'Nguyen Van Anh',
          bio: 'Meisterschneider mit über 15 Jahren Erfahrung in Ho Chi Minh City. Spezialisiert auf Business-Anzüge und hat bereits für internationale Marken wie Hugo Boss gearbeitet.',
          country: 'Vietnam',
          city: 'Ho Chi Minh City',
          languages: ['Vietnamesisch', 'Englisch'],
          rating: 4.9,
          totalOrders: 287,
          yearsExperience: 15,
          specialties: ['Business Anzüge', 'Hochzeitsanzüge', 'Premium Stoffe'],
          isVerified: true,
        }
      },
      {
        email: 'tran.mai@tailormarket.com',
        firstName: 'Tran Thi',
        lastName: 'Mai',
        tailorData: {
          name: 'Tran Thi Mai',
          bio: 'Traditionelle Schneiderin aus Hanoi mit Fokus auf perfekte Passform. 12 Jahre Erfahrung und bekannt für ihre Präzision bei der Maßanfertigung.',
          country: 'Vietnam',
          city: 'Hanoi',
          languages: ['Vietnamesisch', 'Englisch', 'Französisch'],
          rating: 4.8,
          totalOrders: 195,
          yearsExperience: 12,
          specialties: ['Slim Fit Anzüge', 'Maßanpassungen', 'Hochwertige Stoffe'],
          isVerified: true,
        }
      },
      {
        email: 'le.nam@tailormarket.com',
        firstName: 'Le Hoang',
        lastName: 'Nam',
        tailorData: {
          name: 'Le Hoang Nam',
          bio: 'Dritte Generation Schneider aus Hoi An, der Schneider-Hauptstadt Vietnams. 20 Jahre Erfahrung und hat für Armani und andere Luxusmarken gefertigt.',
          country: 'Vietnam',
          city: 'Hoi An',
          languages: ['Vietnamesisch', 'Englisch'],
          rating: 5.0,
          totalOrders: 412,
          yearsExperience: 20,
          specialties: ['Premium Anzüge', 'Luxus-Stoffe', 'Traditionelle Handarbeit'],
          isVerified: true,
        }
      },
      {
        email: 'pham.linh@tailormarket.com',
        firstName: 'Pham',
        lastName: 'Linh',
        tailorData: {
          name: 'Pham Linh',
          bio: 'Junge und innovative Schneiderin aus Da Nang. 8 Jahre Erfahrung mit modernen Schnitten und zeitgemäßen Designs.',
          country: 'Vietnam',
          city: 'Da Nang',
          languages: ['Vietnamesisch', 'Englisch'],
          rating: 4.7,
          totalOrders: 134,
          yearsExperience: 8,
          specialties: ['Modern Fit', 'Slim Fit', 'Junge Mode'],
          isVerified: true,
        }
      },
      {
        email: 'vo.minh@tailormarket.com',
        firstName: 'Vo',
        lastName: 'Minh',
        tailorData: {
          name: 'Vo Minh',
          bio: 'Erfahrener Schneider aus Ho Chi Minh City mit Spezialisierung auf Hochzeitsanzüge. 18 Jahre Erfahrung und bekannt für exquisite Details.',
          country: 'Vietnam',
          city: 'Ho Chi Minh City',
          languages: ['Vietnamesisch', 'Englisch'],
          rating: 4.9,
          totalOrders: 321,
          yearsExperience: 18,
          specialties: ['Hochzeitsanzüge', 'Festliche Mode', 'Luxus-Details'],
          isVerified: true,
        }
      }
    ];

    const createdTailors = [];

    for (const tailorUser of tailorUsers) {
      const hashedPwd = await bcrypt.hash('Tailor123!', 10);

      const user = await prisma.user.upsert({
        where: { email: tailorUser.email },
        update: {},
        create: {
          email: tailorUser.email,
          password: hashedPwd,
          role: 'tailor',
          firstName: tailorUser.firstName,
          lastName: tailorUser.lastName,
        }
      });

      const tailor = await prisma.tailor.upsert({
        where: { user_id: user.id },
        update: tailorUser.tailorData,
        create: {
          user_id: user.id,
          ...tailorUser.tailorData
        }
      });

      createdTailors.push(tailor);
      console.log(`   ✅ ${tailor.name} (${tailor.city})`);
    }

    console.log('');

    // ======================
    // 4. TAILOR FABRICS (optional)
    // ======================
    console.log('🔗 Step 4: Linking Fabrics to Tailors...');

    // Alle Tailors haben Zugriff auf alle Fabrics
    // (in der Praxis würden sie selbst wählen)
    for (const tailor of createdTailors) {
      const fabricLinks = await Promise.all(
        createdFabrics.slice(0, 10).map((fabric, index) => // Erste 10 Fabrics
          prisma.tailorFabric.upsert({
            where: {
              tailorId_fabricId: {
                tailorId: tailor.id,
                fabricId: fabric.id
              }
            },
            update: {},
            create: {
              tailorId: tailor.id,
              fabricId: fabric.id,
              isAvailable: true,
              stockQuantity: 50,
              customPriceAdd: 0
            }
          })
        )
      );
      console.log(`   ✅ ${tailor.name}: ${fabricLinks.length} Stoffe verknüpft`);
    }

    console.log('');

    // ======================
    // FINAL SUMMARY
    // ======================
    console.log('📊 Seed Summary:');
    console.log(`   ✅ Admin Users: 1`);
    console.log(`   ✅ Fabrics: ${createdFabrics.length}`);
    console.log(`   ✅ Tailors: ${createdTailors.length}`);
    console.log(`   ✅ Products: 0 (werden über Config-Flow erstellt)`);
    console.log('');

    console.log('🔑 Login Credentials:');
    console.log('');
    console.log('   ADMIN:');
    console.log('   Email: admin@tailormarket.com');
    console.log('   Password: Admin123!');
    console.log('');
    console.log('   TAILORS (alle haben Password: Tailor123!):');
    tailorUsers.forEach(t => {
      console.log(`   - ${t.email}`);
    });
    console.log('');

    console.log('✅ Seed completed successfully!\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Führe Seed aus
seedSuits().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
