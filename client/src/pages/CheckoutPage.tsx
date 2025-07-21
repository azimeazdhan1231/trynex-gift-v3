import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, MapPin, Phone, User, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/cartStore";
import { useCreateOrder } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, calculateDeliveryFee, validatePhoneNumber, validateEmail, copyToClipboard } from "@/utils/helpers";
import { DISTRICTS, PAYMENT_METHODS, COMPANY_INFO } from "@/utils/constants";
import { useLocation } from "wouter";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrderMutation = useCreateOrder();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    street: "",
    district: "",
    thana: "",
    postalCode: "",
    paymentMethod: "",
    notes: "",
    paymentConfirmed: false,
  });

  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const subtotal = totalPrice;
  const deliveryFee = calculateDeliveryFee(formData.district, subtotal);
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      toast({
        title: "Name is required",
        description: "নাম অবশ্যই দিতে হবে",
        variant: "destructive",
      });
      return false;
    }

    if (!validatePhoneNumber(formData.customerPhone)) {
      toast({
        title: "Valid phone number required",
        description: "সঠিক ফোন নম্বর দিন",
        variant: "destructive",
      });
      return false;
    }

    if (formData.customerEmail && !validateEmail(formData.customerEmail)) {
      toast({
        title: "Valid email required",
        description: "সঠিক ইমেইল দিন",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.street.trim() || !formData.district || !formData.thana.trim()) {
      toast({
        title: "Complete address required",
        description: "সম্পূর্ণ ঠিকানা দিন",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.paymentMethod) {
      toast({
        title: "Payment method required",
        description: "পেমেন্ট পদ্ধতি বেছে নিন",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmitOrder = () => {
    if (!validateForm()) return;

    const orderData = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || undefined,
      customerAddress: {
        street: formData.street,
        district: formData.district,
        thana: formData.thana,
        postalCode: formData.postalCode || undefined,
      },
      items: items.map(item => ({
        productId: item.productId,
        name: item.product.name,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
        customDesign: item.customDesign,
      })),
      subtotal: subtotal.toString(),
      deliveryFee: deliveryFee.toString(),
      total: total.toString(),
      paymentMethod: formData.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      notes: formData.notes || undefined,
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: (order) => {
        clearCart();
        toast({
          title: "Order placed successfully!",
          description: `Order ID: ${order.orderId}`,
        });
        setLocation(`/order-tracking?id=${order.orderId}`);
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

  const copyPaymentNumber = () => {
    copyToClipboard(COMPANY_INFO.paymentNumber).then(success => {
      if (success) {
        toast({
          title: "Number copied!",
          description: "Payment number copied to clipboard",
        });
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-6">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some products to proceed with checkout</p>
            <Button onClick={() => setLocation("/products")} className="bg-gold text-black hover:bg-gold/90">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold font-poppins mb-4 text-shadow">Checkout</h1>
          <p className="text-xl text-gray-300">আপনার অর্ডার সম্পন্ন করুন</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:order-2"
          >
            <Card className="glass-effect sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
                <p className="text-gray-300 text-sm">অর্ডার সারসংক্ষেপ</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.product.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-medium">{item.product.name}</h4>
                        <p className="text-gray-400 text-xs">{item.product.namebn}</p>
                        <p className="text-gold text-sm">
                          {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gold/20 pt-4 space-y-2">
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
                  {subtotal >= 1500 && (
                    <div className="text-xs text-green-400">
                      🎉 Free delivery unlocked!
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-gold/20 pt-2">
                    <span className="text-white">Total:</span>
                    <span className="text-gold">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Payment Info */}
                {showPaymentInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-gold/20 pt-4"
                  >
                    <h4 className="font-semibold text-white mb-2">Payment Information</h4>
                    <div className="bg-black/50 rounded-lg p-3 space-y-2">
                      <p className="text-sm text-gray-300">Send payment to:</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gold font-semibold">{COMPANY_INFO.paymentNumber}</span>
                        <Button size="sm" variant="ghost" onClick={copyPaymentNumber}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Amount: {formatPrice(100)} (Advance)
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Customer Information */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-gold" />
                  Customer Information
                </CardTitle>
                <p className="text-gray-300 text-sm">গ্রাহকের তথ্য</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Full Name *</Label>
                    <Input
                      name="customerName"
                      placeholder="আপনার পূর্ণ নাম"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="bg-black/50 border-gold/30 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Phone Number *</Label>
                    <Input
                      name="customerPhone"
                      placeholder="+880 1XXXXXXXXX"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="bg-black/50 border-gold/30 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white">Email (Optional)</Label>
                  <Input
                    name="customerEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="bg-black/50 border-gold/30 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gold" />
                  Delivery Address
                </CardTitle>
                <p className="text-gray-300 text-sm">ডেলিভারি ঠিকানা</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Street Address *</Label>
                  <Textarea
                    name="street"
                    placeholder="House/Flat number, Street name, Area"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="bg-black/50 border-gold/30 text-white"
                    rows={2}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">District *</Label>
                    <Select value={formData.district} onValueChange={(value) => handleSelectChange("district", value)}>
                      <SelectTrigger className="bg-black/50 border-gold/30 text-white">
                        <SelectValue placeholder="জেলা বেছে নিন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select-district">জেলা নির্বাচন করুন</SelectItem>
                        {DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Thana/Upazila *</Label>
                    <Input
                      name="thana"
                      placeholder="থানা/উপজেলা"
                      value={formData.thana}
                      onChange={handleInputChange}
                      className="bg-black/50 border-gold/30 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white">Postal Code (Optional)</Label>
                  <Input
                    name="postalCode"
                    placeholder="পোস্টাল কোড"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="bg-black/50 border-gold/30 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gold" />
                  Payment Method
                </CardTitle>
                <p className="text-gray-300 text-sm">পেমেন্ট পদ্ধতি</p>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => {
                    handleSelectChange("paymentMethod", value);
                    setShowPaymentInfo(value !== "cod");
                  }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-3 border border-gold/20 rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer text-white">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">💰</div>
                        <div>
                          <div className="font-semibold">Cash on Delivery</div>
                          <div className="text-sm text-gray-300">ক্যাশ অন ডেলিভারি - পণ্য পেয়ে টাকা দিন</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {PAYMENT_METHODS.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2 p-3 border border-gold/20 rounded-lg">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer text-white">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">📱</div>
                          <div>
                            <div className="font-semibold">{method.name}</div>
                            <div className="text-sm text-gray-300">{method.number}</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {showPaymentInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-500">Payment Instructions</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Please send ৳100 advance payment to <strong>{COMPANY_INFO.paymentNumber}</strong> and 
                          confirm your payment below. Rest amount will be collected on delivery.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white">Order Notes (Optional)</CardTitle>
                <p className="text-gray-300 text-sm">অর্ডার নোট</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="notes"
                  placeholder="Any special instructions or requests..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="bg-black/50 border-gold/30 text-white"
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitOrder}
              disabled={createOrderMutation.isPending}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-4 text-lg"
            >
              {createOrderMutation.isPending ? (
                "Processing Order..."
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Place Order - {formatPrice(total)}
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}