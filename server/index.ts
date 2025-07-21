import express from "express";
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";
import { storage } from "./storage";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("dist"));

async function initializeDatabase() {
  try {
    console.log("Initializing database...");
    const products = await storage.getProducts();
    console.log(`Database connected. Found ${products.length} products.`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

async function startServer() {
  // Initialize database first
  await initializeDatabase();

  // Register API routes
  const httpServer = await registerRoutes(app);

  // Setup Vite in development or serve static files in production
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, httpServer);
  } else {
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist/client' });
    });
  }

  // Start server on all interfaces for deployment
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);