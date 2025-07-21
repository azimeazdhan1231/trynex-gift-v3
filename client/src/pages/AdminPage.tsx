import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Package, ShoppingCart, Users, BarChart3, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-gold" />
            <h1 className="text-4xl font-bold font-poppins text-shadow">
              Admin Panel
            </h1>
          </div>
          <p className="text-xl text-gray-300">TryneX Lifestyle Management Dashboard</p>
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Live Data Active
          </div>
        </motion.div>

        {/* Admin Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 lg:grid-cols-6 bg-dark-gray border border-gold/20">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Package className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="customers" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Customers</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="orders">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="products">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="customers">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-white">Customer Management</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Customer management coming soon...</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-white">Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Advanced analytics coming soon...</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-white">System Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Settings panel coming soon...</p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
