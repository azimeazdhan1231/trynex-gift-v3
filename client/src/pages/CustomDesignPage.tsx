import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Shirt, Coffee, Frame, Wallet, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CanvasEditor } from "@/components/design/CanvasEditor";
import { CUSTOMIZABLE_PRODUCTS } from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";

export default function CustomDesignPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isDesigning, setIsDesigning] = useState(false);
  const { toast } = useToast();

  const productIcons = {
    "Printed Mug": <Coffee className="h-12 w-12 text-gold" />,
    "Water Tumbler": <Coffee className="h-12 w-12 text-gold" />,
    "T-Shirt": <Shirt className="h-12 w-12 text-gold" />,
    "Picture Frame": <Frame className="h-12 w-12 text-gold" />,
    "Wallet": <Wallet className="h-12 w-12 text-gold" />,
    "Custom Letter": <Mail className="h-12 w-12 text-gold" />,
  };

  const handleProductSelect = (product: string) => {
    setSelectedProduct(product);
    setIsDesigning(true);
  };

  const handleSaveDesign = (designData: any) => {
    // Save design to backend
    console.log("Saving design:", designData);
    
    toast({
      title: "Design Saved Successfully!",
      description: "Your custom design has been saved. You can now add it to cart.",
    });
  };

  const handleBackToProducts = () => {
    setIsDesigning(false);
    setSelectedProduct(null);
  };

  if (isDesigning && selectedProduct) {
    return (
      <div className="min-h-screen pt-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              variant="outline"
              onClick={handleBackToProducts}
              className="border-gold/30 text-white hover:bg-gold hover:text-black"
            >
              ← Back to Products
            </Button>
          </motion.div>

          <CanvasEditor
            productId={1}
            productName={selectedProduct}
            onSave={handleSaveDesign}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="h-8 w-8 text-gold" />
            <h1 className="text-4xl font-bold font-poppins text-shadow">
              Custom Design Studio
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-4">
            🎨 আপনার নিজস্ব ডিজাইন তৈরি করুন 🎨
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Create personalized products with our advanced design editor. Upload images, add text, 
            and customize to your heart's content. Your creativity, our quality.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              title: "Upload Images",
              titleBn: "ছবি আপলোড",
              description: "JPG, PNG formats supported",
              icon: "📷"
            },
            {
              title: "Add Text",
              titleBn: "টেক্সট যুক্ত করুন",
              description: "Multiple fonts and colors",
              icon: "✍️"
            },
            {
              title: "Live Preview", 
              titleBn: "লাইভ প্রিভিউ",
              description: "See changes in real-time",
              icon: "👀"
            },
            {
              title: "High Quality",
              titleBn: "উচ্চ মানের",
              description: "Professional printing guaranteed",
              icon: "⭐"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-effect rounded-xl p-6 text-center"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gold mb-2">{feature.titleBn}</p>
              <p className="text-xs text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Product Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Choose Your Product
            <span className="block text-lg text-gold mt-2">আপনার পণ্য বেছে নিন</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CUSTOMIZABLE_PRODUCTS.map((product, index) => (
              <motion.div
                key={product}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="glass-effect hover:shadow-glow transition-all duration-300 cursor-pointer group"
                  onClick={() => handleProductSelect(product)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-gold/20 rounded-full group-hover:bg-gold/30 transition-colors">
                      {productIcons[product as keyof typeof productIcons]}
                    </div>
                    <CardTitle className="text-white group-hover:text-gold transition-colors">
                      {product}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-300 text-sm mb-4">
                      Customizable • High Quality • Fast Delivery
                    </p>
                    <Button 
                      className="w-full bg-gold text-black hover:bg-gold/90 group-hover:shadow-glow-lg transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductSelect(product);
                      }}
                    >
                      Start Designing
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            How It Works
            <span className="block text-lg text-gold mt-2">কিভাবে কাজ করে</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Choose Product",
                titleBn: "পণ্য বেছে নিন",
                description: "Select the item you want to customize"
              },
              {
                step: "2", 
                title: "Design",
                titleBn: "ডিজাইন করুন",
                description: "Add text, upload images, and customize"
              },
              {
                step: "3",
                title: "Preview",
                titleBn: "প্রিভিউ দেখুন", 
                description: "Check how your design looks"
              },
              {
                step: "4",
                title: "Order",
                titleBn: "অর্ডার করুন",
                description: "Place order and get it delivered"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-sm text-gold mb-2">{step.titleBn}</p>
                <p className="text-xs text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center py-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            ব্যতিক্রমী কিছু তৈরি করতে প্রস্তুত? আমাদের ডিজাইন স্টুডিও দিয়ে আপনার স্বপ্নের পণ্য তৈরি করুন।
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold px-8 py-4 text-lg shadow-glow-lg"
          >
            Start Your Design Journey
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
