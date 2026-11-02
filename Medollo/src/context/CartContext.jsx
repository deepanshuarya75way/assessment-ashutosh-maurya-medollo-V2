import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
    }
    
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart - now requires authentication

const addToCart = (product, quantity = 1) => {
  if (!isLoggedIn) {
    return false;
  }

  // Helper to parse price-like values ("₹120", "120.00", "MRP: 120")
  const parseNumber = (v) => {
    if (v == null) return NaN;
    if (typeof v === "number") return v;
    const cleaned = String(v).replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
    return isNaN(n) ? NaN : n;
  };

  const productId = product.id || product._id || product.product_id || product.name;

  const mrp = parseNumber(product.mrp ?? product.MRP ?? product.mrp_price ?? product.mrpPrice ?? product.price);
  const regular = parseNumber(product.price ?? product.regularPrice ?? product.regular_price ?? product.regular);
  const discount = parseNumber(product.discountPrice ?? product.discount_price ?? product.memberPrice ?? product.member_price ?? product.salePrice);

  const normalized = {
    ...product,
    id: productId,
    mrp: !isNaN(mrp) ? mrp : undefined,
    price: !isNaN(regular) ? regular : (!isNaN(mrp) ? mrp : 0),
    discountPrice: !isNaN(discount) ? discount : ( !isNaN(regular) ? regular : (!isNaN(mrp) ? mrp : undefined) ),
  };

  setCartItems((prevItems) => {
    const existingIndex = prevItems.findIndex((it) => (it.id || it._id || it.name) === productId);

    if (existingIndex >= 0) {
      const updated = [...prevItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: (updated[existingIndex].quantity || 0) + quantity,
        // ensure prices remain normalized
        price: normalized.price,
        discountPrice: normalized.discountPrice,
        mrp: normalized.mrp,
      };
      return updated;
    } else {
      return [...prevItems, { ...normalized, quantity }];
    }
  });

  return true;
};



  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update quantity of item in cart
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items in cart
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + price * item.quantity;
  }, 0);

  // Toggle cart sidebar
  const toggleCart = (forceState) => {
    // If forceState is provided, set to that value, otherwise toggle
    if (forceState !== undefined) {
      // Only change state if it's different from current state
      // This prevents unnecessary re-renders when trying to open an already open cart
      setIsCartOpen(prevState => {
        if (prevState !== forceState) {
          return forceState;
        }
        return prevState;
      });
    } else {
      setIsCartOpen(prev => !prev);
    }
  };

  // Login function
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    // Optionally clear cart on logout
    // clearCart();
  };

  const value = {
    cartItems,
    isCartOpen,
    isLoggedIn,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemsCount,
    cartTotal,
    toggleCart,
    login,
    logout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};