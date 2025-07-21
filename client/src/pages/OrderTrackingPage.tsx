import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Package, Clock, Truck, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrder } from "@/hooks/useOrders";
import { useOrdersRealtime } from "@/hooks/useSupabase";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatPrice, getOrderStatusColor, getOrderStatusText, openWhatsApp } from "@/utils/helpers";
import { COMPANY_INFO } from "@/utils/constants";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const { data: order, isLoading, error } = useOrder(searchOrderId);
  const { isConnected } = useOrdersRealtime();

  // Get order ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setOrderId(id);
      setSearchOrderId(id);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setSearchOrderId(orderId.trim());
    }
  };

  const getStatusSteps = () => [
    {
      status: "pending",
      label: "Order Placed",
      labelBn: "অর্ডার গৃহীত",
      icon: <Package className="h-5 w-5" />,
      description: "Your order has been received",
    },
    {
      status: "confirmed",
      label: "Confirmed",
      labelBn: "নিশ্চিত",
      icon: <CheckCircle2 className="h-5 w-5" />,
      description: "Order confirmed by our team",
    },
    {
      status: "processing",
      label: "Processing",
      labelBn: "প্রস্তুত",
      icon: <Clock className="h-5 w-5" />,
      description: "Your order is being prepared",
    },
    {
      status: "shipped",
      label: "Shipped",
      labelBn: "পাঠানো",
      icon: <Truck className="h-5 w-5" />,
      description: "Order is on the way",
    },
    {
      status: "delivered",
      label: "Delivered",
      labelBn: "ডেলিভার",
      icon: <CheckCircle2 className="h-5 w-5" />,
      description: "Order delivered successfully",
    },
  ];

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    const steps = getStatusSteps();
    return steps.findIndex(step => step.status === order.orderStatus);
  };

  return (
    <div className="min-h-screen pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold font-poppins mb-4 text-shadow">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-300">আপনার অর্ডার ট্র্যাক করুন</p>
          {isConnected && (
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Real-time Updates Active
            </div>
          )}
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <Card className="glass-effect">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Order ID
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter your order ID (e.g., TRY-123456)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="pl-10 bg-black/50 border-gold/30 text-white"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gold text-black hover:bg-gold/90"
                  disabled={!orderId.trim() || isLoading}
                >
                  {isLoading ? "Searching..." : "Track Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Details */}
        {isLoading && (
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="text-gray-300 mt-4">Searching for your order...</p>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold mb-2 text-white">Order Not Found</h3>
            <p className="text-gray-400 mb-6">
              Please check your order ID and try again.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => openWhatsApp(`Hi, I need help tracking my order: ${orderId}`)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Support
              </Button>
              <Button
                onClick={() => window.location.href = `tel:${COMPANY_INFO.phone}`}
                variant="outline"
                className="border-gold/30 text-white hover:bg-gold hover:text-black"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
            </div>
          </motion.div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <Card className="glass-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Order #{order.orderId}</CardTitle>
                    <p className="text-gray-300 text-sm">
                      Placed on {new Date(order.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={`${getOrderStatusColor(order.orderStatus)} bg-transparent border`}>
                    {getOrderStatusText(order.orderStatus)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Status Progress */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">Order Progress</h3>
                  <div className="space-y-4">
                    {getStatusSteps().map((step, index) => {
                      const currentStep = getCurrentStepIndex();
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;
                      const isCancelled = order.orderStatus === "cancelled";

                      return (
                        <div
                          key={step.status}
                          className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                            isCurrent && !isCancelled
                              ? "bg-gold/20 border border-gold/30"
                              : isCompleted && !isCancelled
                              ? "bg-green-500/20 border border-green-500/30"
                              : "bg-gray-800/50 border border-gray-700"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-full ${
                              isCurrent && !isCancelled
                                ? "bg-gold text-black"
                                : isCompleted && !isCancelled
                                ? "bg-green-500 text-white"
                                : "bg-gray-700 text-gray-400"
                            }`}
                          >
                            {step.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-semibold ${
                                  isCurrent && !isCancelled
                                    ? "text-gold"
                                    : isCompleted && !isCancelled
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }`}
                              >
                                {step.label}
                              </span>
                              <span className="text-sm text-gray-400">• {step.labelBn}</span>
                            </div>
                            <p className="text-sm text-gray-300">{step.description}</p>
                          </div>
                          {isCurrent && !isCancelled && (
                            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                          )}
                        </div>
                      );
                    })}

                    {order.orderStatus === "cancelled" && (
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                        <div className="p-2 rounded-full bg-red-500 text-white">
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-red-400">Order Cancelled</span>
                          <p className="text-sm text-gray-300">This order has been cancelled</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-black/30 rounded-lg">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{item.name}</h4>
                          <p className="text-sm text-gray-300">
                            Quantity: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-gold font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="border-t border-gold/20 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Delivery Fee:</span>
                    <span className="text-white">
                      {parseFloat(order.deliveryFee) === 0 ? "Free" : formatPrice(order.deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gold/20 pt-2">
                    <span className="text-white">Total:</span>
                    <span className="text-gold">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-6 border-t border-gold/20 pt-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Customer Information</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">Name: <span className="text-white">{order.customerName}</span></p>
                      <p className="text-gray-300">Phone: <span className="text-white">{order.customerPhone}</span></p>
                      {order.customerEmail && (
                        <p className="text-gray-300">Email: <span className="text-white">{order.customerEmail}</span></p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Delivery Address</h4>
                    <div className="text-sm text-gray-300">
                      <p>{order.customerAddress.street}</p>
                      <p>{order.customerAddress.thana}, {order.customerAddress.district}</p>
                      {order.customerAddress.postalCode && <p>{order.customerAddress.postalCode}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Section */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
                <p className="text-gray-300 text-sm">সাহায্য প্রয়োজন?</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => openWhatsApp(`Hi, I have a question about my order ${order.orderId}`)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Support
                  </Button>
                  <Button
                    onClick={() => window.location.href = `tel:${COMPANY_INFO.phone}`}
                    variant="outline"
                    className="border-gold/30 text-white hover:bg-gold hover:text-black"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Available 24/7 • Response within 1 hour
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
