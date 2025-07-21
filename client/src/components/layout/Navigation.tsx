import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, X, User, Package, Phone, Palette } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  const navItems = [
    { href: '/', label: 'হোম', labelEn: 'Home' },
    { href: '/products', label: 'পণ্য', labelEn: 'Products' },
    { href: '/custom-design', label: 'কাস্টম ডিজাইন', labelEn: 'Custom Design', icon: Palette },
    { href: '/track-order', label: 'অর্ডার ট্র্যাক', labelEn: 'Track Order', icon: Package },
    { href: '/contact', label: 'যোগাযোগ', labelEn: 'Contact', icon: Phone },
    { href: '/about', label: 'আমাদের সম্পর্কে', labelEn: 'About' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-black/90 backdrop-blur-md border-b border-gold/20 sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-gold to-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xl">T</span>
          </div>
          <div>
            <h1 className="text-gold font-bold text-xl">TryneX</h1>
            <p className="text-white/70 text-xs">Lifestyle</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 ${
                  location === item.href
                    ? 'text-gold bg-gold/10 border border-gold/30'
                    : 'text-white hover:text-gold hover:bg-gold/5'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="font-medium">{item.labelEn}</span>
                <span className="text-xs text-white/60">({item.label})</span>
              </Link>
            );
          })}
        </div>

        {/* Cart & Admin */}
        <div className="flex items-center space-x-4">
          <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:text-gold transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

          <Link
            href="/admin"
            className="p-2 text-white hover:text-gold transition-colors"
          >
            <User className="w-6 h-6" />
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-black/95 backdrop-blur-md border-b border-gold/20 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">T</span>
            </div>
            <div>
              <h1 className="text-gold font-bold">TryneX</h1>
              <p className="text-white/70 text-xs">Lifestyle</p>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:text-gold transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:text-gold transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-black/95 border-t border-gold/20 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 transition-all duration-300 ${
                    location === item.href
                      ? 'text-gold bg-gold/10 border-r-2 border-gold'
                      : 'text-white hover:text-gold hover:bg-gold/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <div>
                    <div className="font-medium">{item.labelEn}</div>
                    <div className="text-sm text-white/60">{item.label}</div>
                  </div>
                </Link>
              );
            })}

            <Link
              href="/admin"
              className="flex items-center space-x-3 px-4 py-3 text-white hover:text-gold hover:bg-gold/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              <div>
                <div className="font-medium">Admin</div>
                <div className="text-sm text-white/60">অ্যাডমিন</div>
              </div>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}