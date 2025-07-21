import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useCart } from "@/hooks/useCart";
import { formatPrice, calculateDeliveryFee } from "@/utils/helpers";
import { LoadingSpinner } from "./LoadingSpinner";
import { useLocation } from "wouter";

export const CartDrawer = () => {
  const { 
    isOpen, 
    toggleCart, 
    getTotalItems, 
    getSubtotal, 
    getDeliveryFee, 
    getTotal 
  } = useCartStore();

  const { cartItems, updateCart, removeFromCart } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    toggleCart();
    setLocation("/checkout");
  };

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={toggleCart}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-gray border-l border-gold/20 z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gold/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6 text-gold" />
                  <h3 className="text-xl font-bold text-white">Shopping Cart</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={toggleCart}>
                  <X className="h-6 w-6 text-white" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Your cart is empty</p>
                  <p className="text-gray-500 text-sm mt-2">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="glass-effect rounded-lg p-4">
                      <div className="flex gap-4">
                        <img 
                          src={item.product.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{item.product.name}</h4>
                          <p className="text-xs text-gray-300 mb-2">{item.product.namebn}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 border-gold/30"
                                onClick={() => updateCart({ id: item.id, quantity: item.quantity - 1 })}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-white font-semibold min-w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 border-gold/30"
                                onClick={() => updateCart({ id: item.id, quantity: item.quantity + 1 })}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gold font-semibold">
                                {formatPrice(parseFloat(item.product.price) * item.quantity)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gold/20 p-6 bg-black/50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Delivery:</span>
                    <span className="text-white">
                      {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gold/20 pt-2">
                    <span className="text-white">Total:</span>
                    <span className="text-gold">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};