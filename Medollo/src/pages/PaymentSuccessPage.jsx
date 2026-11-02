import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ShoppingBagIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import PageTransition from '../components/ui/PageTransition';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Generate a random order number
  const orderNumber = `MED${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  // Current date for estimated delivery
  const today = new Date();
  const estimatedDelivery = new Date(today);
  estimatedDelivery.setDate(today.getDate() + 3);
  
  // Format the date as DD Month YYYY
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Navigate away if there's no completed order
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cartTotal === 0 && cartItems.length === 0) {
        navigate('/products');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [cartItems, cartTotal, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Section */}
            <div className="bg-green-50 p-8 text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircleIcon className="h-10 w-10 text-green-500" />
              </motion.div>
              
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                Payment Successful!
              </motion.h2>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600"
              >
                Your order has been placed and is being processed
              </motion.p>
            </div>

            {/* Order Details */}
            <motion.div 
              className="p-6 space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium text-gray-800">{orderNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-800">{formatDate(today)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-medium text-gray-800">{formatDate(estimatedDelivery)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Order Total</p>
                    <p className="font-medium text-gray-800">₹{(cartTotal + cartTotal * 0.18).toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Order Summary */}
              <motion.div variants={itemVariants} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({cartItems.length})</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{(cartTotal + cartTotal * 0.18).toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Next Steps */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <ArchiveBoxIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <h4 className="font-medium text-gray-800">Track Your Order</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      You will receive an email with tracking information once your order ships.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <ShoppingBagIcon className="h-5 w-5 text-purple-500 mr-2" />
                      <h4 className="font-medium text-gray-800">View Order History</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      You can track all your orders in your account dashboard.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Action Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4"
              >
                <Link 
                  to="/products" 
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md text-center hover:bg-primary-dark transition"
                  onClick={() => clearCart()}
                >
                  Continue Shopping
                </Link>
                
                <Link 
                  to="/" 
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-center hover:bg-gray-50 transition"
                  onClick={() => clearCart()}
                >
                  Go to Homepage
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PaymentSuccessPage;