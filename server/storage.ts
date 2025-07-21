
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  products, categories, orders, cartItems, contactMessages, 
  customDesigns, promos,
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type Order, type InsertOrder,
  type CartItem, type InsertCartItem,
  type ContactMessage, type InsertContactMessage,
  type CustomDesign, type InsertCustomDesign,
  type Promo, type InsertPromo,
} from "@shared/schema";
import { eq, desc, and, or, ilike, gte, lte, sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.wifsqonbnfmwtqvupqbk:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const client = postgres(connectionString);
const db = drizzle(client);

interface ProductFilters {
  category?: string;
  featured?: boolean;
  search?: string;
}

class Storage {
  // Products
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      let query = db.select().from(products);
      
      const conditions = [];
      
      if (filters.category) {
        conditions.push(eq(products.category, filters.category));
      }
      
      if (filters.featured) {
        conditions.push(eq(products.featured, true));
      }
      
      if (filters.search) {
        conditions.push(
          or(
            ilike(products.name, `%${filters.search}%`),
            ilike(products.description, `%${filters.search}%`)
          )
        );
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      return await query.orderBy(desc(products.featured), products.sortOrder);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProduct(id: number): Promise<Product | undefined> {
    try {
      const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    try {
      const result = await db.insert(products).values(product).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const result = await db.update(products).set(updates).where(eq(products.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const result = await db.delete(products).where(eq(products.id, id));
      return result.count > 0;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getCategory(id: number): Promise<Category | undefined> {
    try {
      const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    try {
      const result = await db.insert(categories).values(category).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      return await db.select().from(orders).orderBy(desc(orders.createdAt));
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  async getOrder(id: string): Promise<Order | undefined> {
    try {
      const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    try {
      const result = await db.insert(orders).values(order).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    try {
      const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  // Cart Items
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    try {
      const result = await db
        .select({
          id: cartItems.id,
          sessionId: cartItems.sessionId,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          customDesignId: cartItems.customDesignId,
          createdAt: cartItems.createdAt,
          product: products
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.sessionId, sessionId));
      
      return result;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    try {
      // Check if item already exists in cart
      const existing = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.sessionId, item.sessionId),
            eq(cartItems.productId, item.productId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update quantity
        const result = await db
          .update(cartItems)
          .set({ quantity: existing[0].quantity + item.quantity })
          .where(eq(cartItems.id, existing[0].id))
          .returning();
        return result[0];
      } else {
        // Insert new item
        const result = await db.insert(cartItems).values(item).returning();
        return result[0];
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    try {
      const result = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  }

  async removeFromCart(id: number): Promise<boolean> {
    try {
      const result = await db.delete(cartItems).where(eq(cartItems.id, id));
      return result.count > 0;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }

  async clearCart(sessionId: string): Promise<void> {
    try {
      await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      throw error;
    }
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    try {
      const result = await db.insert(contactMessages).values(message).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating contact message:", error);
      throw error;
    }
  }

  async updateContactMessageStatus(id: number, status: string): Promise<ContactMessage | undefined> {
    try {
      const result = await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating contact message status:", error);
      throw error;
    }
  }

  // Custom Designs
  async getCustomDesign(id: number): Promise<CustomDesign | undefined> {
    try {
      const result = await db.select().from(customDesigns).where(eq(customDesigns.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching custom design:", error);
      throw error;
    }
  }

  async getCustomDesignsBySession(sessionId: string): Promise<CustomDesign[]> {
    try {
      return await db.select().from(customDesigns).where(eq(customDesigns.sessionId, sessionId));
    } catch (error) {
      console.error("Error fetching custom designs:", error);
      throw error;
    }
  }

  async createCustomDesign(design: InsertCustomDesign): Promise<CustomDesign> {
    try {
      const result = await db.insert(customDesigns).values(design).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating custom design:", error);
      throw error;
    }
  }

  async updateCustomDesign(id: number, updates: Partial<InsertCustomDesign>): Promise<CustomDesign | undefined> {
    try {
      const result = await db.update(customDesigns).set(updates).where(eq(customDesigns.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating custom design:", error);
      throw error;
    }
  }

  async deleteCustomDesign(id: number): Promise<boolean> {
    try {
      const result = await db.delete(customDesigns).where(eq(customDesigns.id, id));
      return result.count > 0;
    } catch (error) {
      console.error("Error deleting custom design:", error);
      throw error;
    }
  }

  // Promos
  async getPromos(activeOnly: boolean = false): Promise<Promo[]> {
    try {
      let query = db.select().from(promos);
      
      if (activeOnly) {
        const now = new Date();
        query = query.where(
          and(
            eq(promos.isActive, true),
            gte(promos.validUntil, now)
          )
        );
      }
      
      return await query.orderBy(desc(promos.createdAt));
    } catch (error) {
      console.error("Error fetching promos:", error);
      throw error;
    }
  }

  async getPromo(code: string): Promise<Promo | undefined> {
    try {
      const result = await db.select().from(promos).where(eq(promos.code, code)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error fetching promo:", error);
      throw error;
    }
  }

  async createPromo(promo: InsertPromo): Promise<Promo> {
    try {
      const result = await db.insert(promos).values(promo).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating promo:", error);
      throw error;
    }
  }

  async updatePromo(id: number, updates: Partial<InsertPromo>): Promise<Promo | undefined> {
    try {
      const result = await db.update(promos).set(updates).where(eq(promos.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating promo:", error);
      throw error;
    }
  }

  async deletePromo(id: number): Promise<boolean> {
    try {
      const result = await db.delete(promos).where(eq(promos.id, id));
      return result.count > 0;
    } catch (error) {
      console.error("Error deleting promo:", error);
      throw error;
    }
  }

  async incrementPromoUsage(code: string): Promise<void> {
    try {
      await db.update(promos).set({ 
        usageCount: sql`${promos.usageCount} + 1` 
      }).where(eq(promos.code, code));
    } catch (error) {
      console.error("Error incrementing promo usage:", error);
      throw error;
    }
  }
}

export const storage = new Storage();
