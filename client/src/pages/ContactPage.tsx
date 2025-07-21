import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { COMPANY_INFO } from "@/utils/constants";
import { openWhatsApp } from "@/utils/helpers";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/contact-messages', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully!",
        description: "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-messages'] });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill all required fields",
        description: "নাম, ইমেইল এবং বার্তা অবশ্যই দিতে হবে।",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6 text-gold" />,
      title: "Phone & WhatsApp",
      titleBn: "ফোন ও হোয়াটসঅ্যাপ",
      content: COMPANY_INFO.phone,
      description: "Call or text us anytime",
      action: () => window.location.href = `tel:${COMPANY_INFO.phone}`,
      secondaryAction: () => openWhatsApp(),
      secondaryLabel: "WhatsApp"
    },
    {
      icon: <Mail className="h-6 w-6 text-gold" />,
      title: "Email",
      titleBn: "ইমেইল",
      content: COMPANY_INFO.email,
      description: "Send us an email",
      action: () => window.location.href = `mailto:${COMPANY_INFO.email}`
    },
    {
      icon: <MapPin className="h-6 w-6 text-gold" />,
      title: "Location",
      titleBn: "অবস্থান",
      content: COMPANY_INFO.address,
      description: "Visit our location",
      action: () => window.open("https://maps.google.com/")
    },
    {
      icon: <Clock className="h-6 w-6 text-gold" />,
      title: "Business Hours",
      titleBn: "ব্যবসার সময়",
      content: "24/7 Available",
      description: "Always here for you"
    }
  ];

  const faqs = [
    {
      question: "How long does delivery take?",
      questionBn: "ডেলিভারি কত সময় লাগে?",
      answer: "We deliver within 24-48 hours in Dhaka and 2-3 days outside Dhaka."
    },
    {
      question: "Do you offer cash on delivery?",
      questionBn: "ক্যাশ অন ডেলিভারি আছে কি?",
      answer: "Yes, we offer cash on delivery for all orders across Bangladesh."
    },
    {
      question: "Can I customize products?",
      questionBn: "প্রোডাক্ট কাস্টমাইজ করা যায়?",
      answer: "Yes, we offer custom design services for mugs, t-shirts, and other selected products."
    },
    {
      question: "What is your return policy?",
      questionBn: "রিটার্ন পলিসি কী?",
      answer: "We offer 7-day return policy for defective products. Custom products cannot be returned."
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
          <h1 className="text-4xl font-bold font-poppins mb-4 text-shadow">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300">আমাদের সাথে যোগাযোগ করুন</p>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            We're here to help you find the perfect gifts and answer any questions you may have.
            Our team is available 24/7 to assist you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
            
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="glass-effect hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gold/20 rounded-full p-3">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{method.title}</h3>
                        <p className="text-sm text-gold mb-2">{method.titleBn}</p>
                        <p className="text-white font-medium mb-1">{method.content}</p>
                        <p className="text-sm text-gray-300 mb-3">{method.description}</p>
                        
                        <div className="flex gap-2">
                          {method.action && (
                            <Button
                              size="sm"
                              onClick={method.action}
                              className="bg-gold text-black hover:bg-gold/90"
                            >
                              Contact
                            </Button>
                          )}
                          {method.secondaryAction && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={method.secondaryAction}
                              className="border-gold/30 text-gold hover:bg-gold hover:text-black"
                            >
                              {method.secondaryLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <Button
                onClick={() => openWhatsApp("Hello! I need help with an order.")}
                className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto flex flex-col items-center gap-2"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm">WhatsApp Chat</span>
              </Button>
              <Button
                onClick={() => window.location.href = `tel:${COMPANY_INFO.phone}`}
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex flex-col items-center gap-2"
              >
                <Phone className="h-6 w-6" />
                <span className="text-sm">Call Now</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Send className="h-5 w-5 text-gold" />
                  Send Message
                </CardTitle>
                <p className="text-gray-300 text-sm">আমাদের বার্তা পাঠান</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white" htmlFor="name">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-black/50 border-gold/30 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white" htmlFor="email">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-black/50 border-gold/30 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white" htmlFor="phone">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+880 1XXXXXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-black/50 border-gold/30 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white" htmlFor="message">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-black/50 border-gold/30 text-white"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full bg-gold text-black hover:bg-gold/90 font-semibold py-3"
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Frequently Asked Questions
            <span className="block text-lg text-gold mt-2">প্রায়শই জিজ্ঞাসিত প্রশ্ন</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="glass-effect h-full">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-white mb-1">{faq.question}</h3>
                    <p className="text-sm text-gold mb-3">{faq.questionBn}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-effect rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Visit Our Location</h2>
          <p className="text-gray-300 mb-6">আমাদের অবস্থান দেখুন</p>
          <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gold mx-auto mb-4" />
              <p className="text-white font-semibold">{COMPANY_INFO.address}</p>
              <Button
                className="mt-4 bg-gold text-black hover:bg-gold/90"
                onClick={() => window.open("https://maps.google.com/")}
              >
                Open in Maps
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
