import { motion } from "framer-motion";
import { HeroSection } from "@/components/ui/HeroSection";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { CategoryGrid } from "@/components/ui/CategoryGrid";
import { ProductCard } from "@/components/ui/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useProducts } from "@/hooks/useProducts";
import { useProductsRealtime } from "@/hooks/useSupabase";
import { Star, Gift, Truck, Shield, Heart } from "lucide-react";

export default function HomePage() {
  const { data: featuredProducts = [], isLoading } = useProducts({ featured: true });
  const { data: latestProducts = [] } = useProducts();
  const { isConnected } = useProductsRealtime();

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-gold" />,
      title: "Fast Delivery",
      titleBn: "দ্রুত ডেলিভারি",
      description: "24 hours delivery across Bangladesh",
    },
    {
      icon: <Shield className="h-8 w-8 text-gold" />,
      title: "Quality Guarantee", 
      titleBn: "মানের নিশ্চয়তা",
      description: "100% authentic premium products",
    },
    {
      icon: <Gift className="h-8 w-8 text-gold" />,
      title: "Free Gift Wrap",
      titleBn: "ফ্রি গিফট র‍্যাপিং", 
      description: "Beautiful packaging included",
    },
    {
      icon: <Heart className="h-8 w-8 text-gold" />,
      title: "Customer Love",
      titleBn: "গ্রাহক সন্তুষ্টি",
      description: "Loved by thousands of customers",
    },
  ];

  return (
    <div className="min-h-screen">
      <PromoBanner />
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 bg-dark-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-xl p-6 text-center hover-transform"
              >
                <div className="bg-gold/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gold mb-2">{feature.titleBn}</p>
                <p className="text-xs text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-20 gradient-bg bg-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-poppins mb-4 text-shadow">
              🌟 Latest Arrivals 🌟
            </h2>
            <p className="text-xl text-gray-300">✨ নতুন এবং ট্রেন্ডিং প্রোডাক্ট ✨</p>
            {isConnected && (
              <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Updates Active
              </div>
            )}
          </motion.div>

          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {latestProducts.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center">
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 glass-effect rounded-lg font-semibold hover-transform text-white hover:text-gold transition-colors"
            >
              View All Products <Star className="ml-2 h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-poppins mb-4 text-shadow">
              Featured Products
            </h2>
            <p className="text-xl text-gray-300">✨ আমাদের বিশেষ নির্বাচিত প্রোডাক্ট ✨</p>
          </motion.div>

          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {featuredProducts.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories */}
      <CategoryGrid />

      {/* About Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold font-poppins mb-6 text-shadow">
                About TryneX Lifestyle
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                We are passionate about bringing you premium lifestyle products that enhance your daily experiences.
                From beautifully crafted mugs to comfortable apparel, our curated collection represents quality, style, and functionality.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Based in Bangladesh, we understand the local market needs and source products that resonate with modern lifestyle
                preferences while maintaining affordability and quality.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2">1000+</div>
                  <p className="text-sm text-gray-300">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2">500+</div>
                  <p className="text-sm text-gray-300">Products Delivered</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="About TryneX Lifestyle"
                className="rounded-xl shadow-2xl w-full"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
