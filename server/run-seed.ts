
import { db } from "./storage";
import { products, categories, orders, contactMessages } from "@shared/schema";
import { seedData } from "./seed-data";

async function runSeed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data in reverse order to handle foreign key constraints
    console.log("🧹 Cleaning existing data...");
    await db.delete(contactMessages);
    console.log("✅ Contact messages cleared");
    
    await db.delete(orders);
    console.log("✅ Orders cleared");
    
    await db.delete(products);
    console.log("✅ Products cleared");
    
    await db.delete(categories);
    console.log("✅ Categories cleared");

    // Insert fresh data
    console.log("📝 Inserting categories...");
    const insertedCategories = await db.insert(categories).values(seedData.categories).returning();
    console.log(`✅ ${insertedCategories.length} categories seeded`);

    console.log("📝 Inserting products...");
    const insertedProducts = await db.insert(products).values(seedData.products).returning();
    console.log(`✅ ${insertedProducts.length} products seeded`);

    console.log("📝 Inserting orders...");
    const insertedOrders = await db.insert(orders).values(seedData.orders).returning();
    console.log(`✅ ${insertedOrders.length} orders seeded`);

    console.log("📝 Inserting contact messages...");
    const insertedMessages = await db.insert(contactMessages).values(seedData.contactMessages).returning();
    console.log(`✅ ${insertedMessages.length} contact messages seeded`);

    console.log("🎉 Database seeded successfully!");
    console.log(`
Summary:
- Categories: ${insertedCategories.length}
- Products: ${insertedProducts.length}
- Orders: ${insertedOrders.length}
- Contact Messages: ${insertedMessages.length}
    `);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  runSeed().finally(() => {
    process.exit(0);
  });
}

export { runSeed };
