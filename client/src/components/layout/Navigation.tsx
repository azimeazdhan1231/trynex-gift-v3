
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from '@/components/ui/CartDrawer';

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, isOpen, openCart, closeCart } = useCart();

  const navigation = [
    { name: 'Home', href: '/', nameBn: 'হোম' },
    { name: 'Products', href: '/products', nameBn: 'পণ্য' },
    { name: 'Custom Design', href: '/custom-design', nameBn: 'কাস্টম ডিজাইন' },
    { name: 'Track Order', href: '/track-order', nameBn: 'অর্ডার ট্র্যাক' },
    { name: 'Contact', href: '/contact', nameBn: 'যোগাযোগ' },
    { name: 'About', href: '/about', nameBn: 'সম্পর্কে' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <nav className="bg-black/95 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center space-x-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl font-bold">
                  <span className="text-gold">Tryne</span>
                  <span className="text-white">X</span>
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">
                  Lifestyle
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <motion.a
                    className={`text-sm font-medium transition-colors cursor-pointer ${
                      isActive(item.href)
                        ? 'text-gold'
                        : 'text-white hover:text-gold'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <div className="text-center">
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-400">{item.nameBn}</div>
                    </div>
                  </motion.a>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <motion.button
                onClick={openCart}
                className="relative p-2 text-white hover:text-gold transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Admin Link */}
              <Link href="/admin">
                <motion.button
                  className="p-2 text-white hover:text-gold transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <User className="h-6 w-6" />
                </motion.button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-gold transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-gold/20"
              >
                <div className="py-4 space-y-2">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <motion.a
                        className={`block px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                          isActive(item.href)
                            ? 'text-gold bg-gold/10'
                            : 'text-white hover:text-gold hover:bg-gold/5'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        whileHover={{ x: 4 }}
                        whileTap={{ x: 0 }}
                      >
                        <div>{item.name}</div>
                        <div className="text-xs text-gray-400">{item.nameBn}</div>
                      </motion.a>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isOpen}
        onClose={closeCart}
      />
    </>
  );
}
