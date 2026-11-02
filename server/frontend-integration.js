// This file contains instructions on how to connect the frontend to the backend
// You can update the CartContext.jsx file with these changes

/*
1. Add the API_URL constant at the top of your CartContext.jsx:

```jsx
const API_URL = 'http://localhost:4000/api';
```

2. Update the login function in CartContext.jsx to connect to the backend:

```jsx
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }
    
    // Save token to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Update state
    setIsLoggedIn(true);
    
    return {
      success: true,
      user: data.user
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};
```

3. Add a register function to CartContext.jsx:

```jsx
const register = async (name, email, password, phone) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }
    
    // Save token to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Update state
    setIsLoggedIn(true);
    
    return {
      success: true,
      user: data.user
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};
```

4. Update the logout function:

```jsx
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setIsLoggedIn(false);
  // Optionally clear cart on logout
  // clearCart();
};
```

5. Update the value object in CartContext.jsx to include the register function:

```jsx
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
  logout,
  register
};
```
*/