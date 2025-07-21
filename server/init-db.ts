
import { storage } from './storage';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test database connection
    const products = await storage.getProducts({});
    console.log(`Database connected. Found ${products.length} products.`);
    
    // If no products exist, run seed data
    if (products.length === 0) {
      console.log('No products found. Running seed data...');
      const { runSeed } = await import('./run-seed');
      await runSeed();
      console.log('Seed data completed.');
    }
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}
