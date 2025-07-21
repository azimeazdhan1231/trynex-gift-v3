
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { FloatingElements } from "@/components/ui/FloatingElements";

// Pages
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import CustomDesignPage from "@/pages/CustomDesignPage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";
import AboutPage from "@/pages/AboutPage";
import TermsPage from "@/pages/TermsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <FloatingElements />
        <Navigation />
        
        <main className="relative z-10">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/order-tracking" component={OrderTrackingPage} />
            <Route path="/custom-design" component={CustomDesignPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/admin" component={AdminPage} />
            <Route>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-300">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</p>
                </div>
              </div>
            </Route>
          </Switch>
        </main>

        <Footer />
        <CartDrawer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
