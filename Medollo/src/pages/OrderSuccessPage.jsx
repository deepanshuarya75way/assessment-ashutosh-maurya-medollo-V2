import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/ui/PageTransition';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { order, orderId } = location.state || {};

  // Fallback values if no order data is passed
  const displayOrderId = order?.orderId || orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const estimatedDelivery = order?.estimatedDelivery ? new Date(order.estimatedDelivery) : new Date();

  if (!order?.estimatedDelivery) {
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
  }

  const formattedDeliveryDate = estimatedDelivery.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition variant="scale">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="inline-flex items-center justify-center rounded-full bg-green-100 p-6 mb-6"
              >
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-800">{displayOrderId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-medium text-gray-800">{formattedDeliveryDate}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Order Status</p>
                  <div className="flex justify-center items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="font-medium text-green-600">Confirmed</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8">
                We've sent a confirmation email with all the details to your registered email address.
                You can also track your order status in the "Orders" section of your account.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/orders"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                >
                  Track Order
                </Link>
                
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark"
                >
                  Continue Shopping
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">What happens next?</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-primary font-bold mb-2">1. Order Processing</div>
                <p className="text-gray-600 text-sm">
                  We've received your order and are preparing it for shipping.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-primary font-bold mb-2">2. Shipping</div>
                <p className="text-gray-600 text-sm">
                  Your items will be packed securely and dispatched within 24 hours.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-primary font-bold mb-2">3. Delivery</div>
                <p className="text-gray-600 text-sm">
                  Your package will be delivered to your doorstep by {formattedDeliveryDate}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrderSuccessPage;