
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products, categories, orders, cartItems, contactMessages, customDesigns, promos } from "@shared/schema";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.wifsqonbnfmwtqvupqbk:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Seed categories
    console.log("📂 Seeding categories...");
    const categoryData = [
      {
        name: "Mugs",
        namebn: "মগ",
        slug: "mugs",
        description: "Custom printed mugs",
        icon: "☕",
        isActive: true,
        sortOrder: 1
      },
      {
        name: "T-Shirts",
        namebn: "টি-শার্ট", 
        slug: "t-shirts",
        description: "Custom printed t-shirts",
        icon: "👕",
        isActive: true,
        sortOrder: 2
      },
      {
        name: "Bottles",
        namebn: "বোতল",
        slug: "bottles",
        description: "Custom water bottles",
        icon: "🍼",
        isActive: true,
        sortOrder: 3
      }
    ];

    for (const category of categoryData) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }

    // Seed products
    console.log("🛍️ Seeding products...");
    const productData = [
      {
        name: "Classic Mug",
        namebn: "ক্লাসিক মগ",
        description: "High quality ceramic mug perfect for custom designs",
        descriptionbn: "কাস্টম ডিজাইনের জন্য উচ্চ মানের সিরামিক মগ",
        price: "350",
        originalPrice: "450",
        category: "mugs",
        subcategory: "ceramic",
        images: ["/images/mug-classic.jpg"],
        tags: ["ceramic", "custom", "gift"],
        inStock: true,
        stockQuantity: 100,
        featured: true,
        isCustomizable: true
      },
      {
        name: "Cotton T-Shirt",
        namebn: "তুলার টি-শার্ট",
        description: "100% cotton t-shirt available in multiple colors",
        descriptionbn: "১০০% তুলার টি-শার্ট বিভিন্ন রঙে পাওয়া যায়",
        price: "450",
        originalPrice: "550", 
        category: "t-shirts",
        subcategory: "cotton",
        images: ["/images/tshirt-cotton.jpg"],
        tags: ["cotton", "comfortable", "custom"],
        inStock: true,
        stockQuantity: 50,
        featured: true,
        isCustomizable: true
      },
      {
        name: "Steel Water Bottle",
        namebn: "স্টিল পানির বোতল",
        description: "Stainless steel water bottle with custom engraving",
        descriptionbn: "কাস্টম খোদাই সহ স্টেইনলেস স্টিল পানির বোতল",
        price: "650",
        originalPrice: "750",
        category: "bottles", 
        subcategory: "steel",
        images: ["/images/bottle-steel.jpg"],
        tags: ["steel", "durable", "eco-friendly"],
        inStock: true,
        stockQuantity: 75,
        featured: true,
        isCustomizable: true
      }
    ];

    for (const product of productData) {
      await db.insert(products).values(product).onConflictDoNothing();
    }

    console.log("✅ Database seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  seed().catch(console.error);
}

export { seed };
