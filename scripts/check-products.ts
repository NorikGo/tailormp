import prisma from "../app/lib/prisma";

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        tailor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("\n=== Products in Database ===");
    console.log(`Total products found: ${products.length}\n`);

    if (products.length === 0) {
      console.log("❌ No products found in database!");
    } else {
      products.forEach((product) => {
        console.log(`ID: ${product.id}`);
        console.log(`Title: ${product.title}`);
        console.log(`Price: €${product.price}`);
        console.log(`Active: ${product.isActive}`);
        console.log(`Tailor: ${product.tailor.name}`);
        console.log("---");
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
