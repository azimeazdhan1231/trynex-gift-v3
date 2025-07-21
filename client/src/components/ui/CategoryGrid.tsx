import { motion } from "framer-motion";
import { CATEGORIES } from "@/utils/constants";
import { useLocation } from "wouter";

export const CategoryGrid = () => {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 gradient-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold font-poppins mb-4 text-shadow">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-300">🛍️ আপনার পছন্দের ক্যাটেগরি বেছে নিন 🛍️</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocation(`/products?category=${category.slug}`)}
              className="glass-effect rounded-xl p-6 text-center hover-transform group cursor-pointer hover:shadow-glow transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gold transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-300 mb-2 text-sm">{category.namebn}</p>
              <p className="text-gold font-semibold text-sm">{category.priceFrom}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};