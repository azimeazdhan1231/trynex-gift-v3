import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products, categories, orders, cartItems, contactMessages, customDesigns, promos } from "@shared/schema";
import { eq, and, desc, like, sql, or, ilike, gte, lte } from "drizzle-orm";
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
  async getProducts(filters?: {
    category?: string;
    featured?: boolean;
    search?: string;
  }) {
    try {
      let query = db.select().from(products);
      const conditions = [];

      if (filters?.category && filters.category !== 'all') {
        conditions.push(eq(products.category, filters.category));
      }

      if (filters?.featured !== undefined) {
        conditions.push(eq(products.isFeatured, filters.featured));
      }

      if (filters?.search) {
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

      const result = await query.orderBy(products.id);
      console.log(`Found ${result.length} products`);
      return result;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getFeaturedProducts() {
    try {
      return await db.select().from(products).where(eq(products.isFeatured, true)).limit(6);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  async getProductById(id: number) {
    try {
      const [product] = await db.select().from(products).where(eq(products.id, id));
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },

  async getProduct(id: number) {
    return this.getProductById(id);
  },

  async searchProducts(query: string) {
    try {
      return await db.select().from(products)
        .where(
          sql`${products.name} ILIKE ${`%${query}%`} OR ${products.description} ILIKE ${`%${query}%`}`
        );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  async getProductsByCategory(category: string) {
    try {
      return await db.select().from(products).where(eq(products.category, category));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  async createProduct(productData: InsertProduct) {
    try {
      const [product] = await db.insert(products).values({
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: number, updates: Partial<InsertProduct>) {
    try {
      // Remove updatedAt from updates to avoid conflicts and add it manually
      const { updatedAt, createdAt, ...cleanUpdates } = updates as any;

      const [product] = await db.update(products)
        .set({ ...cleanUpdates, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: number) {
    try {
      await db.delete(products).where(eq(products.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  // Categories
  async getCategories() {
    try {
      return await db.select().from(categories).orderBy(categories.sortOrder);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async createCategory(categoryData: InsertCategory) {
    try {
      const [category] = await db.insert(categories).values(categoryData).returning();
      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Orders
  async createOrder(orderData: InsertOrder) {
    try {
      const orderId = `ORD-${Date.now()}`;
      const [order] = await db.insert(orders).values({
        ...orderData,
        orderId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrderById(id: number) {
    try {
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      return order;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  },

  async getOrderByOrderId(orderId: string) {
    try {
      const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
      return order;
    } catch (error) {
      console.error('Error fetching order by order ID:', error);
      throw error;
    }
  },

  async getOrder(id: string) {
    try {
      const [order] = await db.select().from(orders).where(eq(orders.orderId, id));
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async getOrders(filters?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    try {
      let query = db.select().from(orders);

      if (filters?.status) {
        query = query.where(eq(orders.orderStatus, filters.status));
      }

      if (filters?.dateFrom) {
        query = query.where(gte(orders.createdAt, filters.dateFrom));
      }

      if (filters?.dateTo) {
        query = query.where(lte(orders.createdAt, filters.dateTo));
      }

      const result = await query.orderBy(desc(orders.createdAt));
      console.log(`Found ${result.length} orders`);
      return result;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: string) {
    console.log('Storage: Updating order status for:', orderId, 'to:', status);
    const [order] = await db.update(orders)
      .set({ orderStatus: status, updatedAt: new Date() })
      .where(eq(orders.orderId, orderId))
      .returning();
    console.log('Storage: Updated order:', order);
    return order;
  },

  async updatePaymentStatus(orderId: string, status: string) {
    try {
      const [order] = await db.update(orders)
        .set({ paymentStatus: status, updatedAt: new Date() })
        .where(eq(orders.orderId, orderId))
        .returning();
      return order;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Contact Messages
  async createContactMessage(messageData: InsertContactMessage) {
    try {
      const [message] = await db.insert(contactMessages).values({
        ...messageData,
        createdAt: new Date(),
      }).returning();
      return message;
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  },

  async getContactMessages() {
    try {
      return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  },

  // Cart Items with Product Details
  async getCartItems(sessionId: string) {
    try {
      const result = await db
        .select({
          id: cartItems.id,
          sessionId: cartItems.sessionId,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          customDesign: cartItems.customDesign,
          createdAt: cartItems.createdAt,
          product: {
            id: products.id,
            name: products.name,
            namebn: products.namebn,
            price: products.price,
            originalPrice: products.originalPrice,
            category: products.category,
            description: products.description,
            descriptionbn: products.descriptionbn,
            images: products.images,
            isCustomizable: products.isCustomizable,
            isFeatured: products.isFeatured,
            inStock: products.inStock,
            stockQuantity: products.stockQuantity
          }
        })
        .from(cartItems)
        .leftJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.sessionId, sessionId))
        .orderBy(desc(cartItems.createdAt));

      console.log(`Found ${result.length} cart items for session ${sessionId}`);
      return result;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  async addToCart(cartData: {
    sessionId: string;
    productId: number;
    quantity: number;
    customDesign?: any;
  }) {
    try {
      console.log('Adding to cart:', cartData);

      // Check if item already exists in cart
      const existingItem = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.sessionId, cartData.sessionId),
            eq(cartItems.productId, cartData.productId)
          )
        )
        .limit(1);

      if (existingItem.length > 0) {
        // Update quantity instead of adding new item
        const [updatedItem] = await db
          .update(cartItems)
          .set({ 
            quantity: existingItem[0].quantity + (cartData.quantity || 1)
          })
          .where(eq(cartItems.id, existingItem[0].id))
          .returning();

        // Get product details
        const product = await this.getProductById(cartData.productId);
        return { ...updatedItem, product };
      } else {
        // Add new item to cart
        const [cartItem] = await db.insert(cartItems).values({
          sessionId: cartData.sessionId,
          productId: cartData.productId,
          quantity: cartData.quantity || 1,
          customDesign: cartData.customDesign,
          createdAt: new Date(),
        }).returning();

        // Get product details
        const product = await this.getProductById(cartData.productId);
        return { ...cartItem, product };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async updateCartItem(id: number, quantity: number) {
    try {
      const [cartItem] = await db.update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, id))
        .returning();

      if (cartItem) {
        const product = await this.getProductById(cartItem.productId);
        return { ...cartItem, product };
      }

      return cartItem;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  async removeFromCart(id: number) {
    try {
      await db.delete(cartItems).where(eq(cartItems.id, id));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  },

  async clearCart(sessionId: string) {
    try {
      await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Custom Designs
  async saveCustomDesign(designData: any) {
    try {
      const [design] = await db.insert(customDesigns).values({
        ...designData,
        createdAt: new Date(),
      }).returning();
      return design;
    } catch (error) {
      console.error('Error saving custom design:', error);
      throw error;
    }
  },

  async getCustomDesign(id: number) {
    try {
      const [design] = await db.select().from(customDesigns).where(eq(customDesigns.id, id));
      return design;
    } catch (error) {
      console.error('Error fetching custom design:', error);
      throw error;
    }
  },

  async getCustomDesignsBySession(sessionId: string) {
    try {
      return await db.select().from(customDesigns).where(eq(customDesigns.sessionId, sessionId));
    } catch (error) {
      console.error('Error fetching custom designs by session:', error);
      throw error;
    }
  },

  async createCustomDesign(designData: any) {
    try {
      const [design] = await db.insert(customDesigns).values({
        ...designData,
        createdAt: new Date(),
      }).returning();
      return design;
    } catch (error) {
      console.error('Error creating custom design:', error);
      throw error;
    }
  },

  async updateCustomDesign(id: number, updates: any) {
    try {
      const [design] = await db.update(customDesigns)
        .set(updates)
        .where(eq(customDesigns.id, id))
        .returning();
      return design;
    } catch (error) {
      console.error('Error updating custom design:', error);
      throw error;
    }
  },

  // Promos
  async getActivePromos() {
    try {
      return await db.select().from(promos).where(eq(promos.isActive, true));
    } catch (error) {
      console.error('Error fetching active promos:', error);
      throw error;
    }
  },

  async getPromoByCode(code: string) {
    try {
      const [promo] = await db.select().from(promos).where(eq(promos.code, code));
      return promo;
    } catch (error) {
      console.error('Error fetching promo by code:', error);
      throw error;
    }
  },

  async getPromos(activeOnly: boolean = false) {
    try {
      let query = db.select().from(promos);
      if (activeOnly) {
        query = query.where(eq(promos.isActive, true));
      }
      return await query.orderBy(desc(promos.createdAt));
    } catch (error) {
      console.error('Error fetching promos:', error);
      throw error;
    }
  },

  async getPromo(code: string) {
    return this.getPromoByCode(code);
  },

  async createPromo(promoData: any) {
    try {
      const [promo] = await db.insert(promos).values({
        ...promoData,
        createdAt: new Date(),
      }).returning();
      return promo;
    } catch (error) {
      console.error('Error creating promo:', error);
      throw error;
    }
  }
};