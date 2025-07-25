import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema, insertOrderSchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Database health check
  app.get('/api/health/db', async (req, res) => {
    try {
      const products = await storage.getProducts({});
      res.json({ 
        status: 'ok', 
        database: 'connected',
        productCount: products.length 
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        database: 'disconnected',
        error: error.message 
      });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, search } = req.query;
      const products = await storage.getProducts({
        category: category as string,
        featured: featured === 'true',
        search: search as string,
      });
      res.json(products);
    } catch (error) {
      console.error('Error in /api/products:', error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error('Error in /api/products/:id:', error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating product:', error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const product = await storage.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating category:', error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      console.log('Cart POST request body:', req.body);
      const cartItem = await storage.addToCart(req.body);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      const { status, dateFrom, dateTo } = req.query;
      const orders = await storage.getOrders({
        status: status as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      });
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating order:', error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:orderId/status", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      console.log('Updating order status:', { orderId, status });
      const order = await storage.updateOrderStatus(orderId, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      console.log('Order status updated successfully:', order);
      res.json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.patch("/api/orders/:orderId/payment", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const order = await storage.updatePaymentStatus(orderId, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ error: "Failed to update payment status" });
    }
  });

  // Contact routes
  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact-messages", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating contact message:', error);
      res.status(500).json({ error: "Failed to create contact message" });
    }
  });

  // Custom Design routes
  app.get("/api/custom-designs/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const designs = await storage.getCustomDesignsBySession(sessionId);
      res.json(designs);
    } catch (error) {
      console.error('Error fetching custom designs:', error);
      res.status(500).json({ error: "Failed to fetch custom designs" });
    }
  });

  app.post("/api/custom-designs", async (req, res) => {
    try {
      const design = await storage.createCustomDesign(req.body);
      res.status(201).json(design);
    } catch (error) {
      console.error('Error creating custom design:', error);
      res.status(500).json({ error: "Failed to create custom design" });
    }
  });

  app.put("/api/custom-designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.updateCustomDesign(id, req.body);
      if (!design) {
        return res.status(404).json({ error: "Custom design not found" });
      }
      res.json(design);
    } catch (error) {
      console.error('Error updating custom design:', error);
      res.status(500).json({ error: "Failed to update custom design" });
    }
  });

  // Promos routes
  app.get("/api/promos", async (req, res) => {
    try {
      const { active } = req.query;
      const promos = await storage.getPromos(active === 'true');
      res.json(promos);
    } catch (error) {
      console.error('Error fetching promos:', error);
      res.status(500).json({ error: "Failed to fetch promos" });
    }
  });

  app.get("/api/promos/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const promo = await storage.getPromo(code);
      if (!promo) {
        return res.status(404).json({ error: "Promo not found" });
      }
      res.json(promo);
    } catch (error) {
      console.error('Error fetching promo:', error);
      res.status(500).json({ error: "Failed to fetch promo" });
    }
  });

  app.post("/api/promos", async (req, res) => {
    try {
      const promo = await storage.createPromo(req.body);
      res.status(201).json(promo);
    } catch (error) {
      console.error('Error creating promo:', error);
      res.status(500).json({ error: "Failed to create promo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}