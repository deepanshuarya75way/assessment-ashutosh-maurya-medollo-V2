import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Layouts
import MainLayout from "./layouts/MainLayout";
import Navbar from "./components/Navbar";

// Context Providers
import { CartProvider } from "./context/CartContext";

// Components
import DeliveryStatusModal from "./components/ui/DeliveryStatusModal";

// Direct import for essential pages
import SimpleHomePage from "./pages/SimpleHomePage";

// Lazy loaded pages for better performance
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));
const PrescriptionsPage = lazy(() => import("./pages/PrescriptionsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MedicineDetailsPage = lazy(() => import("./pages/MedicineDetailsPage"));
const VendorPage = lazy(() => import("./pages/VendorPage"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));
// Not Found Page
const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
    <div className="text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-darkblue mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-6">
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-all"
      >
        Back to Home
      </a>
    </div>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    <span className="ml-4 text-lg text-gray-700">Loading...</span>
  </div>
);

function App() {
  return (
    <CartProvider className="overflow-hidden">
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Main Pages */}
              <Route index element={<SimpleHomePage />} />
              <Route path="about" element={<AboutUsPage />} />
              <Route path="contact" element={<ContactUsPage />} />

              {/* Product Pages */}
              <Route path="products" element={<ProductsPage />} />

              {/* Health Services */}
              <Route path="prescriptions" element={<PrescriptionsPage />} />

              {/* Authentication */}
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />

              {/* Shopping */}
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="payment-success" element={<PaymentSuccessPage />} />
              <Route path="order-success" element={<OrderSuccessPage />} />

              {/* User Account */}
              <Route path="profile" element={<ProfilePage />} />

              {/* Vendor Page  */}
              <Route path="vendors" element={<VendorPage />} />
              <Route path="vendor-dashboard" element={<VendorDashboard />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
              <Route
                path="/medicine/:id"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <MedicineDetailsPage />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </Suspense>
        
        {/* Global Components */}
        <DeliveryStatusModal />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
