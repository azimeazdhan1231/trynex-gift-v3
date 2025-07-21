import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ShoppingCart, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { COMPANY_INFO } from "@/utils/constants";
import { Link, useLocation } from "wouter";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, toggleCart } = useCartStore();
  const isMobile = useIsMobile();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navigationItems = [
    { path: "/", label: "Home", labelbn: "হোম" },
    { path: "/products", label: "Products", labelbn: "প্রোডাক্ট" },
    { path: "/custom-design", label: "Custom Design", labelbn: "কাস্টম ডিজাইন" },
    { path: "/contact", label: "Contact", labelbn: "যোগাযোগ" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-black/90 backdrop-blur-lg border-b border-gold/20" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="hidden md:flex items-center justify-center py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
            <span>🎉 মেগা অফার! ১৫০০৳+ অর্ডারে ফ্রি ডেলিভারি! | আজই অর্ডার করুন! 📞 {COMPANY_INFO.phone}</span>
          </div>

          {/* Main navigation */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold font-poppins">
                <span className="text-gold">TryneX</span>{" "}
                <span className="text-white">Lifestyle</span>
              </Link>

              {!isMobile && (
                <div className="hidden lg:flex space-x-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`hover:text-gold transition-colors ${
                        location === item.path ? "text-gold" : "text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 pl-10 bg-black/50 border-gold/30 text-white"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>

              {/* Phone */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-white">
                <Phone className="h-4 w-4 text-gold" />
                <span>{COMPANY_INFO.phone}</span>
              </div>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCart}
                className="relative text-white hover:text-gold"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* Mobile menu button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:text-gold"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isMobileMenuOpen ? "auto" : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-black/95 backdrop-blur-lg border-t border-gold/20"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center mb-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/50 border-gold/30 text-white"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>

              {/* Mobile Navigation */}
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block py-2 text-lg font-semibold transition-colors ${
                    location === item.path ? "text-gold" : "text-white hover:text-gold"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Contact */}
              <div className="pt-4 border-t border-gold/20">
                <div className="flex items-center gap-2 text-white">
                  <Phone className="h-4 w-4 text-gold" />
                  <span>{COMPANY_INFO.phone}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
};
