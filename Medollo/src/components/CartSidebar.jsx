import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon, MinusIcon, ShoppingBagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { 
    isCartOpen, 
    toggleCart, 
    cartItems, 
    cartTotal, 
    cartItemsCount,
    updateQuantity, 
    removeFromCart,
    isLoggedIn 
  } = useCart();
  const navigate = useNavigate();
  const cartRef = useRef(null);

  // Handle click outside to close the cart
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target) && isCartOpen) {
        toggleCart(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartRef, isCartOpen, toggleCart]);

  // Handle checkout button click
  const handleCheckout = () => {
    if (!isLoggedIn) {
      toggleCart(false); // Close the cart
      navigate('/login', { 
        state: { 
          from: '/cart',
          message: 'Please log in to checkout' 
        } 
      });
      return;
    }
    
    toggleCart(false); // Close the cart
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50"
            onClick={() => toggleCart(false)}
          />

          {/* Cart Sidebar */}
          <motion.div
            ref={cartRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full bg-white z-50 w-full max-w-md shadow-xl flex flex-col"
          >
            {/* Cart Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center">
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                Your Cart ({cartItemsCount})
              </h2>
              <button onClick={() => toggleCart(false)} 
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close cart"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            {cartItemsCount === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-6">Your cart is empty</p>
                <button onClick={() => toggleCart(false)} 
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div 
                        key={item.id} 
                        className="flex gap-3 p-2 border border-gray-100 rounded-lg shadow-sm"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-800 text-sm truncate" title={item.name}>
                              {item.name}
                            </h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Remove item"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <p className="text-gray-500 text-xs mt-1">
                            {item.brand || 'Generic'}
                          </p>

                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="w-3 h-3" />
                              </button>
                              <span className="px-2 py-0.5 text-gray-800 text-xs min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-gray-800 text-sm">
                                ₹{(item.discountPrice || item.price) * item.quantity}
                              </div>
                              {item.discountPrice && item.price !== item.discountPrice && (
                                <div className="text-xs text-gray-500 line-through">
                                  ₹{item.price * item.quantity}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart Footer / Summary */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span>{cartTotal >= 999 ? 'Free' : '₹99.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (18%)</span>
                      <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-bold text-gray-800 mb-4">
                    <span>Total</span>
                    <span>₹{(cartTotal + (cartTotal >= 999 ? 0 : 99) + cartTotal * 0.18).toFixed(2)}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center"
                    >
                      Checkout
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </button>
                    
                    <Link 
                      to="/cart" 
                      onClick={toggleCart}
                      className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors text-center"
                    >
                      View Cart Details
                    </Link>
                  </div>

                  {cartTotal < 999 && (
                    <div className="mt-4 bg-blue-50 text-blue-700 text-xs p-2 rounded-md text-center">
                      Add ₹{(999 - cartTotal).toFixed(2)} more to get free shipping!
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;