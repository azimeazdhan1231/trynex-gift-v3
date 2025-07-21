
import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (items: any[]) => void;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    clearCart,
    total
  } = useCart();

  const calculateTotal = () => {
    return total;
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    removeItem(itemId);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      onCheckout(cartItems);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l border-gold shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/20">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-6 w-6 text-gold" />
                <h2 className="text-xl font-bold text-white">
                  Cart ({cartItems.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gold/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <ShoppingCart className="h-16 w-16 text-gold/50 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Add some products to get started
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-gold text-black px-6 py-2 rounded-lg hover:bg-gold/90 transition-colors font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-900/50 rounded-lg p-4 border border-gold/20"
                      >
                        <div className="flex items-start space-x-3">
                          {/* Product Image */}
                          <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm">
                              {item.name || 'Product'}
                            </h4>
                            <p className="text-gold font-semibold text-sm">
                              ৳{item.price || 0}
                            </p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-gold/20 rounded"
                                >
                                  <Minus className="h-4 w-4 text-white" />
                                </button>
                                <span className="text-white font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-gold/20 rounded"
                                >
                                  <Plus className="h-4 w-4 text-white" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 hover:bg-red-600/20 rounded"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="mt-2 text-right">
                              <span className="text-gold font-semibold">
                                ৳{((item.price || 0) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gold/20 p-4 space-y-4">
                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-white">Total:</span>
                      <span className="text-xl font-bold text-gold">
                        ৳{calculateTotal().toFixed(2)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-gold text-black py-3 rounded-lg hover:bg-gold/90 transition-colors font-semibold"
                      >
                        Checkout
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={onClose}
                          className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Continue Shopping
                        </button>
                        <button
                          onClick={() => clearCart()}
                          className="flex-1 bg-red-600/20 text-red-400 py-2 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          Clear Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
