
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Phone, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { useCart } from '@/hooks/useCart';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { itemCount } = useCart();

  const navigation = [
    { name: 'Home', href: '/', namebn: 'হোম' },
    { name: 'Products', href: '/products', namebn: 'প্রোডাক্ট' },
    { name: 'Custom Design', href: '/custom-design', namebn: 'কাস্টম ডিজাইন' },
    { name: 'Contact', href: '/contact', namebn: 'যোগাযোগ' },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleCheckout = (items: any[]) => {
    // Close cart drawer and redirect to checkout
    setIsCartOpen(false);
    window.location.href = '/checkout';
  };

  return (
    <>
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gold/30 sticky top-0 z-50">
        {/* Top bar with promo */}
        <div className="bg-gold text-black text-center py-2 px-4 text-sm font-medium">
          📞 মেগা অফার: ১০০০+ অর্ডারে ডিলিভারি ফ্রি | আজই অর্ডার করুন: +8801940689487
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-gold">Trynex</span>
                <span className="text-white"> Lifestyle</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'text-gold bg-gold/10'
                      : 'text-white hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-900 text-white px-4 py-2 pl-10 rounded-lg border border-gold/30 focus:outline-none focus:border-gold w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              {/* Phone */}
              <a
                href="tel:+8801940689487"
                className="flex items-center space-x-2 text-gold hover:text-gold/80 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span className="font-medium">+8801940689487</span>
              </a>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-white hover:text-gold transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Mobile Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-white hover:text-gold transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:text-gold transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 border-t border-gold/30"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-2 pl-10 rounded-lg border border-gold/30 focus:outline-none focus:border-gold"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>

                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActiveRoute(item.href)
                        ? 'text-gold bg-gold/10'
                        : 'text-white hover:text-gold hover:bg-gold/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Phone */}
                <a
                  href="tel:+8801940689487"
                  className="flex items-center space-x-2 px-3 py-2 text-gold hover:text-gold/80 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">+8801940689487</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </>
  );
}
