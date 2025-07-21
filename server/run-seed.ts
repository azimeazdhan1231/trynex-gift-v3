
import { storage, db } from './storage';
import { seedCategories, seedProducts, seedPromos } from './seed-data';

async function runSeed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.execute(`TRUNCATE TABLE cart_items, contact_messages, custom_designs, orders, promos, products, categories RESTART IDENTITY CASCADE`);

    // Seed categories first
    console.log('📁 Seeding categories...');
    for (const category of seedCategories) {
      try {
        await storage.createCategory(category);
        console.log(`✅ Created category: ${category.name}`);
      } catch (error) {
        console.error(`❌ Failed to create category ${category.name}:`, error);
      }
    }

    // Seed products
    console.log('📦 Seeding products...');
    for (const product of seedProducts) {
      try {
        await storage.createProduct(product);
        console.log(`✅ Created product: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to create product ${product.name}:`, error);
      }
    }

    // Seed promos
    console.log('🎁 Seeding promos...');
    for (const promo of seedPromos) {
      try {
        await storage.createPromo(promo);
        console.log(`✅ Created promo: ${promo.code}`);
      } catch (error) {
        console.error(`❌ Failed to create promo ${promo.code}:`, error);
      }
    }

    // Verify seeding
    console.log('🔍 Verifying seeded data...');
    const categories = await storage.getCategories();
    const products = await storage.getProducts();
    const promos = await storage.getPromos();

    console.log(`✅ Database seeded successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Promos: ${promos.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runSeed();
}

export { runSeed };
