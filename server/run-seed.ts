import { db } from "./storage";
import { products, categories, orders, contactMessages } from "@shared/schema";
import { seedData } from "./seed-data";

async function runSeed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data to avoid conflicts
    await db.delete(contactMessages);
    await db.delete(orders);
    await db.delete(products);
    await db.delete(categories);

    // Insert fresh data
    await db.insert(categories).values(seedData.categories);
    console.log("✅ Categories seeded");

    await db.insert(products).values(seedData.products);
    console.log("✅ Products seeded");

    await db.insert(orders).values(seedData.orders);
    console.log("✅ Orders seeded");

    await db.insert(contactMessages).values(seedData.contactMessages);
    console.log("✅ Contact messages seeded");

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  runSeed();
}