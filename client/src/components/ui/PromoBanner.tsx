import { motion } from "framer-motion";
import { Sparkles, Gift, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PromoBanner = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-yellow-500/10 to-gold/10" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-gold mr-2 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-gold">
              বিশেষ ছাড়!
            </h2>
            <Sparkles className="h-8 w-8 text-gold ml-2 animate-pulse" />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white mb-4"
          >
            📱 First 100 customers get <span className="text-gold font-bold">25% OFF</span> on all custom designs!
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mb-6"
          >
            🚚 FREE delivery within Dhaka • ✨ Same day processing
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="gold-gradient text-black font-semibold hover-transform"
              onClick={() => window.location.href = '/custom-design'}
            >
              <Gift className="mr-2 h-5 w-5" />
              Claim Offer • অফার নিন
            </Button>
            
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              Limited time offer
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};