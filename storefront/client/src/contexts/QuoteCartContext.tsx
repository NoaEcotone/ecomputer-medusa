import React, { createContext, useContext, useState, useEffect } from 'react';

export interface QuoteCartItem {
  productId: string;
  productTitle: string;
  productHandle: string;
  productThumbnail?: string;
  rentalType: 'flex' | 'jaar' | 'korte_termijn';
  quantity: number;
  desiredPeriodStart: string;
  desiredPeriodEnd: string;
}

interface QuoteCartContextType {
  items: QuoteCartItem[];
  addItem: (item: QuoteCartItem) => void;
  removeItem: (productId: string, rentalType: string) => void;
  updateQuantity: (productId: string, rentalType: string, quantity: number) => void;
  updateDates: (productId: string, rentalType: string, start: string, end: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(undefined);

const STORAGE_KEY = 'ecomputer_quote_cart';

export const QuoteCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<QuoteCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading quote cart:', error);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: QuoteCartItem) => {
    setItems((prevItems) => {
      // Check if item with same product and rental type already exists
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === newItem.productId && item.rentalType === newItem.rentalType
      );

      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
          desiredPeriodStart: newItem.desiredPeriodStart,
          desiredPeriodEnd: newItem.desiredPeriodEnd,
        };
        return updated;
      } else {
        // Add new item
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (productId: string, rentalType: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.productId === productId && item.rentalType === rentalType))
    );
  };

  const updateQuantity = (productId: string, rentalType: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, rentalType);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.rentalType === rentalType
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateDates = (productId: string, rentalType: string, start: string, end: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.rentalType === rentalType
          ? { ...item, desiredPeriodStart: start, desiredPeriodEnd: end }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <QuoteCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateDates,
        clearCart,
        getTotalItems,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  );
};

export const useQuoteCart = () => {
  const context = useContext(QuoteCartContext);
  if (!context) {
    throw new Error('useQuoteCart must be used within QuoteCartProvider');
  }
  return context;
};
