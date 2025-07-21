import { MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/utils/helpers";
import { COMPANY_INFO } from "@/utils/constants";

export const FloatingElements = () => {
  return (
    <>
      {/* Floating WhatsApp */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        className="fixed bottom-6 right-6 z-40"
      >
        <div className="relative group">
          <Button
            onClick={() => openWhatsApp()}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl hover-transform animate-pulse-slow"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute bottom-16 right-0 bg-white text-black p-3 rounded-lg shadow-lg w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            <p className="text-sm font-semibold">🤖 AI সহায়ক</p>
            <p className="text-xs">যেকোনো প্রশ্ন করুন!</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Order Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2.5, type: "spring" }}
        className="fixed bottom-6 left-6 z-40"
      >
        <Button
          onClick={() => window.location.href = `tel:${COMPANY_INFO.phone}`}
          className="gold-gradient text-black rounded-full px-6 py-3 shadow-2xl hover-transform font-semibold animate-glow"
        >
          <Phone className="h-4 w-4 mr-2" />
          <div className="text-left">
            <div className="text-sm">এখনই অর্ডার করুন!</div>
            <div className="text-xs">{COMPANY_INFO.phone}</div>
          </div>
        </Button>
      </motion.div>

      {/* Background Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 2,
            }}
            className={`absolute w-4 h-4 bg-gold/20 rounded-full blur-sm`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </>
  );
};
