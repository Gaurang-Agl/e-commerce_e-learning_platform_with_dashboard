import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Add a product to cart
  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id && i.type !== 'course');
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, 5);
        return prev.map(i =>
          i.productId === product.id && i.type !== 'course' ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.color,
        quantity: Math.min(quantity, 5),
        stockQty: product.stockQty,
        type: 'product'
      }];
    });
  }, []);

  // Add a course to cart (quantity always 1, no duplicates)
  const addCourse = useCallback((course) => {
    setItems(prev => {
      const existing = prev.find(i => i.courseId === course.id && i.type === 'course');
      if (existing) return prev; // Already in cart
      return [...prev, {
        courseId: course.id,
        name: course.title || course.name,
        price: course.price,
        image: course.image,
        color: course.color,
        quantity: 1,
        type: 'course',
        instructor: course.instructor,
        duration: course.duration
      }];
    });
  }, []);

  // Check if a course is already in cart
  const isCourseInCart = useCallback((courseId) => {
    return items.some(i => i.courseId === courseId && i.type === 'course');
  }, [items]);

  const removeItem = useCallback((id, type = 'product') => {
    setItems(prev => prev.filter(i => {
      if (type === 'course') return !(i.courseId === id && i.type === 'course');
      return !(i.productId === id && i.type !== 'course');
    }));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.type !== 'course'
          ? { ...i, quantity: Math.min(quantity, 5) }
          : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + tax;
  const hasPhysicalProducts = items.some(i => i.type !== 'course');
  const hasCourses = items.some(i => i.type === 'course');

  return (
    <CartContext.Provider value={{
      items, isOpen, totalItems, subtotal, tax, grandTotal,
      hasPhysicalProducts, hasCourses,
      addItem, addCourse, isCourseInCart,
      removeItem, updateQuantity, clearCart, openCart, closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
