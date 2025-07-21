
import { motion } from "framer-motion";
import { Heart, Award, Users, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  const features = [
    {
      icon: Heart,
      title: "Quality Products",
      titleBn: "মানসম্পন্ন পণ্য",
      description: "We provide high-quality customized gifts for your loved ones",
      descriptionBn: "আপনার প্রিয়জনদের জন্য উচ্চমানের কাস্টমাইজড উপহার সামগ্রী"
    },
    {
      icon: Award,
      title: "Best Service",
      titleBn: "সর্বোত্তম সেবা",
      description: "Customer satisfaction is our top priority",
      descriptionBn: "গ্রাহক সন্তুষ্টিই আমাদের প্রধান লক্ষ্য"
    },
    {
      icon: Users,
      title: "Expert Team",
      titleBn: "দক্ষ টিম",
      description: "Professional designers and customer support",
      descriptionBn: "পেশাদার ডিজাইনার এবং গ্রাহক সহায়তা টিম"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      titleBn: "দ্রুত ডেলিভারি",
      description: "Quick and reliable delivery across Bangladesh",
      descriptionBn: "সারা বাংলাদেশে দ্রুত এবং নির্ভরযোগ্য ডেলিভারি"
    }
  ];

  return (
    <div className="min-h-screen pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold font-poppins mb-4 text-shadow">About TryneX Lifestyle</h1>
          <p className="text-xl text-gray-300">আমাদের সম্পর্কে জানুন</p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <Card className="glass-effect">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                  <p className="text-gray-300 mb-4">
                    TryneX Lifestyle was founded with a simple mission: to help people express their love and 
                    appreciation through personalized gifts. We believe that every gift should tell a story, 
                    carry emotions, and create lasting memories.
                  </p>
                  <p className="text-gray-300 mb-4">
                    আমাদের যাত্রা শুরু হয়েছিল একটি সহজ লক্ষ্য নিয়ে: মানুষকে ব্যক্তিগত উপহারের মাধ্যমে 
                    তাদের ভালোবাসা এবং কৃতজ্ঞতা প্রকাশ করতে সাহায্য করা। আমরা বিশ্বাস করি যে প্রতিটি 
                    উপহার একটি গল্প বলে, আবেগ বহন করে এবং স্থায়ী স্মৃতি তৈরি করে।
                  </p>
                  <p className="text-gray-300">
                    From custom mugs to personalized t-shirts, we craft each product with care and attention 
                    to detail, ensuring that your gift is as unique as the person receiving it.
                  </p>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19"
                    alt="Our workshop"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-8">Why Choose Us</h2>
          <p className="text-center text-gray-300 mb-12">কেন আমাদের বেছে নিবেন</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="glass-effect h-full hover:scale-105 transition-transform">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                      <feature.icon className="w-8 h-8 text-gold" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <p className="text-gold text-sm">{feature.titleBn}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm text-center mb-2">{feature.description}</p>
                    <p className="text-gray-400 text-xs text-center">{feature.descriptionBn}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white text-center">Get in Touch</CardTitle>
              <p className="text-gray-300 text-center">যোগাযোগ করুন</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-gold font-semibold mb-2">WhatsApp</h3>
                  <p className="text-white">+8801940689487</p>
                </div>
                <div>
                  <h3 className="text-gold font-semibold mb-2">Email</h3>
                  <p className="text-white">trynex-lifestyle@gmail.com</p>
                </div>
                <div>
                  <h3 className="text-gold font-semibold mb-2">Payment</h3>
                  <p className="text-white">01747292277</p>
                  <p className="text-gray-400 text-sm">bKash, Nagad, Upay</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
