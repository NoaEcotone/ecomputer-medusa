import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Cart,
  getCart,
  addToCart as addToCartAPI,
  updateCartItem as updateCartItemAPI,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
  getCartItemCount,
} from '@/lib/cart';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  isCartOpen: boolean;
  addToCart: (variantId: string, quantity?: number, productTitle?: string) => Promise<void>;
  updateCartItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const existingCart = await getCart();
      setCart(existingCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    try {
      const existingCart = await getCart();
      setCart(existingCart);
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  const addToCart = async (variantId: string, quantity: number = 1, productTitle?: string) => {
    try {
      const updatedCart = await addToCartAPI(variantId, quantity);
      setCart(updatedCart);
      
      toast.success(
        productTitle 
          ? `${productTitle} toegevoegd aan winkelwagen` 
          : 'Product toegevoegd aan winkelwagen'
      );
      
      // Open cart drawer after adding
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Kon product niet toevoegen aan winkelwagen');
      throw error;
    }
  };

  const updateCartItem = async (lineItemId: string, quantity: number) => {
    try {
      const updatedCart = await updateCartItemAPI(lineItemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Kon aantal niet bijwerken');
      throw error;
    }
  };

  const removeFromCart = async (lineItemId: string) => {
    try {
      const updatedCart = await removeFromCartAPI(lineItemId);
      setCart(updatedCart);
      toast.success('Product verwijderd uit winkelwagen');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Kon product niet verwijderen');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      setCart(null);
      toast.success('Winkelwagen geleegd');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Kon winkelwagen niet legen');
      throw error;
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const itemCount = getCartItemCount(cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        isCartOpen,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
