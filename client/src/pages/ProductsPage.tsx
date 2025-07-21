import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/ui/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useProducts } from "@/hooks/useProducts";
import { useProductsRealtime } from "@/hooks/useSupabase";
import { CATEGORIES } from "@/utils/constants";
import { debounce } from "@/utils/helpers";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: products = [], isLoading } = useProducts({
    category: selectedCategory || undefined,
    search: debouncedSearch || undefined,
  });

  const { isConnected } = useProductsRealtime();

  // Debounced search
  useEffect(() => {
    const debounced = debounce((query: string) => {
      setDebouncedSearch(query);
    }, 500);

    debounced(searchQuery);
  }, [searchQuery]);

  // Parse URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, []);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  return (
    <div className="min-h-screen pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold font-poppins mb-4 text-shadow">
            Our Products
          </h1>
          <p className="text-xl text-gray-300">আমাদের সম্পূর্ণ প্রোডাক্ট কালেকশন</p>
          {isConnected && (
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live Inventory Updates
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6 mb-8"
        >
          <div className="grid lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 border-gold/30 text-white"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-gold/30 overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`flex-1 rounded-none ${
                  viewMode === "grid" 
                    ? "bg-gold text-black" 
                    : "bg-transparent text-white hover:bg-gold/20"
                }`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`flex-1 rounded-none ${
                  viewMode === "list" 
                    ? "bg-gold text-black" 
                    : "bg-transparent text-white hover:bg-gold/20"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-300">
            {sortedProducts.length} products found
            {selectedCategory && (
              <span className="ml-2 px-2 py-1 bg-gold/20 rounded text-gold text-sm">
                {CATEGORIES.find(c => c.slug === selectedCategory)?.name}
              </span>
            )}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <SortAsc className="h-4 w-4" />
            <span>
              {sortBy === "newest" && "Newest First"}
              {sortBy === "price-low" && "Price: Low to High"}
              {sortBy === "price-high" && "Price: High to Low"}
              {sortBy === "name" && "Name A-Z"}
            </span>
          </div>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <LoadingSpinner className="py-20" />
        ) : sortedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setDebouncedSearch("");
              }}
              className="bg-gold text-black hover:bg-gold/90"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard 
                  product={product} 
                  className={viewMode === "list" ? "flex flex-row" : ""}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        {sortedProducts.length >= 20 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              className="border-gold/30 text-white hover:bg-gold hover:text-black"
            >
              Load More Products
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
