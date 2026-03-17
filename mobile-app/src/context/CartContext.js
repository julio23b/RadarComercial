import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity, selectedSize, selectedColor) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.size === selectedSize &&
        item.color.value === selectedColor.value
    );

    if (existingIndex !== -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      setCartItems([
        ...cartItems,
        {
          product,
          quantity,
          size: selectedSize,
          color: selectedColor,
        },
      ]);
    }
  };

  const removeFromCart = (productId, size, colorValue) => {
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item.product.id === productId && item.size === size && item.color.value === colorValue)
      )
    );
  };

  const clearCart = () => {
  setCartItems([]); 
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
