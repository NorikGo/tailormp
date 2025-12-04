import prisma from "../app/lib/prisma";

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Create test users first (needed for tailors and products)
  // Note: In production, passwords should be hashed. For testing, using plain text.
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "tailor1@test.com" },
      update: {},
      create: {
        email: "tailor1@test.com",
        password: "password123",
        role: "tailor",
        firstName: "Nguyen Van",
        lastName: "Thai",
      },
    }),
    prisma.user.upsert({
      where: { email: "tailor2@test.com" },
      update: {},
      create: {
        email: "tailor2@test.com",
        password: "password123",
        role: "tailor",
        firstName: "Somchai",
        lastName: "Patel",
      },
    }),
    prisma.user.upsert({
      where: { email: "tailor3@test.com" },
      update: {},
      create: {
        email: "tailor3@test.com",
        password: "password123",
        role: "tailor",
        firstName: "Rajesh",
        lastName: "Kumar",
      },
    }),
    prisma.user.upsert({
      where: { email: "customer@test.com" },
      update: {},
      create: {
        email: "customer@test.com",
        password: "password123",
        role: "customer",
        firstName: "Test",
        lastName: "Customer",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create tailors
  const tailors = await Promise.all([
    prisma.tailor.upsert({
      where: { user_id: users[0].id },
      update: {},
      create: {
        user_id: users[0].id,
        name: "Nguyen Van Thai",
        bio: "Spezialisiert auf maßgeschneiderte Anzüge mit über 15 Jahren Erfahrung.",
        country: "Vietnam",
        languages: ["Vietnamesisch", "Englisch"],
        rating: 4.9,
        totalOrders: 287,
        yearsExperience: 15,
        specialties: ["Anzüge", "Hemden", "Hosen"],
        isVerified: true,
      },
    }),
    prisma.tailor.upsert({
      where: { user_id: users[1].id },
      update: {},
      create: {
        user_id: users[1].id,
        name: "Somchai Patel",
        bio: "Traditioneller Schneider aus Bangkok.",
        country: "Thailand",
        languages: ["Thai", "Englisch"],
        rating: 4.8,
        totalOrders: 195,
        yearsExperience: 12,
        specialties: ["Hemden", "Anzüge"],
        isVerified: true,
      },
    }),
    prisma.tailor.upsert({
      where: { user_id: users[2].id },
      update: {},
      create: {
        user_id: users[2].id,
        name: "Rajesh Kumar",
        bio: "Meisterschneider aus Mumbai mit Fokus auf Hochzeitsanzüge.",
        country: "Indien",
        languages: ["Hindi", "Englisch"],
        rating: 4.7,
        totalOrders: 412,
        yearsExperience: 20,
        specialties: ["Anzüge", "Brautmode", "Mäntel"],
        isVerified: true,
      },
    }),
  ]);

  console.log(`✅ Created ${tailors.length} tailors`);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        tailorId: tailors[0].id,
        title: "Premium Business Anzug",
        description:
          "Klassischer 2-teiliger Anzug aus italienischer Wolle. Perfekt für geschäftliche Anlässe.",
        price: 599,
        category: "Anzug",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        tailorId: tailors[0].id,
        title: "Maßgeschneidertes Hemd",
        description:
          "Elegantes Hemd aus ägyptischer Baumwolle. Verschiedene Farben verfügbar.",
        price: 89,
        category: "Hemd",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        tailorId: tailors[1].id,
        title: "Slim-Fit Anzug",
        description:
          "Moderner Slim-Fit Anzug für den zeitgemäßen Gentleman.",
        price: 549,
        category: "Anzug",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        tailorId: tailors[2].id,
        title: "Hochzeitsanzug Deluxe",
        description:
          "Luxuriöser 3-teiliger Hochzeitsanzug mit Weste. Perfekt für den großen Tag.",
        price: 899,
        category: "Anzug",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        tailorId: tailors[2].id,
        title: "Winter Mantel",
        description:
          "Eleganter Wollmantel für die kalte Jahreszeit. Zeitloses Design.",
        price: 449,
        category: "Mantel",
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📝 Test credentials:");
  console.log("Tailor 1: tailor1@test.com");
  console.log("Tailor 2: tailor2@test.com");
  console.log("Tailor 3: tailor3@test.com");
  console.log("Customer: customer@test.com");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
