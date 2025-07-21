
import { db } from "./storage.js";
import { products, categories } from "../shared/schema.js";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Insert categories
    await db.insert(categories).values([
      {
        name: "Custom Gifts",
        namebn: "কাস্টম উপহার",
        slug: "custom-gifts",
        description: "Personalized gifts for special occasions",
        icon: "🎁",
        isActive: true,
        sortOrder: 1
      },
      {
        name: "Home Decor",
        namebn: "ঘর সাজানোর জিনিস",
        slug: "home-decor", 
        description: "Beautiful items for your home",
        icon: "🏠",
        isActive: true,
        sortOrder: 2
      },
      {
        name: "Fashion",
        namebn: "ফ্যাশন",
        slug: "fashion",
        description: "Trendy clothing and accessories",
        icon: "👕",
        isActive: true,
        sortOrder: 3
      }
    ]);

    // Insert products
    await db.insert(products).values([
      {
        name: "Custom Photo Mug",
        namebn: "কাস্টম ফটো মগ",
        description: "Personalized ceramic mug with your photo",
        descriptionbn: "আপনার ছবি দিয়ে ব্যক্তিগতকৃত সিরামিক মগ",
        price: "350.00",
        originalPrice: "450.00",
        category: "custom-gifts",
        subcategory: "mugs",
        images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500"],
        tags: ["customizable", "photo", "gift"],
        inStock: true,
        stockQuantity: 50,
        isFeatured: true,
        isCustomizable: true
      },
      {
        name: "Custom T-Shirt",
        namebn: "কাস্টম টি-শার্ট",
        description: "High quality cotton t-shirt with custom design",
        descriptionbn: "কাস্টম ডিজাইনসহ উচ্চমানের সুতির টি-শার্ট",
        price: "550.00",
        originalPrice: "650.00",
        category: "fashion",
        subcategory: "clothing",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        tags: ["customizable", "clothing", "cotton"],
        inStock: true,
        stockQuantity: 100,
        isFeatured: true,
        isCustomizable: true
      },
      {
        name: "Custom Photo Frame",
        namebn: "কাস্টম ফটো ফ্রেম",
        description: "Beautiful wooden frame for your memories",
        descriptionbn: "আপনার স্মৃতির জন্য সুন্দর কাঠের ফ্রেম",
        price: "750.00",
        originalPrice: "850.00",
        category: "home-decor",
        subcategory: "frames",
        images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500"],
        tags: ["customizable", "frame", "wood"],
        inStock: true,
        stockQuantity: 30,
        isFeatured: false,
        isCustomizable: true
      },
      {
        name: "Custom Tumbler",
        namebn: "কাস্টম টাম্বলার",
        description: "Insulated steel tumbler with custom design",
        descriptionbn: "কাস্টম ডিজাইনসহ ইনসুলেটেড স্টিল টাম্বলার",
        price: "450.00",
        originalPrice: "550.00",
        category: "custom-gifts",
        subcategory: "drinkware",
        images: ["https://images.unsplash.com/photo-1555499005-4b5ac01ad3d3?w=500"],
        tags: ["customizable", "steel", "insulated"],
        inStock: true,
        stockQuantity: 75,
        isFeatured: true,
        isCustomizable: true
      },
      {
        name: "Custom Canvas Print",
        namebn: "কাস্টম ক্যানভাস প্রিন্ট",
        description: "Premium canvas print of your artwork",
        descriptionbn: "আপনার শিল্পকর্মের প্রিমিয়াম ক্যানভাস প্রিন্ট",
        price: "950.00",
        originalPrice: "1150.00",
        category: "home-decor",
        subcategory: "art",
        images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500"],
        tags: ["customizable", "canvas", "art"],
        inStock: true,
        stockQuantity: 25,
        isFeatured: false,
        isCustomizable: true
      }
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
