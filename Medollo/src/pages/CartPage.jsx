import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import PageTransition from '../components/ui/PageTransition';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    isLoggedIn 
  } = useCart();
  
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
    useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { 
        state: { 
          from: '/cart',
          message: 'Please log in to view your cart' 
        } 
      });
    }
  }, [isLoggedIn, navigate]);
  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login', { 
        state: { 
          from: '/checkout',
          message: 'Please log in to checkout' 
        } 
      });
      return;
    }
    
    setIsCheckingOut(true);
    
    // Navigate to checkout page
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };
  
  
  // If cart is empty, show empty cart message
  if (cartItems.length === 0) {
    return (
      <PageTransition variant="fade">
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any products to your cart yet.
              </p>
              <img 
                src="/empty-cart.svg" 
                alt="Empty Cart" 
                className="w-64 h-64 mx-auto mb-8 opacity-75"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark"
              >
                Browse Products
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }


  return (
    <PageTransition variant="fade">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Cart Items ({cartItems.length})
                    </h2>
                    <button 
                      onClick={clearCart}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <p className="text-gray-500 text-sm mt-1">
                            {item.brand || 'Brand not available'}
                          </p>
                          
                          <div className="flex justify-between items-end mt-4">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1 text-gray-800 min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-gray-800">
                                ₹{(item.discountPrice || item.price) * item.quantity}
                              </div>
                              {item.discountPrice && item.price !== item.discountPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  ₹{item.price * item.quantity}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹{cartTotal >= 999 ? '0.00' : '99.00'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between font-semibold text-lg text-gray-800">
                    <span>Total</span>
                    <span>₹{(cartTotal + (cartTotal >= 999 ? 0 : 99) + cartTotal * 0.18).toFixed(2)}</span>
                  </div>
                </div>
                
                {cartTotal < 999 && (
                  <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-md mb-4">
                    Add ₹{(999 - cartTotal).toFixed(2)} more to get free shipping!
                  </div>
                )}
                
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={`w-full py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors 
                    ${isCheckingOut ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <div className="mt-4">
                  <Link 
                    to="/products" 
                    className="text-primary text-sm hover:underline flex items-center justify-center"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-1 rotate-180" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CartPage;