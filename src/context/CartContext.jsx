import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('vendorr-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vendorr-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, customizations = {}, quantity = 1) => {
    console.log('CartContext.addToCart called with:', { item, customizations, quantity });
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
      );

      if (existingItemIndex > -1) {
        // Item with same customizations exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        console.log('Updated existing item in cart:', updatedCart);
        return updatedCart;
      } else {
        // Add new item to cart
        const newCart = [...prevCart, {
          ...item,
          customizations,
          quantity
        }];
        console.log('Added new item to cart:', newCart);
        return newCart;
      }
    });
  };

  const removeFromCart = (itemId, customizations = {}) => {
    setCart(prevCart =>
      prevCart.filter(item =>
        !(item.id === itemId &&
          JSON.stringify(item.customizations) === JSON.stringify(customizations))
      )
    );
  };

  const updateQuantity = (itemId, customizations = {}, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, customizations);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    return count;
  };

  const isInCart = (itemId, customizations = {}) => {
    return cart.some(item =>
      item.id === itemId &&
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );
  };

  const getCartItemQuantity = (itemId, customizations = {}) => {
    const item = cart.find(item =>
      item.id === itemId &&
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getCartItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
