import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { COMPANY_INFO } from "@/utils/constants";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "Custom Design", href: "/custom-design" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Categories",
      links: [
        { name: "T-Shirts", href: "/products?category=tshirts" },
        { name: "Mugs", href: "/products?category=mugs" },
        { name: "Bottles", href: "/products?category=bottles" },
        { name: "Keychains", href: "/products?category=keychains" },
        { name: "Gift Hampers", href: "/products?category=gift-hampers" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { name: "Order Tracking", href: "/track-order" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Return Policy", href: "/returns" },
        { name: "FAQ", href: "/faq" },
      ],
    },
  ];

  return (
    <footer className="bg-black border-t border-gold/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl font-bold font-poppins">
              <span className="text-gold">TryneX</span>{" "}
              <span className="text-white">Lifestyle</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium lifestyle products for modern living. বাংলাদেশের #১ 
              লাইফস্টাইল ব্র্যান্ড থেকে পান প্রিমিয়াম গুণমানের পণ্য।
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gold hover:text-white transition-colors p-2 bg-gold/20 rounded-full"
              >
                <Facebook className="h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gold hover:text-white transition-colors p-2 bg-gold/20 rounded-full"
              >
                <Instagram className="h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gold hover:text-white transition-colors p-2 bg-gold/20 rounded-full"
              >
                <Youtube className="h-4 w-4" />
              </motion.a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-lg font-semibold text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-gold transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">{COMPANY_INFO.phone}</p>
                  <p className="text-gray-400 text-xs">Call or WhatsApp</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">{COMPANY_INFO.email}</p>
                  <p className="text-gray-400 text-xs">Email us anytime</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">{COMPANY_INFO.address}</p>
                  <p className="text-gray-400 text-xs">Visit our location</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gold/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                &copy; {currentYear} TryneX Lifestyle. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Made with ❤️ for Bangladesh
              </p>
            </div>
            
            <div className="flex gap-4 text-xs">
              <Link href="/privacy" className="text-gray-400 hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
