import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products, categories, orders, cartItems, contactMessages, customDesigns, promos } from "@shared/schema";
import { eq, and, desc, like, sql } from "drizzle-orm";
import type { InsertProduct, InsertCategory, InsertOrder, InsertContactMessage } from "@shared/schema";

const connectionString = "postgresql://postgres.wifsqonbnfmwtqvupqbk:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const client = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(client);

// Export the db instance and storage functions
export { db };

export const storage = {
  // Products
  async getProducts() {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  },

  async getFeaturedProducts() {
    return await db.select().from(products).where(eq(products.isFeatured, true)).limit(6);
  },

  async getProductById(id: number) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  },

  async searchProducts(query: string) {
    return await db.select().from(products)
      .where(
        sql`${products.name} ILIKE ${`%${query}%`} OR ${products.description} ILIKE ${`%${query}%`}`
      );
  },

  async getProductsByCategory(category: string) {
    return await db.select().from(products).where(eq(products.category, category));
  },

  async createProduct(productData: InsertProduct) {
    const [product] = await db.insert(products).values({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return product;
  },

  // Categories
  async getCategories() {
    return await db.select().from(categories).orderBy(categories.sortOrder);
  },

  async createCategory(categoryData: InsertCategory) {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  },

  // Orders
  async createOrder(orderData: InsertOrder) {
    const orderId = `ORD-${Date.now()}`;
    const [order] = await db.insert(orders).values({
      ...orderData,
      orderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return order;
  },

  async getOrderById(id: number) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  },

  async getOrderByOrderId(orderId: string) {
    const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
    return order;
  },

  // Contact Messages
  async createContactMessage(messageData: InsertContactMessage) {
    const [message] = await db.insert(contactMessages).values({
      ...messageData,
      createdAt: new Date(),
    }).returning();
    return message;
  },

  // Cart Items
  async getCartItems(sessionId: string) {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  },

  async addToCart(sessionId: string, productId: number, quantity: number = 1, customDesign?: any) {
    const [cartItem] = await db.insert(cartItems).values({
      sessionId,
      productId,
      quantity,
      customDesign,
      createdAt: new Date(),
    }).returning();
    return cartItem;
  },

  async updateCartItem(id: number, quantity: number) {
    const [cartItem] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem;
  },

  async removeFromCart(id: number) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  },

  async clearCart(sessionId: string) {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  },

  // Custom Designs
  async saveCustomDesign(designData: any) {
    const [design] = await db.insert(customDesigns).values({
      ...designData,
      createdAt: new Date(),
    }).returning();
    return design;
  },

  async getCustomDesign(id: number) {
    const [design] = await db.select().from(customDesigns).where(eq(customDesigns.id, id));
    return design;
  },

  // Promos
  async getActivePromos() {
    return await db.select().from(promos).where(eq(promos.isActive, true));
  },

  async getPromoByCode(code: string) {
    const [promo] = await db.select().from(promos).where(eq(promos.code, code));
    return promo;
  }
};