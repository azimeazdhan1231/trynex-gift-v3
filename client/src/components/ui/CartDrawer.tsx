
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2, CheckCircle2, Copy, CreditCard } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateOrder } from '@/hooks/useOrders';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: (items: any[]) => void;
}

interface OrderForm {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  specialInstructions: string;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    clearCart,
    total
  } = useCart();

  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'payment' | 'success'>('cart');
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    paymentMethod: '',
    specialInstructions: ''
  });
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: string; total: number } | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const { toast } = useToast();
  const createOrderMutation = useCreateOrder();

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

  const copyPaymentNumber = () => {
    navigator.clipboard.writeText('01747292277').then(() => {
      toast({
        title: "Number copied!",
        description: "Payment number copied to clipboard",
      });
    });
  };

  const handleFormSubmit = () => {
    if (!orderForm.customerName.trim()) {
      toast({
        title: "Name required",
        description: "নাম অবশ্যই দিতে হবে",
        variant: "destructive",
      });
      return;
    }

    if (!orderForm.customerPhone.trim()) {
      toast({
        title: "Phone required", 
        description: "ফোন নম্বর অবশ্যই দিতে হবে",
        variant: "destructive",
      });
      return;
    }

    if (!orderForm.customerAddress.trim()) {
      toast({
        title: "Address required",
        description: "ঠিকানা অবশ্যই দিতে হবে", 
        variant: "destructive",
      });
      return;
    }

    if (!orderForm.paymentMethod) {
      toast({
        title: "Payment method required",
        description: "পেমেন্ট পদ্ধতি বেছে নিন",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep('payment');
  };

  const handlePlaceOrder = () => {
    if (!paymentConfirmed) {
      toast({
        title: "Payment confirmation required",
        description: "অগ্রিম পেমেন্ট নিশ্চিত করুন",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      customerName: orderForm.customerName,
      customerPhone: orderForm.customerPhone,
      customerEmail: undefined,
      customerAddress: {
        street: orderForm.customerAddress,
        district: "Dhaka",
        thana: "N/A",
        postalCode: undefined,
      },
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: parseFloat(item.price.toString()),
        quantity: item.quantity,
        customDesign: undefined,
      })),
      subtotal: calculateTotal().toString(),
      deliveryFee: "70",
      total: (calculateTotal() + 70).toString(),
      paymentMethod: orderForm.paymentMethod,
      paymentStatus: "partial", // 100tk advance paid
      orderStatus: "pending",
      notes: orderForm.specialInstructions || undefined,
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: (order) => {
        const orderId = `TRX-${Date.now()}${Math.floor(Math.random() * 1000)}`;
        setOrderSuccess({ 
          orderId: orderId,
          total: calculateTotal() + 70 
        });
        setCurrentStep('success');
        clearCart();
        toast({
          title: "Order placed successfully!",
          description: `Order ID: ${orderId}`,
        });
      },
      onError: () => {
        toast({
          title: "Failed to place order",
          description: "Please try again",
          variant: "destructive",
        });
      },
    });
  };

  const resetAndClose = () => {
    setCurrentStep('cart');
    setOrderForm({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      paymentMethod: '',
      specialInstructions: ''
    });
    setPaymentConfirmed(false);
    setOrderSuccess(null);
    onClose();
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
            onClick={resetAndClose}
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
                  {currentStep === 'cart' && `Cart (${cartItems.length})`}
                  {currentStep === 'checkout' && 'Customer Details'}
                  {currentStep === 'payment' && 'Payment'}
                  {currentStep === 'success' && 'Order Success!'}
                </h2>
              </div>
              <button
                onClick={resetAndClose}
                className="p-2 hover:bg-gold/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Cart Step */}
              {currentStep === 'cart' && (
                <>
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
                        onClick={resetAndClose}
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
                                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                    <ShoppingCart className="h-6 w-6 text-gray-500" />
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium truncate">
                                  {item.name}
                                </h4>
                                <p className="text-gold font-semibold">
                                  ৳{item.price}
                                </p>
                                {item.size && (
                                  <p className="text-gray-400 text-sm">Size: {item.size}</p>
                                )}
                                {item.color && (
                                  <p className="text-gray-400 text-sm">Color: {item.color}</p>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex flex-col items-end space-y-2">
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center text-white transition-colors"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  
                                  <span className="text-white font-medium min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center text-white transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
                              <span className="text-gray-400">Subtotal:</span>
                              <span className="text-gold font-semibold">
                                ৳{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gold/20 p-4 space-y-4">
                        {/* Total */}
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-white font-semibold">Total:</span>
                          <span className="text-gold font-bold">৳{calculateTotal().toFixed(2)}</span>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <button
                            onClick={() => setCurrentStep('checkout')}
                            className="w-full bg-gold text-black py-3 rounded-lg hover:bg-gold/90 transition-colors font-semibold"
                          >
                            Checkout
                          </button>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={resetAndClose}
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
                </>
              )}

              {/* Checkout Step */}
              {currentStep === 'checkout' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                    <Input
                      placeholder="আপনার পূর্ণ নাম"
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                      className="bg-black/50 border-gold/30 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
                    <Input
                      placeholder="+880 1XXXXXXXXX"
                      value={orderForm.customerPhone}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      className="bg-black/50 border-gold/30 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Address *</label>
                    <Textarea
                      placeholder="পূর্ণ ঠিকানা লিখুন"
                      value={orderForm.customerAddress}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerAddress: e.target.value }))}
                      className="bg-black/50 border-gold/30 text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Payment Method *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "bkash", label: "বিকাশ", icon: "💳" },
                        { value: "nagad", label: "নগদ", icon: "💳" },
                        { value: "upay", label: "উপায়", icon: "💳" }
                      ].map((method) => (
                        <Button
                          key={method.value}
                          type="button"
                          variant={orderForm.paymentMethod === method.value ? "default" : "outline"}
                          onClick={() => setOrderForm(prev => ({ ...prev, paymentMethod: method.value }))}
                          className="flex flex-col items-center p-4"
                        >
                          <span className="text-2xl mb-1">{method.icon}</span>
                          <span className="text-sm">{method.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Special Instructions</label>
                    <Textarea
                      placeholder="কোন বিশেষ নির্দেশনা..."
                      value={orderForm.specialInstructions}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
                      className="bg-black/50 border-gold/30 text-white"
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('cart')}
                      className="flex-1"
                    >
                      Back to Cart
                    </Button>
                    <Button 
                      onClick={handleFormSubmit}
                      className="flex-1 bg-gold text-black hover:bg-gold/90"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-500 mb-2">Advance Payment Required</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Please send ৳100 advance payment to complete your order. Rest amount will be collected on delivery.
                    </p>
                    
                    <div className="bg-black/50 rounded-lg p-3 space-y-2">
                      <p className="text-sm text-gray-300">Send ৳100 to:</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gold font-semibold text-lg">01747292277</span>
                        <Button size="sm" variant="ghost" onClick={copyPaymentNumber}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Method: {orderForm.paymentMethod.charAt(0).toUpperCase() + orderForm.paymentMethod.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="payment-confirmed"
                        checked={paymentConfirmed}
                        onChange={(e) => setPaymentConfirmed(e.target.checked)}
                        className="w-4 h-4 text-gold"
                      />
                      <label htmlFor="payment-confirmed" className="text-sm text-white">
                        I have sent ৳100 advance payment (আমি ১০০ টাকা অগ্রিম পেমেন্ট পাঠিয়েছি)
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-white">Order Summary</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white">৳{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Delivery:</span>
                      <span className="text-white">৳70</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Advance Paid:</span>
                      <span className="text-green-400">৳100</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-gray-700 pt-2">
                      <span className="text-white">Total:</span>
                      <span className="text-gold">৳{(calculateTotal() + 70).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Due on Delivery:</span>
                      <span className="text-orange-400">৳{(calculateTotal() + 70 - 100).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('checkout')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={!paymentConfirmed || createOrderMutation.isPending}
                      className="flex-1 bg-gold text-black hover:bg-gold/90 disabled:opacity-50"
                    >
                      {createOrderMutation.isPending ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Success Step */}
              {currentStep === 'success' && orderSuccess && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Order Successful!
                  </h3>
                  <p className="text-gray-300 mb-6">
                    আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে
                  </p>

                  <div className="bg-gray-900/50 rounded-lg p-4 w-full mb-6">
                    <p className="text-sm text-gray-300 mb-2">Your Order ID:</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-bold text-lg">{orderSuccess.orderId}</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => navigator.clipboard.writeText(orderSuccess.orderId)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Total Amount: ৳{orderSuccess.total}
                    </p>
                    <p className="text-xs text-green-400">
                      Advance Paid: ৳100 ✓
                    </p>
                  </div>

                  <p className="text-sm text-gray-300 mb-6">
                    আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। ডেলিভারির সময় বাকি টাকা পরিশোধ করুন।
                  </p>

                  <button
                    onClick={resetAndClose}
                    className="bg-gold text-black px-8 py-3 rounded-lg hover:bg-gold/90 transition-colors font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
