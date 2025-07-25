import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products, categories, orders, cartItems, contactMessages, customDesigns, promos } from "@shared/schema";
import { eq, desc, sql, or, ilike, gte, lte } from "drizzle-orm";
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
    async getProducts(filters) {
        try {
            let query = db.select().from(products);
            if (filters?.category && filters.category !== 'all') {
                query = query.where(eq(products.category, filters.category));
            }
            if (filters?.featured !== undefined) {
                query = query.where(eq(products.isFeatured, filters.featured));
            }
            if (filters?.search) {
                query = query.where(or(ilike(products.name, `%${filters.search}%`), ilike(products.description, `%${filters.search}%`)));
            }
            const result = await query;
            console.log(`Found ${result.length} products`);
            return result;
        }
        catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    async getFeaturedProducts() {
        try {
            return await db.select().from(products).where(eq(products.isFeatured, true)).limit(6);
        }
        catch (error) {
            console.error('Error fetching featured products:', error);
            throw error;
        }
    },
    async getProductById(id) {
        try {
            const [product] = await db.select().from(products).where(eq(products.id, id));
            return product;
        }
        catch (error) {
            console.error('Error fetching product by ID:', error);
            throw error;
        }
    },
    async searchProducts(query) {
        try {
            return await db.select().from(products)
                .where(sql `${products.name} ILIKE ${`%${query}%`} OR ${products.description} ILIKE ${`%${query}%`}`);
        }
        catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },
    async getProductsByCategory(category) {
        try {
            return await db.select().from(products).where(eq(products.category, category));
        }
        catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    },
    async createProduct(productData) {
        try {
            const [product] = await db.insert(products).values({
                ...productData,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();
            return product;
        }
        catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },
    // Categories
    async getCategories() {
        try {
            return await db.select().from(categories).orderBy(categories.sortOrder);
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },
    async createCategory(categoryData) {
        try {
            const [category] = await db.insert(categories).values(categoryData).returning();
            return category;
        }
        catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },
    // Orders
    async createOrder(orderData) {
        try {
            const orderId = `ORD-${Date.now()}`;
            const [order] = await db.insert(orders).values({
                ...orderData,
                orderId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();
            return order;
        }
        catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },
    async getOrderById(id) {
        try {
            const [order] = await db.select().from(orders).where(eq(orders.id, id));
            return order;
        }
        catch (error) {
            console.error('Error fetching order by ID:', error);
            throw error;
        }
    },
    async getOrderByOrderId(orderId) {
        try {
            const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
            return order;
        }
        catch (error) {
            console.error('Error fetching order by order ID:', error);
            throw error;
        }
    },
    async getOrders(filters) {
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
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },
    // Contact Messages
    async createContactMessage(messageData) {
        try {
            const [message] = await db.insert(contactMessages).values({
                ...messageData,
                createdAt: new Date(),
            }).returning();
            return message;
        }
        catch (error) {
            console.error('Error creating contact message:', error);
            throw error;
        }
    },
    // Cart Items
    async getCartItems(sessionId) {
        try {
            return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
        }
        catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    },
    async addToCart(sessionId, productId, quantity = 1, customDesign) {
        try {
            const [cartItem] = await db.insert(cartItems).values({
                sessionId,
                productId,
                quantity,
                customDesign,
                createdAt: new Date(),
            }).returning();
            return cartItem;
        }
        catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },
    async updateCartItem(id, quantity) {
        try {
            const [cartItem] = await db.update(cartItems)
                .set({ quantity })
                .where(eq(cartItems.id, id))
                .returning();
            return cartItem;
        }
        catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },
    async removeFromCart(id) {
        try {
            await db.delete(cartItems).where(eq(cartItems.id, id));
        }
        catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },
    async clearCart(sessionId) {
        try {
            await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
        }
        catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    },
    // Custom Designs
    async saveCustomDesign(designData) {
        try {
            const [design] = await db.insert(customDesigns).values({
                ...designData,
                createdAt: new Date(),
            }).returning();
            return design;
        }
        catch (error) {
            console.error('Error saving custom design:', error);
            throw error;
        }
    },
    async getCustomDesign(id) {
        try {
            const [design] = await db.select().from(customDesigns).where(eq(customDesigns.id, id));
            return design;
        }
        catch (error) {
            console.error('Error fetching custom design:', error);
            throw error;
        }
    },
    // Promos
    async getActivePromos() {
        try {
            return await db.select().from(promos).where(eq(promos.isActive, true));
        }
        catch (error) {
            console.error('Error fetching active promos:', error);
            throw error;
        }
    },
    async getPromoByCode(code) {
        try {
            const [promo] = await db.select().from(promos).where(eq(promos.code, code));
            return promo;
        }
        catch (error) {
            console.error('Error fetching promo by code:', error);
            throw error;
        }
    }
};
