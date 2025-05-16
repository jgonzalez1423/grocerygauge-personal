import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.product.product_id === product.product_id);
      if (existing) {
        return prevItems.map(item =>
          item.product.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.product_id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
