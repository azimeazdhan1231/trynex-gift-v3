
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products, categories } from "@shared/schema";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.wifsqonbnfmwtqvupqbk:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const client = postgres(connectionString, {
  ssl: 'require',
  max: 1,
});

const db = drizzle(client);

const sampleCategories = [
  { name: "Custom Mugs", namebn: "কাস্টম মগ", description: "Personalized mugs for every occasion", descriptionbn: "প্রতিটি অনুষ্ঠানের জন্য ব্যক্তিগতকৃত মগ" },
  { name: "T-Shirts", namebn: "টি-শার্ট", description: "Custom printed t-shirts", descriptionbn: "কাস্টম প্রিন্টেড টি-শার্ট" },
  { name: "Water Bottles", namebn: "পানির বোতল", description: "Personalized water bottles", descriptionbn: "ব্যক্তিগতকৃত পানির বোতল" },
  { name: "Hoodies", namebn: "হুডি", description: "Custom hoodies and sweatshirts", descriptionbn: "কাস্টম হুডি এবং সোয়েটশার্ট" },
  { name: "Caps & Hats", namebn: "ক্যাপ ও টুপি", description: "Personalized caps and hats", descriptionbn: "ব্যক্তিগতকৃত ক্যাপ ও টুপি" },
  { name: "Bags", namebn: "ব্যাগ", description: "Custom bags and backpacks", descriptionbn: "কাস্টম ব্যাগ এবং ব্যাকপ্যাক" }
];

const sampleProducts = [
  {
    name: "Custom Photo Mug",
    namebn: "কাস্টম ফটো মগ",
    description: "High-quality ceramic mug with your custom photo",
    descriptionbn: "আপনার কাস্টম ফটো সহ উচ্চমানের সিরামিক মগ",
    price: "350",
    category: "Custom Mugs",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
    stockQuantity: 100,
    isFeatured: true
  },
  {
    name: "Personalized T-Shirt",
    namebn: "ব্যক্তিগতকৃত টি-শার্ট",
    description: "Comfortable cotton t-shirt with custom design",
    descriptionbn: "কাস্টম ডিজাইন সহ আরামদায়ক কটন টি-শার্ট",
    price: "450",
    category: "T-Shirts",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
    stockQuantity: 80,
    isFeatured: true
  },
  {
    name: "Custom Water Bottle",
    namebn: "কাস্টম পানির বোতল",
    description: "Stainless steel water bottle with your design",
    descriptionbn: "আপনার ডিজাইন সহ স্টেইনলেস স্টিল পানির বোতল",
    price: "550",
    category: "Water Bottles",
    images: ["https://images.unsplash.com/photo-1551538827-9c037cb4f32a"],
    stockQuantity: 60,
    isFeatured: false
  },
  {
    name: "Premium Hoodie",
    namebn: "প্রিমিয়াম হুডি",
    description: "Warm and comfortable hoodie with custom print",
    descriptionbn: "কাস্টম প্রিন্ট সহ উষ্ণ এবং আরামদায়ক হুডি",
    price: "850",
    category: "Hoodies",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7"],
    stockQuantity: 40,
    isFeatured: true
  },
  {
    name: "Custom Baseball Cap",
    namebn: "কাস্টম বেসবল ক্যাপ",
    description: "Adjustable baseball cap with embroidered design",
    descriptionbn: "এমব্রয়ডারি ডিজাইন সহ সামঞ্জস্যযোগ্য বেসবল ক্যাপ",
    price: "400",
    category: "Caps & Hats",
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b"],
    stockQuantity: 70,
    isFeatured: false
  },
  {
    name: "Custom Tote Bag",
    namebn: "কাস্টম টোট ব্যাগ",
    description: "Eco-friendly canvas tote bag with your design",
    descriptionbn: "আপনার ডিজাইন সহ পরিবেশবান্ধব ক্যানভাস টোট ব্যাগ",
    price: "300",
    category: "Bags",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"],
    stockQuantity: 90,
    isFeatured: false
  }
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Insert categories
    console.log("📁 Inserting categories...");
    for (const category of sampleCategories) {
      await db.insert(categories).values({
        ...category,
        createdAt: new Date(),
      }).onConflictDoNothing();
    }

    // Insert products
    console.log("📦 Inserting products...");
    for (const product of sampleProducts) {
      await db.insert(products).values({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoNothing();
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.end();
  }
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed();
}

export { seed };
